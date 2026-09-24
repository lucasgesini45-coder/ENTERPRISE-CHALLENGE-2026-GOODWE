from fastapi import FastAPI

from routes.consumo import router as consumo_router
from routes.carregadores import router as carregadores_router
from routes.sessoes import router as sessoes_router
from routes.usuarios import router as usuarios_router
from routes.goodwe import router as goodwe_router


app = FastAPI(
    title="EV ChargeOps API",
    version="1.0.0"
)

app.include_router(consumo_router)
app.include_router(carregadores_router)
app.include_router(sessoes_router)
app.include_router(usuarios_router)
app.include_router(goodwe_router)


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