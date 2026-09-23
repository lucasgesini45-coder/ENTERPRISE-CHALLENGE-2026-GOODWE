from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Sessao
from schemas.sessao import SessaoCreate

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/sessoes",
    tags=["Sessoes"]
)


@router.get("/")
def listar_sessoes(db: Session = Depends(get_db)):
    sessoes = db.query(Sessao).all()

    return {
        "sessoes": sessoes
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

from datetime import datetime
from fastapi import HTTPException


@router.put("/{sessao_id}/finalizar")
def finalizar_sessao(
    sessao_id: int,
    consumo_kwh: float,
    db: Session = Depends(get_db)
):
    sessao = db.query(Sessao).filter(Sessao.id == sessao_id).first()

    if not sessao:
        raise HTTPException(
            status_code=404,
            detail="Sessao nao encontrada"
        )

    sessao.fim = datetime.now()
    sessao.consumo_kwh = consumo_kwh
    sessao.valor_total = round(consumo_kwh * sessao.tarifa, 2)
    sessao.status = "CONCLUIDA"

    db.commit()
    db.refresh(sessao)

    return sessao