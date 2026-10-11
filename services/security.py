import os
import secrets
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials

basic = HTTPBasic(auto_error=False)


def require_admin(request: Request, credentials: HTTPBasicCredentials | None = Depends(basic)):
    authorization = request.headers.get("Authorization", "")
    if authorization.startswith("Bearer "):
        from services.auth_service import user_from_token
        from database.database import SessionLocal
        with SessionLocal() as db:
            user = user_from_token(db, authorization[7:])
            if user.perfil != "ADMIN":
                raise HTTPException(403, "Acesso administrativo necessário")
            return
    expected = os.environ.get("EV_CHARGEOPS_ADMIN_PASSWORD", "")
    if not expected:
        raise HTTPException(503, "Credencial administrativa não configurada")
    username = os.environ.get("EV_CHARGEOPS_ADMIN_USER", "admin")
    if credentials is None:
        raise HTTPException(401, "Autenticação necessária", headers={"WWW-Authenticate": "Basic"})
    valid_user = secrets.compare_digest(credentials.username.encode(), username.encode())
    valid_password = secrets.compare_digest(credentials.password.encode(), expected.encode())
    if not (valid_user and valid_password):
        raise HTTPException(401, "Credencial inválida", headers={"WWW-Authenticate": "Basic"})
