from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from services.goodwe_service import importar_sessao_goodwe

router = APIRouter(
    prefix="/goodwe",
    tags=["GoodWe"]
)


@router.post("/importar-sessao")
def importar_sessao(
    serial_number: str,
    inicio: datetime,
    fim: datetime,
    consumo_kwh: float,
    tarifa: float = 0.0,
    usuario_id: int | None = None,
    db: Session = Depends(get_db)
):
    return importar_sessao_goodwe(
        db=db,
        serial_number=serial_number,
        inicio=inicio,
        fim=fim,
        consumo_kwh=consumo_kwh,
        usuario_id=usuario_id,
        tarifa=tarifa
    )