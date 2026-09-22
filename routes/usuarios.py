from fastapi import APIRouter
from schemas.usuario import UsuarioCreate

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

usuarios = []


@router.get("/")
def listar_usuarios():
    return {
        "usuarios": usuarios
    }


@router.post("/")
def criar_usuario(usuario: UsuarioCreate):
    novo_usuario = {
        "id": len(usuarios) + 1,
        **usuario.model_dump()
    }

    usuarios.append(novo_usuario)

    return novo_usuario