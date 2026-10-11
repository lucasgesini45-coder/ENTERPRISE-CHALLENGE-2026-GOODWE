from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Carregador, TelemetriaCarregador
from schemas.carregador import CarregadorCreate, TelemetriaCreate
from datetime import datetime, timezone
import os
import json


router = APIRouter(
    prefix="/carregadores",
    tags=["Carregadores"]
)


@router.get("/")
def listar_carregadores(
    db: Session = Depends(get_db)
):
    carregadores = db.query(Carregador).all()

    return {
        "carregadores": [estado_atual(c) for c in carregadores]
    }


@router.post("/")
def criar_carregador(
    carregador: CarregadorCreate,
    db: Session = Depends(get_db)
):
    novo_carregador = Carregador(
        nome=carregador.nome,
        serial_number=carregador.serial_number,
        localizacao=carregador.localizacao,
        status="DESCONHECIDO",
        modelo=carregador.modelo,
        latitude=carregador.latitude, longitude=carregador.longitude,
        potencia_maxima=carregador.potencia_maxima
    )

    db.add(novo_carregador)

    db.commit()

    db.refresh(novo_carregador)

    return novo_carregador

def estado_atual(carregador):
    result = {col.name: getattr(carregador, col.name) for col in Carregador.__table__.columns}
    age = (datetime.now(timezone.utc).replace(tzinfo=None) - carregador.atualizado_em).total_seconds() if carregador.atualizado_em else None
    limit = int(os.environ.get("TELEMETRY_MAX_AGE_SECONDS", "300"))
    result["telemetria_recente"] = age is not None and 0 <= age <= limit
    if not result["telemetria_recente"]:
        result["status"] = "DESCONHECIDO"
    return result


@router.post("/{carregador_id}/telemetria")
def telemetria(carregador_id: int, dados: TelemetriaCreate, db: Session = Depends(get_db)):
    from services.session_lifecycle import lock
    lock(db)
    charger = db.query(Carregador).filter_by(id=carregador_id).with_for_update().first()
    if not charger:
        raise HTTPException(404, "Carregador não encontrado")
    payload = json.dumps(dados.model_dump(mode="json"), sort_keys=True)
    previous = db.query(TelemetriaCarregador).filter_by(carregador_id=carregador_id, chave_evento=dados.chave_evento).first()
    if previous:
        if previous.dados != payload:
            raise HTTPException(409, "Chave já usada com outra telemetria")
        return estado_atual(charger)
    instante = dados.instante.astimezone(timezone.utc).replace(tzinfo=None)
    if instante > datetime.now(timezone.utc).replace(tzinfo=None):
        raise HTTPException(422, "Telemetria no futuro")
    db.add(TelemetriaCarregador(carregador_id=carregador_id, chave_evento=dados.chave_evento, dados=payload))
    if charger.atualizado_em is None or instante > charger.atualizado_em:
        charger.atualizado_em = instante
        charger.status = dados.status
    db.commit()
    db.refresh(charger)
    return estado_atual(charger)
