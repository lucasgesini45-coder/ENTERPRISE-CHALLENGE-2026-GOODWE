from fastapi import FastAPI

app = FastAPI(
    title="EV ChargeOps API",
    version="1.0.0"
)

@app.get("/")
def teste():
    return {
        "status": "online",
        "mensagem": "EV ChargeOps API funcionando"
    }