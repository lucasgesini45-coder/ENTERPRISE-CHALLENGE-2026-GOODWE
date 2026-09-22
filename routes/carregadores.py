from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Carregador
from schemas.carregador import CarregadorCreate

router = APIRouter(
    prefix="/carregadores",
    tags=["Carregadores"]
)


@router.get("/")
def listar_carregadores(db: Session = Depends(get_db)):
    carregadores = db.query(Carregador).all()

    return {
        "carregadores": carregadores
    }


@router.post("/")
def criar_carregador(
    carregador: CarregadorCreate,
    db: Session = Depends(get_db)
):
    novo_carregador = Carregador(
        nome=carregador.nome,
        localizacao=carregador.localizacao,
        status=carregador.status
    )

    db.add(novo_carregador)
    db.commit()
    db.refresh(novo_carregador)

    return novo_carregador