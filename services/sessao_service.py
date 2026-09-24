from dataclasses import dataclass
from datetime import datetime
from typing import Optional

# Modelo da sessão de recarga
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

# Armazenamento em memória(simulação de banco de dados)
sessoes = []

#1. Criar sessão
def criar_sessao(usuário_id: int, carregador_id: int):
    nova_sessao = SessaoRecarga(
    id=len(sessoes) + 1,
    usuário_id=usuário_id,
    carregador_id=carregador_id,
    inicio=datetime.now()
    )
    
    sessoes.append(nova_sessao)

    return nova_sessao
#2, listar sessões
def listar_sessoes():
    return sessoes

#3. Buscar sessão por ID
def buscar_sessao(sessao_id: int):
    for sessao in sessoes:
        if sessao.id == sessao_id:
            return sessao

    return None

#4. FInalizar sessão
def finalizar_sessao(
    sessao_id: int,
    energia_kwh: float,
    potencia_kw: float
):
    sessao = buscar_sessao(sessao_id)

    if sessao is None:
        return None

    sessao.fim = datetime.now()

    sessao.energia_Kwh = energia_kwh
    sessao.potencia_kw = potencia_kw
    sessao.status = "finalizada"
    

    return sessao