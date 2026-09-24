from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from routes.consumo import router as consumo_router
from routes.carregadores import router as carregadores_router
from routes.sessoes import router as sessoes_router
from routes.usuarios import router as usuarios_router
from routes.goodwe import router as goodwe_router
from routes.dashboard import router as dashboard_router
from routes.ia import router as ia_router

app = FastAPI(
    title="EV ChargeOps API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(consumo_router)
app.include_router(carregadores_router)
app.include_router(sessoes_router)
app.include_router(usuarios_router)
app.include_router(goodwe_router)
app.include_router(dashboard_router)
app.include_router(ia_router)


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