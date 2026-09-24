# popular banco de dados para realizar testes
# rode apenas uma vez na sua IDE

import hashlib
import random
import sys
from datetime import datetime, timedelta

from database.database import engine, SessionLocal
from database.models import Base, Usuario, Carregador, Sessao

random.seed(42)  # dados reproduzíveis


def hash_senha(senha: str) -> str:
    # apenas para teste
    return hashlib.sha256(senha.encode()).hexdigest()


# 20 usuarios diferentes
USUARIOS = [
    ("Ana Beatriz Souza", "ana.souza@email.com", "(77) 99123-4501"),
    ("Carlos Eduardo Lima", "carlos.lima@email.com", "(71) 98876-1122"),
    ("Mariana Oliveira", "mariana.oliveira@email.com", "(11) 97654-3321"),
    ("João Pedro Santos", "joao.santos@email.com", "(21) 99812-7745"),
    ("Fernanda Costa", "fernanda.costa@email.com", "(61) 98455-9083"),
    ("Rafael Almeida", "rafael.almeida@email.com", "(77) 99701-2234"),
    ("Juliana Ferreira", "juliana.ferreira@email.com", "(31) 98233-6610"),
    ("Lucas Gabriel Rocha", "lucas.rocha@email.com", "(85) 99944-1871"),
    ("Camila Ribeiro", "camila.ribeiro@email.com", "(71) 98120-5567"),
    ("Pedro Henrique Martins", "pedro.martins@email.com", "(62) 99377-0129"),
    ("Larissa Carvalho", "larissa.carvalho@email.com", "(77) 98811-4390"),
    ("Thiago Nascimento", "thiago.nascimento@email.com", "(41) 99560-7712"),
    ("Beatriz Gomes", "beatriz.gomes@email.com", "(51) 98342-8856"),
    ("Gustavo Barbosa", "gustavo.barbosa@email.com", "(81) 99688-2043"),
    ("Isabela Araújo", "isabela.araujo@email.com", "(71) 99215-6634"),
    ("Matheus Cardoso", "matheus.cardoso@email.com", "(11) 98709-3358"),
    ("Sofia Teixeira", "sofia.teixeira@email.com", "(77) 99456-1987"),
    ("Diego Moreira", "diego.moreira@email.com", "(27) 98167-4402"),
    ("Patrícia Duarte", "patricia.duarte@email.com", "(19) 99833-5276"),
    ("Rodrigo Pinto", "rodrigo.pinto@email.com", "(48) 98590-7719"),
]


CARREGADORES = [
    (
        "Carregador Shopping G1-01",
        "EVC-2024-0001",
        "Shopping Center - Piso G1, Vaga 01",
        7.4,
        "disponivel",
        "WallBox Pulsar Plus",
        1.10,
    ),
    (
        "Carregador Shopping G1-02",
        "EVC-2024-0002",
        "Shopping Center - Piso G1, Vaga 02",
        7.4,
        "em_uso",
        "WallBox Pulsar Plus",
        1.10,
    ),
    (
        "Carregador Posto Central AC",
        "EVC-2024-0003",
        "Posto Central - Av. Principal, 1200",
        22.0,
        "disponivel",
        "Schneider EVlink Pro AC",
        1.45,
    ),
    (
        "Carregador Posto Central DC",
        "EVC-2024-0004",
        "Posto Central - Av. Principal, 1200",
        50.0,
        "em_uso",
        "ABB Terra 54",
        2.20,
    ),
    (
        "Carregador Rodovia BR-242 Ultra",
        "EVC-2024-0005",
        "Rodovia BR-242, km 812 - Área de descanso",
        120.0,
        "disponivel",
        "Tritium Veefil-RT",
        2.90,
    ),
    (
        "Carregador Condomínio Bloco A",
        "EVC-2024-0006",
        "Condomínio Residencial Aurora - Bloco A",
        3.7,
        "disponivel",
        "Intelbras EVS 3.7",
        0.85,
    ),
    (
        "Carregador Condomínio Bloco B",
        "EVC-2024-0007",
        "Condomínio Residencial Aurora - Bloco B",
        7.4,
        "manutencao",
        "Intelbras EVS 7.4",
        0.90,
    ),
    (
        "Carregador Hotel Plaza",
        "EVC-2024-0008",
        "Hotel Plaza - Estacionamento coberto",
        11.0,
        "disponivel",
        "Siemens VersiCharge AC11",
        1.30,
    ),
    (
        "Carregador Universidade Norte",
        "EVC-2024-0009",
        "Campus Universitário - Estacionamento 3",
        11.0,
        "offline",
        "WEG WEMOB 11",
        0.95,
    ),
    (
        "Carregador Supermercado Bom Preço",
        "EVC-2024-0010",
        "Supermercado Bom Preço - Estacionamento",
        22.0,
        "disponivel",
        "WEG WEMOB 22",
        1.35,
    ),
    (
        "Carregador Aeroporto Rápido",
        "EVC-2024-0011",
        "Aeroporto Regional - Estacionamento P2",
        60.0,
        "em_uso",
        "Delta DC Wallbox 60",
        2.50,
    ),
    (
        "Carregador Prefeitura Eco",
        "EVC-2024-0012",
        "Praça Cívica - Estacionamento público",
        7.4,
        "disponivel",
        "WallBox Pulsar Max",
        0.75,
    ),
]

STATUS_SESSAO_PESOS = [
    ("finalizada", 78),
    ("interrompida", 12),
    ("cancelada", 10),
]


def sortear_status():
    nomes, pesos = zip(*STATUS_SESSAO_PESOS)
    return random.choices(nomes, weights=pesos, k=1)[0]


def gerar_sessao(usuario_id, carregador_id, potencia, tarifa_base, cursor):

    status = sortear_status()

    inicio = cursor + timedelta(minutes=random.randint(20, 60 * 30))

    inicio = inicio.replace(second=random.randint(0, 59), microsecond=0)

    perfil = random.choices(["curta", "media", "longa"], weights=[30, 45, 25])[0]
    if potencia >= 50:
        faixa = {"curta": (8, 20), "media": (20, 40), "longa": (40, 75)}[perfil]
    elif potencia >= 11:
        faixa = {"curta": (15, 45), "media": (45, 120), "longa": (120, 300)}[perfil]
    else:
        faixa = {"curta": (20, 60), "media": (60, 180), "longa": (180, 480)}[perfil]
    duracao = round(random.uniform(*faixa), 1)

    if status == "cancelada":
        duracao = round(random.uniform(1, 6), 1)
        consumo = round(random.uniform(0.05, 0.9), 2)
    elif status == "interrompida":
        duracao = round(duracao * random.uniform(0.15, 0.6), 1)
        eficiencia = random.uniform(0.5, 0.9)
        consumo = round(min(potencia * (duracao / 60) * eficiencia, 100), 2)
    else:
        eficiencia = random.uniform(0.55, 0.95)
        consumo = round(min(potencia * (duracao / 60) * eficiencia, 100), 2)

    consumo = max(consumo, 0.05)
    fim = inicio + timedelta(minutes=duracao)

    fator = 1.0
    if 18 <= inicio.hour < 21:
        fator = 1.20
    elif inicio.hour < 6:
        fator = 0.85
    tarifa = round(tarifa_base * fator, 2)

    valor_total = round(consumo * tarifa, 2)

    sessao = Sessao(
        usuario_id=usuario_id,
        carregador_id=carregador_id,
        inicio=inicio,
        fim=fim,
        consumo_kwh=consumo,
        duracao=duracao,
        tarifa=tarifa,
        valor_total=valor_total,
        status=status,
    )
    return sessao, fim


def main():
    reset = "--reset" in sys.argv
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if reset:
            db.query(Sessao).delete()
            db.query(Carregador).delete()
            db.query(Usuario).delete()
            db.commit()
            print("Banco limpo.")
        elif db.query(Usuario).count() > 0:
            print("O banco já tem dados. Use: python seed_db.py --reset")
            return

        usuarios = []
        for i, (nome, email, telefone) in enumerate(USUARIOS, start=1):
            usuarios.append(
                Usuario(
                    nome=nome,
                    email=email,
                    senha=hash_senha(f"Senha@{1000 + i}"),
                    telefone=telefone,
                )
            )
        db.add_all(usuarios)
        db.flush()

        agora = datetime.now().replace(microsecond=0)
        carregadores = []
        tarifas_base = {}
        for nome, serial, loc, pot, status, modelo, tarifa in CARREGADORES:
            c = Carregador(
                nome=nome,
                serial_number=serial,
                localizacao=loc,
                potencia_maxima=pot,
                status=status,
                modelo=modelo,
                atualizado_em=agora - timedelta(minutes=random.randint(1, 60 * 72)),
            )
            carregadores.append(c)
        db.add_all(carregadores)
        db.flush()
        for c, dados in zip(carregadores, CARREGADORES):
            tarifas_base[c.id] = dados[6]

        pesos_usuarios = [random.choice([1, 1, 2, 3, 5]) for _ in usuarios]

        sessoes = []
        inicio_historico = agora - timedelta(days=45)
        for c in carregadores:
            cursor = inicio_historico + timedelta(hours=random.randint(0, 48))
            for _ in range(8):
                u = random.choices(usuarios, weights=pesos_usuarios, k=1)[0]
                sessao, cursor = gerar_sessao(
                    u.id, c.id, c.potencia_maxima, tarifas_base[c.id], cursor
                )
                sessoes.append(sessao)

        db.add_all(sessoes)
        db.commit()

        print("Dados de teste inseridos com sucesso!")
        print(f"  Usuários:     {len(usuarios)}")
        print(f"  Carregadores: {len(carregadores)}")
        print(f"  Sessões:      {len(sessoes)}")
        print(
            f"  Total:        {len(usuarios) + len(carregadores) + len(sessoes)} registros"
        )
        print(
            "  Senha dos usuários: Senha@1001, Senha@1002, ... (hash SHA-256 no banco)"
        )

    except Exception as e:
        db.rollback()
        print("Erro ao popular o banco:", e)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
