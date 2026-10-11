from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from schemas.cartao import CartaoCreate, CartaoStatus


class RFIDCreate(CartaoCreate):
    usuario_id: int = Field(gt=0)


class RFIDStatusUpdate(CartaoStatus):
    pass


class RFIDResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    codigo: str | None = None
    uid: str
    usuario_id: int | None
    status: str
    data_cadastro: datetime | None = None
