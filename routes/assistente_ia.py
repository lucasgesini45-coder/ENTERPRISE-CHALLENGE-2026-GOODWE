from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Usuario
from schemas.assistente_ia import ContextoUsuario, Papel, PerguntaIn, RespostaOut
from services import assistente_ia_service
from services.auth_service import (obter_usuario_atual)

router = APIRouter(prefix="/assistente-ia", tags=["OPS - Assistente virtual"])


@router.post(
    "/perguntar",
    response_model=RespostaOut
)
def perguntar(
    body: PerguntaIn,
    usuario_atual: Usuario = Depends(
        obter_usuario_atual
    ),
    db: Session = Depends(get_db)
):

    perfil = str(
        usuario_atual.perfil or ""
    ).upper()

    if perfil == "ADMIN":

        ctx = ContextoUsuario(
            papel=Papel.ADMIN
        )

    elif perfil == "USER":

        ctx = ContextoUsuario(
            papel=Papel.USUARIO,
            usuario_id=usuario_atual.id
        )

    else:

        raise HTTPException(
            status_code=403,
            detail="Perfil de usuário não autorizado."
        )

    return assistente_ia_service.responder(
        db,
        ctx,
        body.pergunta
    )
