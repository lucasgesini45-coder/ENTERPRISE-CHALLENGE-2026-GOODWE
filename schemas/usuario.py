from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class UsuarioBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    nome: str = Field(min_length=1, max_length=200)
    email: str = Field(min_length=3, max_length=254)
    telefone: Optional[str] = None


class UsuarioCreate(UsuarioBase):
    senha: str | None = Field(default=None, min_length=8, max_length=128)


class UsuarioResponse(UsuarioBase):
    id: int
    perfil: str

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)