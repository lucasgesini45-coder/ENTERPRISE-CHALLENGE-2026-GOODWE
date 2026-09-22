# Definir a estrutura de uma sesão de recarga e criar funções iniciais de criação e consulta.
#ev-chargeops/
#│
#├── main.py
#│
#├── models/
#│   └── session.py
#│
#├── services/
#│   └── session_service.py
#│
#└── tests/
#   └── test_session.py

# 1. MODELS / SESSION.PY - DEFINE O QUE É UMA SESSÃO
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
@dataclass
class SessaoRecarga:
    id: int
    usuário_id: int
    carregador_id: int
    inicio: datetime
    fim: Optional[datetime] = None 
    energia_Kwh: float= 0.0
    potencia_kw: float=0.0
    status: str = "em andamento"
    custo_total: float = 0.0

# Esse arquivo não cria sessões. Ele define como uma sessão deve ser estruturada.

# 2. services/session_service.py - faz o trabalho
from datetime import datetime

sessoes = []

def criar_sessao(usuário_id: int, carregador_id: int):
    nova_sessao = SessaoRecarga(
    id=len(sessoes) + 1,
    usuário_id=usuário_id,
    carregador_id=carregador_id,
    inicio=datetime.now()
    )
    
    sessoes.append(nova_sessao)

    return nova_sessao

def listar_sessoes():
    return sessoes

def buscar_sessao(sessao_id: int):
    for sessao in sessoes:
        if sessao.id == sessao_id:
            return sessao

    return None

def finalizar_sessao(
    sessao_id: int,
    energia_kwh: float,
    potencia_kw: float
):
    sessao = buscar_sessao(sessao_id)

    if sessao is None:
        return None

    sessao.fim = datetime.now()
    sessao.energia_kwh = energia_kwh
    sessao.potencia_kw = potencia_kw
    sessao.status = "finalizada"

    return sessao
# Aqui ja temos as quarto operações principais:
#criar_sessao()
#      ↓
#Sessão em andamento
#
#listar_sessoes()
#     ↓
#Todas as sessões
#
#buscar_sessao(id)
#     ↓
#Sessão específica
#
#finalizar_sessao()
#      ↓
#Sessão finalizada + kWh consumidos

#Testes teste_session.py - teste simples

sessao = criar_sessao(
    usuário_id=1,
    carregador_id=101
)

print("sessão criada:")
print(sessao)

print ("\nLIsta de sessões:")
print(listar_sessoes())
print("\nBuscando sessão 1:")
print(buscar_sessao(1))

sessao_finalizada = finalizar_sessao(
    sessao_id=1,
    energia_kwh=18.7,
    potencia_kw=7.4
)

print("\nSessão finalizada:")
print(sessao_finalizada)

# Imagine que eu encostei meu RFID nno carregador.#

# O sistema identifica
# usuário_id = 1
# carregador_id = 101
# Então:
# criar sessao (1, 101)
# gera algo conceitualmente assim:

###
# Sessão #1
# Usuário:      1
# carregador:   101
# inicio.       21/09/2026 21:15
# Fim:          --
# Energia       0 kwh
# Status:       em_andamento
###

# Depois que o carro termina de carregar e o GoodWe informa, por exemplo:
# 18,7 kwh
# 7,4 kw
# Chamamos #
# finalizar_sessao(
#    1,
#    18.7,
#    7.4
#)
# A sessão passa a representar:
# Sessão #1

# Usuário:       1
# Carregador:    101
# Inicio:        21:15
# Fim:           23:40
# Energia        18.7 kwh
# Potencia       7,4. kw
# Status.        finalizada

# Isso gera exatamente o tipo de histórico que depois alimentará os indicadores, análise de consumo e previsão de demanda previstos no projeto.