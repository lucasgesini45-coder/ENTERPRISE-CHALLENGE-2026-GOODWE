import time
from collections import defaultdict, deque
from threading import Lock
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from database.database import get_db
from database.models import Usuario
from services.auth_service import gerar_hash_senha, verificar_senha, create_token, user_from_token, obter_usuario_atual
from services.security import require_admin

_dummy_hash=gerar_hash_senha("not-a-real-account")

router=APIRouter(prefix='/auth',tags=['Autenticação'])
attempts=defaultdict(deque)
attempt_lock=Lock()


class Login(BaseModel):
    email: str = Field(min_length=3,max_length=254)
    senha: str = Field(min_length=1,max_length=128)


class ChangePassword(BaseModel):
    senha_atual: str = Field(min_length=1,max_length=128)
    nova_senha: str = Field(min_length=8,max_length=128)


class ResetPassword(BaseModel):
    token: str = Field(max_length=2048)
    nova_senha: str = Field(min_length=8,max_length=128)


@router.post('/login')
def login(data: Login, request: Request, db=Depends(get_db)):
    host=request.client.host if request.client else 'unknown'
    now=time.monotonic()
    with attempt_lock:
        for key in list(attempts):
            if not attempts[key] or attempts[key][-1] < now-60:
                del attempts[key]
        if host not in attempts and len(attempts)>=10000:
            raise HTTPException(429,'Tente novamente mais tarde')
        history=attempts[host]
        while history and history[0]<now-60:
            history.popleft()
        if len(history)>=10:
            raise HTTPException(429,'Aguarde antes de tentar novamente',headers={'Retry-After':'60'})
        history.append(now)
    user=db.query(Usuario).filter_by(email=data.email.strip()).first()
    # Keep invalid-account password work comparable to an invalid password.
    encoded=user.senha if user and user.senha else _dummy_hash
    if not verificar_senha(data.senha,encoded) or not user or not user.senha:
        raise HTTPException(401,'E-mail ou senha inválidos')
    return {'access_token':create_token(user),'token_type':'bearer'}


@router.get('/me')
def me(user=Depends(obter_usuario_atual)):
    return {'id':user.id,'nome':user.nome,'email':user.email,'telefone':user.telefone,'perfil':user.perfil}


@router.put('/alterar-senha')
def change(data: ChangePassword,user=Depends(obter_usuario_atual),db=Depends(get_db)):
    if not verificar_senha(data.senha_atual,user.senha):
        raise HTTPException(401,'Senha atual incorreta')
    user.senha=gerar_hash_senha(data.nova_senha)
    db.commit()
    return {'mensagem':'Senha alterada. Entre novamente.'}


@router.post('/esqueci-senha')
def forgot():
    # No public token delivery or disclosure of whether an account exists.
    raise HTTPException(503,'Recuperação por e-mail não configurada. Contate o administrador.')


@router.post('/admin/reset-token/{usuario_id}',dependencies=[Depends(require_admin)])
def reset_token(usuario_id:int,db=Depends(get_db)):
    user=db.get(Usuario,usuario_id)
    if not user:
        raise HTTPException(404,'Usuário não encontrado')
    return {'token_reset':create_token(user,'reset'),'expira_em_minutos':15}


@router.post('/redefinir-senha')
def reset(data:ResetPassword,db=Depends(get_db)):
    # Serialize reset attempts; changing the password revokes the token.
    if db.bind.dialect.name=='sqlite':
        from services.session_lifecycle import lock
        lock(db)
    user=user_from_token(db,data.token,'reset')
    user=db.query(Usuario).filter_by(id=user.id).with_for_update().populate_existing().one()
    user_from_token(db,data.token,'reset')
    user.senha=gerar_hash_senha(data.nova_senha)
    db.commit()
    return {'mensagem':'Senha redefinida. Entre novamente.'}


class Cadastro(BaseModel):
    nome: str = Field(min_length=1,max_length=200)
    email: str = Field(min_length=3,max_length=254,pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    senha: str = Field(min_length=8,max_length=128)
    telefone: str | None = Field(default=None,max_length=40)


@router.post('/cadastro',status_code=201)
def signup(data:Cadastro,request:Request,db=Depends(get_db)):
    host='signup:'+ (request.client.host if request.client else 'unknown')
    now=time.monotonic()
    with attempt_lock:
        for key in list(attempts):
            if not attempts[key] or attempts[key][-1] < now-60:
                del attempts[key]
        if host not in attempts and len(attempts)>=10000:
            raise HTTPException(429,'Tente novamente mais tarde')
        history=attempts[host]
        while history and history[0]<now-60:
            history.popleft()
        if len(history)>=5:
            raise HTTPException(429,'Aguarde antes de cadastrar novamente')
        history.append(now)
    user=Usuario(nome=data.nome.strip(),email=data.email.strip().lower(),telefone=data.telefone,
        senha=gerar_hash_senha(data.senha),perfil='USER')
    if not user.nome:
        raise HTTPException(422,'Nome vazio')
    db.add(user)
    db.commit()
    return {'id':user.id,'nome':user.nome,'email':user.email,'perfil':user.perfil}
