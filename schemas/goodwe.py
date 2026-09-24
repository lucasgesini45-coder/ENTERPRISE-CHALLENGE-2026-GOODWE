from datetime import datetime
from pydantic import BaseModel


class SessaoGoodWeImport(BaseModel):
    serial_number: str
    inicio: datetime
    fim: datetime
    consumo_kwh: float
    tarifa: float = 0.0
    usuario_id: int | None = None


class ImportacaoGoodWeLote(BaseModel):
    sessoes: list[SessaoGoodWeImport]