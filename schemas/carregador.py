from typing import Optional

from pydantic import BaseModel


class CarregadorBase(BaseModel):
    nome: str
    serial_number: str
    localizacao: str
    status: str

    modelo: Optional[str] = None
    potencia_maxima: Optional[float] = None


class CarregadorCreate(CarregadorBase):
    pass


class CarregadorResponse(CarregadorBase):
    id: int

    class Config:
        from_attributes = True