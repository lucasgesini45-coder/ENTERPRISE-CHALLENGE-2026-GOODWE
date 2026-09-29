from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Usuario
from schemas.usuario import UsuarioCreate, UsuarioResponse
from services.auth_service import gerar_hash_senha, obter_usuario_admin

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


@router.get("/", response_model=dict[str, list[UsuarioResponse]])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_admin: Usuario = Depends(obter_usuario_admin)
):
    usuarios = db.query(Usuario).all()

    return {
        "usuarios": usuarios
    }


@router.post("/", response_model=UsuarioResponse)
def criar_usuario(
    usuario: UsuarioCreate,
    db: Session = Depends(get_db)
):
    novo_usuario = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        telefone=usuario.telefone,
        senha=gerar_hash_senha(usuario.senha)
)

    try:

        db.add(novo_usuario)

        db.commit()

        db.refresh(novo_usuario)

        return novo_usuario

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Já existe um usuário cadastrado com este e-mail."
        )