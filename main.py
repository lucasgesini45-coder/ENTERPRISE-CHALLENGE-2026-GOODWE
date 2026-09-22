from fastapi import FastAPI

app = FastAPI(
    title="EV ChargeOps API",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "mensagem": "EV ChargeOps API funcionando"
    }


@app.get("/health")
def health():
    return {
        "status": "online"
    }


@app.get("/carregadores")
def listar_carregadores():
    return {
        "carregadores": []
    }


@app.get("/sessoes")
def listar_sessoes():
    return {
        "sessoes": []
    }


@app.get("/consumo/calcular")
def calcular_recarga(kwh: float, tarifa: float):
    valor = kwh * tarifa

    return {
        "consumo_kwh": kwh,
        "tarifa": tarifa,
        "valor_total": round(valor, 2)
    }