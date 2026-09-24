from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from services.consumo_service import calcular_valor_recarga
from services.consumo_rateio import (
    gerar_relatorio_rateio,
    gerar_rateio_por_periodo
)

router = APIRouter(
    prefix="/consumo",
    tags=["Consumo"]
)


@router.get("/calcular")
def calcular_recarga(
    kwh: float,
    tarifa: float
):
    valor_total = calcular_valor_recarga(
        kwh,
        tarifa
    )

    return {
        "consumo_kwh": kwh,
        "tarifa": tarifa,
        "valor_total": valor_total
    }


@router.get("/rateio")
def consultar_rateio(
    db: Session = Depends(get_db)
):
    return gerar_relatorio_rateio(db)


@router.get("/rateio-mensal")
def consultar_rateio_mensal(
    inicio: datetime | None = None,
    fim: datetime | None = None,
    db: Session = Depends(get_db)
):
    return gerar_rateio_por_periodo(
        db=db,
        inicio=inicio,
        fim=fim
    )