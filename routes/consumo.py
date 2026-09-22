from fastapi import APIRouter

router = APIRouter(
    prefix="/consumo",
    tags=["Consumo"]
)


@router.get("/calcular")
def calcular_recarga(kwh: float, tarifa: float):
    valor = kwh * tarifa

    return {
        "consumo_kwh": kwh,
        "tarifa": tarifa,
        "valor_total": round(valor, 2)
    }