from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Usuario
from services.auth_service import gerar_hash_senha
from schemas.usuario import UsuarioCreate, UsuarioResponse


router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


@router.get("/")
def listar_usuarios(
    db: Session = Depends(get_db)
):
    usuarios = db.query(Usuario).all()

    return {
        "usuarios": [UsuarioResponse.model_validate(u).model_dump() for u in usuarios]
    }


@router.post("/")
def criar_usuario(
    usuario: UsuarioCreate,
    db: Session = Depends(get_db)
):
    novo_usuario = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=gerar_hash_senha(usuario.senha) if usuario.senha else None,
        telefone=usuario.telefone
    )

    try:

        db.add(novo_usuario)

        db.commit()

        db.refresh(novo_usuario)

        return UsuarioResponse.model_validate(novo_usuario)

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Já existe um usuário cadastrado com este e-mail."
        )