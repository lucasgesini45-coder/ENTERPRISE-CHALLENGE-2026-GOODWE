from pydantic import BaseModel
from typing import Optional, Literal

StatusCartao = Literal["ATIVO", "BLOQUEADO", "CANCELADO"]


class CartaoBase(BaseModel):
    uid: str
    usuario_id: Optional[int] = None
    status: StatusCartao = "ATIVO"


class CartaoCreate(CartaoBase):
    pass


class CartaoAssociar(BaseModel):
    usuario_id: int


class CartaoStatus(BaseModel):
    status: StatusCartao


class CartaoResponse(CartaoBase):
    id: int

    class Config:
        from_attributes = True
