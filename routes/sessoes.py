from fastapi import APIRouter
from schemas.sessao import SessaoCreate

router = APIRouter(
    prefix="/sessoes",
    tags=["Sessoes"]
)

sessoes = []


@router.get("/")
def listar_sessoes():
    return {
        "sessoes": sessoes
    }


@router.post("/")
def criar_sessao(sessao: SessaoCreate):
    nova_sessao = {
        "id": len(sessoes) + 1,
        **sessao.model_dump()
    }

    sessoes.append(nova_sessao)

    return nova_sessao