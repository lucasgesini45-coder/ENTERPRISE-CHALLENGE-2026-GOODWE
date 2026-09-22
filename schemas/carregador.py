from pydantic import BaseModel


class CarregadorBase(BaseModel):
    nome: str
    localizacao: str
    status: str


class CarregadorCreate(CarregadorBase):
    pass


class CarregadorResponse(CarregadorBase):
    id: int

    class Config:
        from_attributes = True