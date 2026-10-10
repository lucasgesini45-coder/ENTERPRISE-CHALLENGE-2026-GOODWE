from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    senha: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class AlterarSenhaRequest(BaseModel):
    senha_atual: str
    nova_senha: str


class EsqueciSenhaRequest(BaseModel):
    email: str


class RedefinirSenhaRequest(BaseModel):
    token: str
    nova_senha: str