from fastapi import APIRouter
from services.consumo_service import calcular_valor_recarga

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