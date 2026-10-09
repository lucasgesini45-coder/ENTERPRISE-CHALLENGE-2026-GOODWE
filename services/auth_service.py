import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database.database import get_db
from database.models import Usuario

bearer = HTTPBearer(auto_error=False)


def secret():
    value = os.environ.get('EV_CHARGEOPS_JWT_SECRET', '')
    if len(value) < 32:
        raise HTTPException(503, 'Chave de autenticação não configurada')
    return value


def gerar_hash_senha(password):
    salt=secrets.token_bytes(16)
    digest=hashlib.pbkdf2_hmac('sha256',password.encode(),salt,600000)
    return 'pbkdf2_sha256$600000$'+base64.b64encode(salt).decode()+'$'+base64.b64encode(digest).decode()


def verificar_senha(password, encoded):
    try:
        if encoded.startswith(('$2a$', '$2b$', '$2y$')):
            import bcrypt
            return bcrypt.checkpw(password.encode(), encoded.encode())
        scheme,iterations,salt,digest=encoded.split('$')
        if scheme != 'pbkdf2_sha256' or not 100000 <= int(iterations) <= 1000000:
            return False
        computed=hashlib.pbkdf2_hmac('sha256',password.encode(),base64.b64decode(salt),int(iterations))
        return hmac.compare_digest(computed,base64.b64decode(digest))
    except (ValueError, TypeError, AttributeError):
        return False


def version(user):
    return hmac.new(secret().encode(),(user.senha or '').encode(),hashlib.sha256).hexdigest()


def create_token(user, kind='access'):
    now=datetime.now(timezone.utc)
    return jwt.encode({'sub':str(user.id),'tipo':kind,'ver':version(user),'iat':now,
        'exp':now+timedelta(minutes=15 if kind=='reset' else 60),'aud':'evchargeops','iss':'evchargeops'},secret(),algorithm='HS256')


def user_from_token(db, token, kind='access'):
    try:
        data=jwt.decode(token,secret(),algorithms=['HS256'],audience='evchargeops',issuer='evchargeops',options={'require':['sub','exp','iat','tipo','ver']})
        if data['tipo'] != kind:
            raise ValueError('tipo')
        user=db.get(Usuario,int(data['sub']))
        if not user or not hmac.compare_digest(data['ver'],version(user)):
            raise ValueError('revogado')
        return user
    except (jwt.PyJWTError, ValueError, TypeError, KeyError):
        raise HTTPException(401,'Token inválido, expirado ou revogado')


def obter_usuario_atual(credentials: HTTPAuthorizationCredentials | None=Depends(bearer), db=Depends(get_db)):
    if credentials is None:
        raise HTTPException(401,'Autenticação necessária')
    return user_from_token(db,credentials.credentials)
