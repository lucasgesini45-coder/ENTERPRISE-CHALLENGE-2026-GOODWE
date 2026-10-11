from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Usuario
from schemas.assistente_ia import ContextoUsuario, Papel, PerguntaIn, RespostaOut
from services import assistente_ia_service

router = APIRouter(prefix="/assistente-ia", tags=["OPS - Assistente virtual"])


@router.post("/perguntar", response_model=RespostaOut)
def perguntar(body: PerguntaIn, db: Session = Depends(get_db)):
    # Esta rota requer autenticação administrativa no registro do router.
    # usuario_id limita uma consulta do administrador, não define autorização.
    if body.usuario_id is None:
        ctx = ContextoUsuario(papel=Papel.ADMIN)
    else:
        if db.get(Usuario, body.usuario_id) is None:
            raise HTTPException(404, "Usuário não encontrado.")
        ctx = ContextoUsuario(papel=Papel.USUARIO, usuario_id=body.usuario_id)
    return assistente_ia_service.responder(db, ctx, body.pergunta)
