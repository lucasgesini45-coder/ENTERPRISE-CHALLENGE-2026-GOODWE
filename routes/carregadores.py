from fastapi import APIRouter
from schemas.carregador import CarregadorCreate

router = APIRouter(
    prefix="/carregadores",
    tags=["Carregadores"]
)

carregadores = []


@router.get("/")
def listar_carregadores():
    return {
        "carregadores": carregadores
    }


@router.post("/")
def criar_carregador(carregador: CarregadorCreate):
    novo_carregador = {
        "id": len(carregadores) + 1,
        **carregador.model_dump()
    }

    carregadores.append(novo_carregador)

    return novo_carregador