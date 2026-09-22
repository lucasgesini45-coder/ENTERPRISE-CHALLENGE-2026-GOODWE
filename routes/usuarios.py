from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Usuario
from schemas.usuario import UsuarioCreate

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


@router.get("/")
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).all()

    return {
        "usuarios": usuarios
    }


@router.post("/")
def criar_usuario(
    usuario: UsuarioCreate,
    db: Session = Depends(get_db)
):
    novo_usuario = Usuario(
        nome=usuario.nome,
        email=usuario.email
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario