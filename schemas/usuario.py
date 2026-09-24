from typing import Optional

from pydantic import BaseModel


class UsuarioBase(BaseModel):
    nome: str
    email: str
    telefone: Optional[str] = None


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        from_attributes = True