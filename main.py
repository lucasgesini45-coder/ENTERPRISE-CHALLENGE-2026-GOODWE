import asyncio
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from database.database import initialize_database, get_db
from services.security import require_admin
from services.recovery import reconcile_stale_sessions
from database.models import Sessao
from datetime import datetime, timedelta, timezone
from routes import auth, pessoal, consumo, carregadores, sessoes, usuarios, cartoes, goodwe, dashboard, ia, assistente_ia

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app):
    initialize_database()
    stop = asyncio.Event()
    async def monitor():
        while not stop.is_set():
            try:
                await asyncio.to_thread(reconcile_stale_sessions)
            except SQLAlchemyError:
                logger.error("Conciliação adiada: banco indisponível")
            try:
                await asyncio.wait_for(stop.wait(), timeout=30)
            except asyncio.TimeoutError:
                pass
    task = asyncio.create_task(monitor())
    try:
        yield
    finally:
        stop.set()
        await task


app = FastAPI(title="EV ChargeOps API", version="1.1.0", lifespan=lifespan)
for module in (consumo, carregadores, sessoes, usuarios, cartoes, goodwe, dashboard, ia, assistente_ia):
    app.include_router(module.router, dependencies=[Depends(require_admin)])
app.include_router(auth.router)
app.include_router(pessoal.router)
app.mount("/painel", StaticFiles(directory=Path(__file__).parent / "frontend", html=True), name="painel")


@app.exception_handler(SQLAlchemyError)
async def database_error(request, exc):
    logger.error("Falha de banco em %s", request.url.path)
    return JSONResponse(status_code=503, content={"detail": "Banco indisponível; operação não confirmada"})


@app.get("/")
def home():
    return RedirectResponse("/painel/")


@app.get("/health")
def health(db=Depends(get_db)):
    db.execute(text("SELECT id FROM sessoes LIMIT 1"))
    db.execute(text("SELECT id FROM cartoes_rfid LIMIT 1"))
    db.execute(text("SELECT id FROM eventos_sessao LIMIT 1"))
    cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(seconds=int(os.environ.get("TELEMETRY_MAX_AGE_SECONDS", "300")))
    stale = db.query(Sessao).filter(Sessao.status == "EM_ANDAMENTO", Sessao.ultima_medicao < cutoff).count()
    pending = db.query(Sessao).filter(Sessao.status == "PENDENTE_CONCILIACAO").count()
    return {"status": "online", "banco": "disponivel", "sessoes_sem_telemetria_recente": stale, "sessoes_pendentes": pending}


@app.get("/live")
def live():
    return {"status": "online"}
