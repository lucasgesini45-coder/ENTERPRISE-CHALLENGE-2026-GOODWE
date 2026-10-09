from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from datetime import datetime
from database.database import get_db
from database.models import Sessao
from schemas.sessao import SessaoCreate, MedicaoSessao
from services.session_lifecycle import criar, medir, pendente
from schemas.associacao import AssociacaoLote
from services.sessao_service import (
    listar_todas_sessoes,
    finalizar_sessao,
    associar_usuario_sessao,
    listar_sessoes_sem_usuario,
    associar_usuarios_em_lote,
    listar_sessoes_por_usuario,
    listar_sessoes_por_carregador
)

router = APIRouter(
    prefix="/sessoes",
    tags=["Sessoes"]
)


@router.get("/")
def listar_sessoes(db: Session = Depends(get_db)):
    return {
        "sessoes": listar_todas_sessoes(db)
    }


@router.post("/")
def criar_sessao(
    sessao: SessaoCreate,
    db: Session = Depends(get_db)
):
    return criar(db, sessao)


@router.put("/{sessao_id}/finalizar")
def finalizar(
    sessao_id: int,
    consumo_kwh: float,
    db: Session = Depends(get_db)
):
    raise HTTPException(409, "Use POST /sessoes/{id}/medicoes com chave_evento e encerrar=true")


@router.post("/{sessao_id}/medicoes")
def medicao(sessao_id: int, dados: MedicaoSessao, db: Session = Depends(get_db)):
    return medir(db, sessao_id, dados)


@router.patch("/{sessao_id}/pendente")
def conciliacao(sessao_id: int, db: Session = Depends(get_db)):
    return pendente(db, sessao_id)


@router.put("/{sessao_id}/associar-usuario")
def associar_usuario(
    sessao_id: int,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    sessao = associar_usuario_sessao(
        db,
        sessao_id,
        usuario_id
    )

    if sessao is None:
        raise HTTPException(
            status_code=404,
            detail="Sessao nao encontrada"
        )

    return sessao

@router.get("/sem-usuario")
def sessoes_sem_usuario(
    db: Session = Depends(get_db)
):
    return {
        "sessoes": listar_sessoes_sem_usuario(db)
    }

@router.put("/associar-usuarios-lote")
def associar_lote(
    dados: AssociacaoLote,
    db: Session = Depends(get_db)
):
    return associar_usuarios_em_lote(
        db,
        dados.associacoes
    )

@router.get("/usuario/{usuario_id}")
def historico_usuario(
    usuario_id: int,
    inicio: datetime | None = None,
    fim: datetime | None = None,
    db: Session = Depends(get_db)
):
    sessoes = listar_sessoes_por_usuario(
        db=db,
        usuario_id=usuario_id,
        inicio=inicio,
        fim=fim
    )

    consumo_total = round(
        sum(
            sessao.consumo_kwh or 0
            for sessao in sessoes
        ),
        3
    )

    valor_total = round(
        sum(
            sessao.valor_total or 0
            for sessao in sessoes
        ),
        2
    )

    return {
        "usuario_id": usuario_id,
        "periodo": {
            "inicio": inicio,
            "fim": fim
        },
        "total_sessoes": len(sessoes),
        "consumo_total_kwh": consumo_total,
        "valor_total": valor_total,
        "sessoes": sessoes
    }

@router.get("/carregador/{carregador_id}")
def historico_carregador(
    carregador_id: int,
    inicio: datetime | None = None,
    fim: datetime | None = None,
    db: Session = Depends(get_db)
):
    sessoes = listar_sessoes_por_carregador(
        db=db,
        carregador_id=carregador_id,
        inicio=inicio,
        fim=fim
    )

    consumo_total = round(
        sum(
            sessao.consumo_kwh or 0
            for sessao in sessoes
        ),
        3
    )

    valor_total = round(
        sum(
            sessao.valor_total or 0
            for sessao in sessoes
        ),
        2
    )

    return {
        "carregador_id": carregador_id,
        "periodo": {
            "inicio": inicio,
            "fim": fim
        },
        "total_sessoes": len(sessoes),
        "consumo_total_kwh": consumo_total,
        "valor_total": valor_total,
        "sessoes": sessoes
    }