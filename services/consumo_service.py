def calcular_valor_recarga(kwh: float, tarifa: float) -> float:
    valor = kwh * tarifa
    return round(valor, 2)