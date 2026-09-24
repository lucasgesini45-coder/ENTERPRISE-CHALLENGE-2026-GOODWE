from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Sessao
from schemas.sessao import SessaoCreate
from schemas.associacao import AssociacaoLote
from services.sessao_service import (
    listar_todas_sessoes,
    finalizar_sessao,
    associar_usuario_sessao,
    listar_sessoes_sem_usuario,
    associar_usuarios_em_lote
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
    nova_sessao = Sessao(
        usuario_id=sessao.usuario_id,
        carregador_id=sessao.carregador_id,
        inicio=sessao.inicio,
        fim=sessao.fim,
        consumo_kwh=sessao.consumo_kwh,
        tarifa=sessao.tarifa,
        valor_total=sessao.valor_total,
        status=sessao.status
    )

    db.add(nova_sessao)
    db.commit()
    db.refresh(nova_sessao)

    return nova_sessao


@router.put("/{sessao_id}/finalizar")
def finalizar(
    sessao_id: int,
    consumo_kwh: float,
    db: Session = Depends(get_db)
):
    sessao = finalizar_sessao(
        db,
        sessao_id,
        consumo_kwh
    )

    if sessao is None:
        raise HTTPException(
            status_code=404,
            detail="Sessao nao encontrada"
        )

    return sessao

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