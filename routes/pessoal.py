from fastapi import APIRouter,Depends
from database.database import get_db
from database.models import Sessao, CartaoRFID, Carregador
from services.auth_service import obter_usuario_atual
from services.consumo_rateio import gerar_fatura_usuario
from routes.carregadores import estado_atual
from schemas.assistente_ia import PerguntaIn,ContextoUsuario,Papel
from services.assistente_ia_service import responder

router=APIRouter(prefix='/me',tags=['Área pessoal'])


@router.get('/sessoes')
def sessions(user=Depends(obter_usuario_atual),db=Depends(get_db)):
    return {'sessoes':db.query(Sessao).filter_by(usuario_id=user.id).order_by(Sessao.inicio.desc()).all()}


@router.get('/cartoes')
def cards(user=Depends(obter_usuario_atual),db=Depends(get_db)):
    return {'cartoes':db.query(CartaoRFID).filter_by(usuario_id=user.id).all()}


@router.get('/carregadores')
def chargers(user=Depends(obter_usuario_atual),db=Depends(get_db)):
    return {'carregadores':[estado_atual(c) for c in db.query(Carregador).all()]}


@router.get('/fatura')
def invoice(user=Depends(obter_usuario_atual),db=Depends(get_db)):
    return gerar_fatura_usuario(db,user.id)


@router.post('/assistente')
def assistant(body:PerguntaIn,user=Depends(obter_usuario_atual),db=Depends(get_db)):
    # A body-provided user ID never expands the authenticated user's scope.
    return responder(db,ContextoUsuario(papel=Papel.USUARIO,usuario_id=user.id),body.pergunta)
