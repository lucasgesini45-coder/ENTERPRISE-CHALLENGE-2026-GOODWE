"""EV ChargeOps AI: responde perguntas com os dados reais da plataforma.

Fluxo: pergunta -> intenção -> permissão -> ferramenta (banco / services.ia_service)
       -> dados estruturados -> resposta em linguagem natural.

Não altera nada em services/ia_service.py: só reaproveita prever_consumo e
detectar_anomalias (RandomForest e IsolationForest já existentes).
"""

import re
import unicodedata
from datetime import date, datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from database.models import Carregador, Sessao, Usuario
from schemas.assistente_ia import ContextoUsuario, Papel, RespostaOut

# O seed grava "finalizada" e o sessao_service grava "CONCLUIDA": aceitamos os dois.
STATUS_VALIDOS = ("CONCLUIDA", "FINALIZADA")

AVISO_PREVISAO = (
    "Previsão demonstrativa: a base de dados ainda é pequena e o modelo "
    "não foi validado para uso em produção."
)
AVISO_ANOMALIA = (
    "Detecção demonstrativa: pode haver falsos positivos e o modelo "
    "não foi validado para uso em produção."
)

# A ordem importa: do mais específico ao mais genérico.
INTENCOES = {
    "sessoes_anormais": ["anorma", "anomalia", "suspeit", "estranh"],
    "previsao": ["previsao", "prever", "previsto", "estimativa de consumo"],
    "usuario_top": ["usuario mais", "quem mais consumiu", "maior consumidor"],
    "carregador_top": ["carregador mais", "mais utilizado", "mais usado"],
    "faturamento": ["fatur", "receita", "quanto gastei", "quanto paguei", "quanto devo"],
    "ultima_recarga": ["ultima recarga", "ultima sessao", "recarga mais recente"],
    "consumo_total": ["consum", "energia", "kwh"],
}
SOMENTE_ADMIN = {"usuario_top", "carregador_top", "sessoes_anormais", "previsao"}


def _normalizar(texto: str) -> str:
    texto = unicodedata.normalize("NFD", texto.lower())
    return "".join(c for c in texto if unicodedata.category(c) != "Mn")


def detectar_intencoes(pergunta: str) -> list[str]:
    """Todas as intenções citadas, na ordem em que aparecem no texto."""
    p = _normalizar(pergunta)
    achadas = {}
    for intencao, termos in INTENCOES.items():
        posicoes = [p.find(t) for t in termos if t in p]
        if posicoes:
            achadas[intencao] = min(posicoes)
    # "quem mais consumiu" e "previsão de consumo" também contêm "consum": não é consumo total
    if "usuario_top" in achadas or "previsao" in achadas:
        achadas.pop("consumo_total", None)
    return sorted(achadas, key=achadas.get)


def detectar_intencao(pergunta: str) -> str | None:
    intencoes = detectar_intencoes(pergunta)
    return intencoes[0] if intencoes else None


MESES = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho",
         "agosto", "setembro", "outubro", "novembro", "dezembro"]
NOMES_MES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
             "agosto", "setembro", "outubro", "novembro", "dezembro"]


def _mes_completo(ano: int, mes: int):
    inicio = date(ano, mes, 1)
    fim = date(ano + 1, 1, 1) if mes == 12 else date(ano, mes + 1, 1)
    return inicio, fim, f"{NOMES_MES[mes - 1]} de {ano}"


def detectar_periodo(pergunta: str, hoje: date | None = None):
    """Devolve (inicio, fim_exclusivo, rotulo). Padrão: mês atual."""
    hoje = hoje or date.today()
    p = _normalizar(pergunta)
    primeiro_do_mes = hoje.replace(day=1)

    if "mes passado" in p or "mes anterior" in p:
        fim = primeiro_do_mes
        return (fim - timedelta(days=1)).replace(day=1), fim, "mês passado"
    if "hoje" in p:
        return hoje, hoje + timedelta(days=1), "hoje"
    m = re.search(r"ultimos?\s+(\d+)\s+dias", p)
    if m:
        n = min(int(m.group(1)), 365)
        return hoje - timedelta(days=n - 1), hoje + timedelta(days=1), f"últimos {n} dias"

    # mês específico: "08/2026", "agosto", "mês 8", "mês de agosto de 2025"
    mes = ano = None
    m = re.search(r"\b(\d{1,2})/(20\d{2})\b", p)
    if m and 1 <= int(m.group(1)) <= 12:
        mes, ano = int(m.group(1)), int(m.group(2))
    else:
        m = re.search(r"\b(" + "|".join(MESES) + r")\b", p)
        if m:
            mes = MESES.index(m.group(1)) + 1
        else:
            m = re.search(r"\bmes\s+(?:de\s+)?(\d{1,2})\b", p)
            if m and 1 <= int(m.group(1)) <= 12:
                mes = int(m.group(1))
    if mes:
        if ano is None:
            a = re.search(r"\b(20\d{2})\b", p)
            # sem ano explícito: a ocorrência mais recente desse mês (nunca no futuro)
            ano = int(a.group(1)) if a else (hoje.year if mes <= hoje.month else hoje.year - 1)
        return _mes_completo(ano, mes)

    if "semana" in p:
        return hoje - timedelta(days=6), hoje + timedelta(days=1), "últimos 7 dias"
    return primeiro_do_mes, hoje + timedelta(days=1), "este mês"


# ---------------------------------------------------------------- ferramentas
def _dt(d: date) -> datetime:
    return datetime.combine(d, datetime.min.time())


def _sessoes(db: Session, ctx: ContextoUsuario, inicio: date, fim: date):
    """Único ponto de acesso às sessões: aqui mora o escopo admin x usuário."""
    q = db.query(Sessao).filter(
        func.upper(Sessao.status).in_(STATUS_VALIDOS), Sessao.confirmado.is_(True),
        Sessao.consumo_kwh.isnot(None),
        Sessao.inicio >= _dt(inicio),
        Sessao.inicio < _dt(fim),
    )
    if ctx.papel == Papel.USUARIO:
        q = q.filter(Sessao.usuario_id == ctx.usuario_id)
    return q


def _ultima_sessao(db: Session, ctx: ContextoUsuario) -> str | None:
    q = db.query(func.max(Sessao.inicio)).filter(
        func.upper(Sessao.status).in_(STATUS_VALIDOS), Sessao.confirmado.is_(True), Sessao.consumo_kwh.isnot(None)
    )
    if ctx.papel == Papel.USUARIO:
        q = q.filter(Sessao.usuario_id == ctx.usuario_id)
    v = q.scalar()
    if isinstance(v, str):
        v = datetime.fromisoformat(v)
    return v.strftime("%d/%m/%Y") if v else None


def ferramenta_consumo_total(db, ctx, periodo, pergunta):
    kwh, qtd = _sessoes(db, ctx, *periodo).with_entities(
        func.coalesce(func.sum(Sessao.consumo_kwh), 0), func.count(Sessao.id)
    ).one()
    r = {"consumo_kwh": round(float(kwh), 2), "sessoes": int(qtd)}
    if not qtd:
        r["ultima_sessao"] = _ultima_sessao(db, ctx)
    return r


def ferramenta_faturamento(db, ctx, periodo, pergunta):
    valor, kwh, qtd = _sessoes(db, ctx, *periodo).with_entities(
        func.coalesce(func.sum(Sessao.valor_total), 0),
        func.coalesce(func.sum(Sessao.consumo_kwh), 0),
        func.count(Sessao.id),
    ).one()
    r = {"valor": round(float(valor), 2), "consumo_kwh": round(float(kwh), 2),
         "sessoes": int(qtd)}
    if not qtd:
        r["ultima_sessao"] = _ultima_sessao(db, ctx)
    return r


def ferramenta_usuario_top(db, ctx, periodo, pergunta):
    linha = (
        db.query(Usuario.nome, func.sum(Sessao.consumo_kwh).label("kwh"))
        .join(Sessao, Sessao.usuario_id == Usuario.id)
        .filter(func.upper(Sessao.status).in_(STATUS_VALIDOS), Sessao.confirmado.is_(True),
                Sessao.inicio >= _dt(periodo[0]), Sessao.inicio < _dt(periodo[1]))
        .group_by(Usuario.id)
        .order_by(func.sum(Sessao.consumo_kwh).desc())
        .first()
    )
    return {"usuario": linha.nome, "kwh": round(float(linha.kwh), 2)} if linha else {}


def ferramenta_carregador_top(db, ctx, periodo, pergunta):
    linha = (
        db.query(Carregador.nome, func.count(Sessao.id).label("qtd"))
        .join(Sessao, Sessao.carregador_id == Carregador.id)
        .filter(func.upper(Sessao.status).in_(STATUS_VALIDOS), Sessao.confirmado.is_(True),
                Sessao.inicio >= _dt(periodo[0]), Sessao.inicio < _dt(periodo[1]))
        .group_by(Carregador.id)
        .order_by(func.count(Sessao.id).desc())
        .first()
    )
    return {"carregador": linha.nome, "sessoes": int(linha.qtd)} if linha else {}


MSG_SEM_SKLEARN = ("o módulo de IA (scikit-learn) não pôde ser carregado neste computador. "
                   "As demais consultas continuam funcionando")


def ferramenta_sessoes_anormais(db, ctx, periodo, pergunta):
    try:
        from services.ia_service import detectar_anomalias  # IsolationForest já existente
        res = detectar_anomalias(db)
    except ImportError:
        return {"erro": MSG_SEM_SKLEARN}
    if not res.get("sucesso"):
        return {"erro": res.get("erro", "Não foi possível analisar as sessões.")}
    return {
        "analisadas": res["total_sessoes_analisadas"],
        "quantidade": res["total_anomalias"],
        "sessoes": [
            {"sessao_id": a["sessao_id"], "usuario_id": a["usuario_id"],
             "carregador_id": a["carregador_id"], "consumo_kwh": a["consumo_kwh"],
             "motivos": a["motivos"]}
            for a in res["anomalias"][:5]
        ],
    }


def ferramenta_previsao(db, ctx, periodo, pergunta):
    m = re.search(r"(\d+)\s*dias", _normalizar(pergunta))
    dias = max(1, min(int(m.group(1)), 30)) if m else 7
    try:
        from services.ia_service import prever_consumo  # RandomForest já existente
        res = prever_consumo(db=db, dias_previsao=dias)
    except ImportError:
        return {"erro": MSG_SEM_SKLEARN}
    if not res.get("sucesso"):
        return {"erro": res.get("erro", "Não foi possível gerar a previsão.")}
    return {
        "dias": dias,
        "total_estimado_kwh": res["consumo_total_previsto_kwh"],
        "horario_pico": res["horario_pico_previsto"],
        "nivel_demanda": res["nivel_demanda"],
    }


def ferramenta_ultima_recarga(db, ctx, periodo, pergunta):
    q = db.query(Sessao).filter(func.upper(Sessao.status).in_(STATUS_VALIDOS), Sessao.confirmado.is_(True))
    if ctx.papel == Papel.USUARIO:
        q = q.filter(Sessao.usuario_id == ctx.usuario_id)
    s = q.order_by(Sessao.inicio.desc()).first()
    if not s:
        return {}
    return {
        "data": s.inicio.strftime("%d/%m/%Y %H:%M"),
        "kwh": round(float(s.consumo_kwh or 0), 2),
        "valor": round(float(s.valor_total or 0), 2),
        "carregador_id": s.carregador_id,
    }


FERRAMENTAS = {
    "consumo_total": ferramenta_consumo_total,
    "faturamento": ferramenta_faturamento,
    "usuario_top": ferramenta_usuario_top,
    "carregador_top": ferramenta_carregador_top,
    "sessoes_anormais": ferramenta_sessoes_anormais,
    "previsao": ferramenta_previsao,
    "ultima_recarga": ferramenta_ultima_recarga,
}


# ------------------------------------------------------- linguagem natural
def _brl(v: float) -> str:
    return f"R$ {v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def _em(periodo: str) -> str:
    """'este mês' -> 'neste mês', 'agosto de 2026' -> 'em agosto de 2026', etc."""
    if periodo == "este mês":
        return "neste mês"
    if periodo == "mês passado":
        return "no mês passado"
    if periodo == "hoje":
        return "hoje"
    if periodo.startswith("últimos"):
        return "nos " + periodo
    return "em " + periodo


def montar_resposta(intencao: str, d: dict, ctx: ContextoUsuario, periodo: str) -> str:
    if d.get("erro"):
        return f"Não consegui responder agora: {d['erro']}."
    if intencao in ("consumo_total", "faturamento") and d.get("sessoes") == 0:
        if not d.get("ultima_sessao"):
            return ("Você ainda não tem nenhuma sessão concluída."
                    if ctx.papel == Papel.USUARIO else
                    "Ainda não há nenhuma sessão concluída registrada.")
        return (f"Não há sessões concluídas registradas {_em(periodo)}. "
                f"A última sessão registrada foi em {d['ultima_sessao']}.")
    if not d:
        return f"Não encontrei dados para responder isso ({periodo})."

    eh_user = ctx.papel == Papel.USUARIO
    if intencao == "consumo_total":
        sujeito = "Você consumiu" if eh_user else "O consumo total foi de"
        return f"{sujeito} {d['consumo_kwh']} kWh em {d['sessoes']} sessões ({periodo})."
    if intencao == "faturamento":
        sujeito = "Você gastou" if eh_user else "O faturamento foi de"
        return f"{sujeito} {_brl(d['valor'])} ({periodo}, {d['consumo_kwh']} kWh)."
    if intencao == "usuario_top":
        return f"{d['usuario']} foi quem mais consumiu ({periodo}): {d['kwh']} kWh."
    if intencao == "carregador_top":
        return f"O carregador mais utilizado ({periodo}) é {d['carregador']}, com {d['sessoes']} sessões."
    if intencao == "sessoes_anormais":
        if not d["quantidade"]:
            return f"Nenhuma sessão anormal entre as {d['analisadas']} analisadas."
        return (f"Foram encontradas {d['quantidade']} sessões com comportamento anormal "
                f"entre as {d['analisadas']} analisadas.")
    if intencao == "previsao":
        return (f"Estimativa demonstrativa para os próximos {d['dias']} dias: "
                f"cerca de {d['total_estimado_kwh']} kWh, com pico previsto às "
                f"{d['horario_pico']} (demanda {d['nivel_demanda'].lower()}).")
    if intencao == "ultima_recarga":
        sujeito = "Sua última recarga" if eh_user else "A última recarga registrada"
        return (f"{sujeito} foi em {d['data']}: {d['kwh']} kWh, {_brl(d['valor'])} "
                f"(carregador #{d['carregador_id']}).")
    return "Sem resposta disponível."


AVISOS = {"previsao": AVISO_PREVISAO, "sessoes_anormais": AVISO_ANOMALIA}


def responder(db: Session, ctx: ContextoUsuario, pergunta: str) -> RespostaOut:
    intencoes = detectar_intencoes(pergunta)
    if not intencoes:
        return RespostaOut(
            resposta="Não entendi a pergunta. Posso ajudar com consumo, faturamento, "
                     "carregadores, sessões anormais, última recarga e previsão de consumo.",
            intencao="desconhecida",
        )

    inicio, fim, rotulo = detectar_periodo(pergunta)
    textos, dados_por, avisos, negado = [], {}, [], False
    for intencao in intencoes:
        if intencao in SOMENTE_ADMIN and ctx.papel != Papel.ADMIN:
            if not negado:
                textos.append("Você não tem permissão para consultar essa informação. "
                              "Posso responder sobre os seus próprios dados.")
                negado = True
            continue
        dados = FERRAMENTAS[intencao](db, ctx, (inicio, fim), pergunta)
        textos.append(montar_resposta(intencao, dados, ctx, rotulo))
        if dados:
            dados_por[intencao] = dados
        if AVISOS.get(intencao):
            avisos.append(AVISOS[intencao])

    if len(intencoes) == 1:  # formato simples, como antes
        dados_saida = dados_por.get(intencoes[0])
    else:
        dados_saida = dados_por or None
    return RespostaOut(
        resposta=" ".join(dict.fromkeys(textos)),  # sem repetir frases idênticas
        intencao="+".join(intencoes),
        periodo=rotulo,
        dados=dados_saida,
        aviso=" ".join(dict.fromkeys(avisos)) or None,
    )
