from decimal import Decimal, ROUND_HALF_UP
import math
from fastapi import HTTPException


def calcular_valor_recarga(kwh: float, tarifa: float) -> float:
    if not math.isfinite(kwh) or not math.isfinite(tarifa) or kwh < 0 or tarifa < 0:
        raise HTTPException(422, "Consumo e tarifa devem ser finitos e não negativos")
    return float((Decimal(str(kwh)) * Decimal(str(tarifa))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
