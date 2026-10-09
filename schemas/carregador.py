from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class CarregadorBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    nome: str = Field(min_length=1, max_length=200)
    serial_number: str = Field(min_length=1, max_length=128)
    localizacao: str
    status: str = "DESCONHECIDO"

    latitude: float | None = Field(default=None, ge=-90, le=90, allow_inf_nan=False)
    longitude: float | None = Field(default=None, ge=-180, le=180, allow_inf_nan=False)
    modelo: Optional[str] = None
    potencia_maxima: Optional[float] = Field(default=None, gt=0, allow_inf_nan=False)


class CarregadorCreate(CarregadorBase):
    pass


class CarregadorResponse(CarregadorBase):
    id: int

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)

from typing import Literal
from pydantic import AwareDatetime


class TelemetriaCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    chave_evento: str = Field(min_length=1, max_length=128)
    instante: AwareDatetime
    status: Literal["DISPONIVEL", "EM_USO", "FALHA"]
    potencia_kw: float = Field(ge=0, allow_inf_nan=False)
