from typing import Literal
from pydantic import BaseModel, Field, ConfigDict

StatusCartao = Literal["ATIVO", "BLOQUEADO", "CANCELADO"]


class CartaoBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    uid: str = Field(min_length=1, max_length=128)
    usuario_id: int | None = Field(default=None, gt=0)
    status: StatusCartao = "ATIVO"


class CartaoCreate(CartaoBase):
    pass


class CartaoAssociar(BaseModel):
    usuario_id: int = Field(gt=0)


class CartaoStatus(BaseModel):
    status: StatusCartao


class CartaoResponse(CartaoBase):
    id: int
