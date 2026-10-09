from datetime import datetime, timedelta

import numpy as np
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from database.database import get_db
from database.models import Base, Carregador, Sessao, Usuario
from main import app


@pytest.fixture()
def cliente(monkeypatch):
    monkeypatch.setenv("EV_CHARGEOPS_ADMIN_PASSWORD", "test-password")
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False},
                           poolclass=StaticPool)
    Base.metadata.create_all(engine)
    Maker = sessionmaker(bind=engine)
    rng = np.random.default_rng(1)
    with Session(engine) as s:
        us = [Usuario(nome=n, email=f"{n}@t.com", senha="x") for n in ("Ana", "Bruno", "Carla")]
        s.add_all(us)
        cs = [Carregador(nome=f"Carregador {i}", serial_number=f"S{i}", potencia_maxima=7.4,
                         status="disponivel", modelo="GW") for i in (1, 2)]
        s.add_all(cs)
        s.flush()
        agora = datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)
        for d in range(60):
            for k in range(6):
                u = us[1] if k == 0 else us[(d + k) % 3]      # Bruno consome mais
                ch = cs[0] if k < 4 else cs[1]                # Carregador 1 mais usado
                kwh = 10 + float(rng.normal(0, 1))
                s.add(Sessao(usuario_id=u.id, carregador_id=ch.id,
                             inicio=agora - timedelta(days=d, hours=k * 2), consumo_kwh=kwh,
                             duracao=90.0, tarifa=1.0, valor_total=kwh * 1.0,
                             confirmado=True, status="CONCLUIDA" if (d + k) % 2 else "finalizada"))
        s.commit()
        ids = {u.nome: u.id for u in us}

    def _db():
        with Maker() as s:
            yield s

    app.dependency_overrides[get_db] = _db
    c = TestClient(app)
    c.auth = ("admin", "test-password")
    c.ids, c.Maker = ids, Maker
    yield c
    app.dependency_overrides.clear()


def perguntar(c, texto, usuario=None):
    body = {"pergunta": texto}
    if usuario:
        body["usuario_id"] = usuario
    return c.post("/assistente-ia/perguntar", json=body)


def soma(c, campo, usuario=None):
    with c.Maker() as s:
        q = s.query(Sessao).filter(Sessao.inicio >= datetime.now().replace(
            day=1, hour=0, minute=0, second=0, microsecond=0))
        if usuario:
            q = q.filter(Sessao.usuario_id == usuario)
        return round(sum(getattr(x, campo) for x in q), 2)


def test_admin_consumo_e_faturamento_batem_com_banco(cliente):
    r = perguntar(cliente, "Qual foi o consumo total deste mês?").json()
    assert r["dados"]["consumo_kwh"] == soma(cliente, "consumo_kwh")
    r = perguntar(cliente, "Quanto foi faturado este mês?").json()
    assert r["dados"]["valor"] == soma(cliente, "valor_total")


def test_usuario_ve_apenas_o_proprio_consumo(cliente):
    ana = cliente.ids["Ana"]
    r = perguntar(cliente, "quanto consumi este mês?", ana).json()
    assert r["dados"]["consumo_kwh"] == soma(cliente, "consumo_kwh", ana)
    assert r["dados"]["consumo_kwh"] < soma(cliente, "consumo_kwh")


def test_usuario_nao_acessa_perguntas_de_admin(cliente):
    for t in ["Qual usuário mais consumiu energia?", "Qual carregador foi mais utilizado?",
              "Existem sessões anormais?", "Qual a previsão de consumo para os próximos 7 dias?"]:
        r = perguntar(cliente, t, cliente.ids["Ana"]).json()
        assert "permissão" in r["resposta"] and r["dados"] is None, t


def test_usuario_inexistente_404(cliente):
    assert perguntar(cliente, "quanto consumi este mês?", 999).status_code == 404


def test_tops(cliente):
    assert perguntar(cliente, "Qual usuário mais consumiu energia?").json()["dados"]["usuario"] == "Bruno"
    assert perguntar(cliente, "Qual carregador foi mais utilizado?").json()["dados"]["carregador"] == "Carregador 1"


def test_aceita_os_dois_status(cliente):
    with cliente.Maker() as s:
        assert {x.status for x in s.query(Sessao)} == {"CONCLUIDA", "finalizada"}
    r = perguntar(cliente, "consumo dos últimos 60 dias").json()
    limite = datetime.combine(datetime.now().date() - timedelta(days=59), datetime.min.time())
    with cliente.Maker() as s:
        esperado = s.query(Sessao).filter(Sessao.inicio >= limite).count()
    assert r["dados"]["sessoes"] == esperado


def test_mes_passado_e_ultima_recarga(cliente):
    assert perguntar(cliente, "consumo total do mês passado").json()["dados"]["consumo_kwh"] > 0
    r = perguntar(cliente, "qual foi minha última recarga?", cliente.ids["Ana"]).json()
    assert r["dados"]["kwh"] > 0


def test_previsao_e_anomalias_reaproveitam_os_modelos_do_time(cliente):
    r = perguntar(cliente, "Qual é a previsão de consumo para os próximos 7 dias?").json()
    assert r["dados"]["dias"] == 7 and "demonstrativa" in r["aviso"]
    r = perguntar(cliente, "Existem sessões anormais?").json()
    assert "quantidade" in r["dados"] and "demonstrativa" in r["aviso"]


def test_pergunta_desconhecida(cliente):
    assert perguntar(cliente, "qual a capital da França?").json()["intencao"] == "desconhecida"


def test_rotas_ia_originais_do_time_continuam(cliente):
    for rota in ("/ia/previsao-consumo", "/ia/anomalias", "/ia/resumo", "/ia/indicadores"):
        assert cliente.get(rota).status_code == 200, rota


# ---------------------------------------------------------------- meses e perguntas compostas
from datetime import date

from services.assistente_ia_service import (NOMES_MES, detectar_intencoes,
                                            detectar_periodo)


def _mes_anterior():
    hoje = date.today()
    ano, mes = (hoje.year - 1, 12) if hoje.month == 1 else (hoje.year, hoje.month - 1)
    return ano, mes


def _soma_mes(c, campo, ano, mes, usuario=None):
    ini = datetime(ano, mes, 1)
    fim = datetime(ano + 1, 1, 1) if mes == 12 else datetime(ano, mes + 1, 1)
    with c.Maker() as s:
        q = s.query(Sessao).filter(Sessao.inicio >= ini, Sessao.inicio < fim)
        if usuario:
            q = q.filter(Sessao.usuario_id == usuario)
        return round(sum(getattr(x, campo) for x in q), 2)


def test_periodo_por_nome_numero_e_data():
    hoje = date(2026, 9, 29)
    assert detectar_periodo("consumo em agosto", hoje)[:2] == (date(2026, 8, 1), date(2026, 9, 1))
    assert detectar_periodo("consumo no mes 8", hoje)[2] == "agosto de 2026"
    assert detectar_periodo("consumo em 08/2025", hoje)[2] == "agosto de 2025"
    assert detectar_periodo("consumo em dezembro", hoje)[2] == "dezembro de 2025"  # nunca no futuro
    assert detectar_periodo("consumo em março de 2024", hoje)[2] == "março de 2024"
    assert detectar_periodo("consumo", hoje)[2] == "este mês"


def test_mes_por_nome_devolve_dados_daquele_mes(cliente):
    ano, mes = _mes_anterior()
    r = perguntar(cliente, f"quanto consumi em {NOMES_MES[mes - 1]}?", cliente.ids["Ana"]).json()
    assert r["periodo"] == f"{NOMES_MES[mes - 1]} de {ano}"
    assert r["dados"]["consumo_kwh"] == _soma_mes(cliente, "consumo_kwh", ano, mes, cliente.ids["Ana"])
    r2 = perguntar(cliente, f"quanto consumi no mês {mes}?", cliente.ids["Ana"]).json()
    assert r2["dados"]["consumo_kwh"] == r["dados"]["consumo_kwh"]


def test_pergunta_composta_responde_as_duas_coisas(cliente):
    ano, mes = _mes_anterior()
    assert detectar_intencoes("quanto consumi no mes 8 e qual o valor da minha fatura?") == \
        ["consumo_total", "faturamento"]
    r = perguntar(cliente, f"quanto consumi no mês {mes} e qual o valor da minha fatura?",
                  cliente.ids["Bruno"]).json()
    assert r["intencao"] == "consumo_total+faturamento"
    assert r["dados"]["consumo_total"]["consumo_kwh"] == _soma_mes(cliente, "consumo_kwh", ano, mes, cliente.ids["Bruno"])
    assert r["dados"]["faturamento"]["valor"] == _soma_mes(cliente, "valor_total", ano, mes, cliente.ids["Bruno"])
    assert "kWh" in r["resposta"] and "R$" in r["resposta"]


def test_periodo_sem_sessoes_avisa_e_informa_a_ultima(cliente):
    r = perguntar(cliente, "quanto consumi em janeiro de 2020?", cliente.ids["Ana"]).json()
    assert "Não há sessões concluídas registradas em janeiro de 2020" in r["resposta"] and "última sessão" in r["resposta"]
    assert r["dados"]["sessoes"] == 0 and r["dados"]["ultima_sessao"]


def test_frases_top_nao_viram_consumo_total():
    assert detectar_intencoes("Qual usuário mais consumiu energia?") == ["usuario_top"]
    assert detectar_intencoes("previsão de consumo dos próximos 7 dias") == ["previsao"]


def test_composta_com_parte_de_admin_nega_so_a_parte_restrita(cliente):
    r = perguntar(cliente, "quanto consumi este mês e existem sessões anormais?", cliente.ids["Ana"]).json()
    assert "permissão" in r["resposta"] and ("kWh" in r["resposta"] or "Não há sessões" in r["resposta"])
    assert "sessoes_anormais" not in (r["dados"] or {})
