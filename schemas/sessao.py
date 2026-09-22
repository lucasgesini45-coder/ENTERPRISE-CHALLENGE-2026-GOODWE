from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SessaoBase(BaseModel):
    usuario_id: int
    carregador_id: int
    inicio: datetime
    fim: Optional[datetime] = None
    consumo_kwh: float = 0.0


class SessaoCreate(SessaoBase):
    pass


class SessaoResponse(SessaoBase):
    id: int

    class Config:
        from_attributes = True