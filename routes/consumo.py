from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from services.consumo_service import calcular_valor_recarga
from services.consumo_rateio import gerar_relatorio_rateio

router = APIRouter(
    prefix="/consumo",
    tags=["Consumo"]
)


@router.get("/calcular")
def calcular_recarga(kwh: float, tarifa: float):
    valor_total = calcular_valor_recarga(kwh, tarifa)

    return {
        "consumo_kwh": kwh,
        "tarifa": tarifa,
        "valor_total": valor_total
    }


@router.get("/rateio")
def consultar_rateio(db: Session = Depends(get_db)):
    return gerar_relatorio_rateio(db)