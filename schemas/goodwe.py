from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class SessaoGoodWeImport(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    serial_number: str = Field(min_length=1, max_length=128)
    inicio: datetime
    fim: datetime
    consumo_kwh: float = Field(ge=0, allow_inf_nan=False)
    tarifa: float = Field(default=0, ge=0, allow_inf_nan=False)
    usuario_id: int | None = None


class ImportacaoGoodWeLote(BaseModel):
    sessoes: list[SessaoGoodWeImport] = Field(max_length=1000)