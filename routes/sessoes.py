from fastapi import APIRouter
from schemas.sessao import SessaoCreate
from services.sessao_service import listar_todas_sessoes, criar_nova_sessao

router = APIRouter(
    prefix="/sessoes",
    tags=["Sessoes"]
)


@router.get("/")
def listar_sessoes():
    return {
        "sessoes": listar_todas_sessoes()
    }


@router.post("/")
def criar_sessao(sessao: SessaoCreate):
    return criar_nova_sessao(sessao)