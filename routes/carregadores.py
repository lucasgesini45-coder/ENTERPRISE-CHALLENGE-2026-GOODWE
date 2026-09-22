from fastapi import APIRouter
from schemas.carregador import CarregadorCreate
from services.carregador_service import listar_todos_carregadores, criar_novo_carregador

router = APIRouter(
    prefix="/carregadores",
    tags=["Carregadores"]
)


@router.get("/")
def listar_carregadores():
    return {
        "carregadores": listar_todos_carregadores()
    }


@router.post("/")
def criar_carregador(carregador: CarregadorCreate):
    return criar_novo_carregador(carregador)