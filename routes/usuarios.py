from fastapi import APIRouter
from schemas.usuario import UsuarioCreate
from services.usuario_service import listar_todos_usuarios, criar_novo_usuario

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


@router.get("/")
def listar_usuarios():
    return {
        "usuarios": listar_todos_usuarios()
    }


@router.post("/")
def criar_usuario(usuario: UsuarioCreate):
    return criar_novo_usuario(usuario)