from datetime import datetime

from pydantic import BaseModel


class RFIDCreate(BaseModel):
    uid: str
    usuario_id: int
    status: str = "ATIVO"


class RFIDStatusUpdate(BaseModel):
    status: str


class RFIDResponse(BaseModel):
    id: int
    uid: str
    usuario_id: int
    status: str
    data_cadastro: datetime

    class Config:
        from_attributes = True