from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Sessao
from schemas.sessao import SessaoCreate

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
        consumo_kwh=sessao.consumo_kwh
    )

    db.add(nova_sessao)
    db.commit()
    db.refresh(nova_sessao)

    return nova_sessao