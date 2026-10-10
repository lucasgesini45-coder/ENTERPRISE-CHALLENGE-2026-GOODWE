from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from services.ia_service import (
    prever_consumo,
    detectar_anomalias
)
router = APIRouter(
    prefix="/ia",
    tags=["Inteligencia Artificial"]
)


@router.get("/previsao-consumo")
def previsao_consumo(
    dias: int = 7,
    db: Session = Depends(get_db)
):
    return prever_consumo(
        db=db,
        dias_previsao=dias
    )

@router.get("/anomalias")
def anomalias(
    db: Session = Depends(get_db)
):
    return detectar_anomalias(db)

@router.get("/resumo")
def resumo_ia(
    dias: int = 7,
    db: Session = Depends(get_db)
):
    previsao = prever_consumo(
        db=db,
        dias_previsao=dias
    )

    anomalias = detectar_anomalias(db)

    return {
        "previsao": previsao,
        "anomalias": anomalias
    }

@router.get("/indicadores")
def indicadores_ia(
    dias: int = 7,
    db: Session = Depends(get_db)
):
    previsao = prever_consumo(
        db=db,
        dias_previsao=dias
    )

    anomalias = detectar_anomalias(db)

    if not previsao.get("sucesso"):
        return previsao

    if not anomalias.get("sucesso"):
        return anomalias

    total_anomalias = anomalias["total_anomalias"]

    if total_anomalias == 0:
        nivel_atencao = "NORMAL"

    elif total_anomalias <= 2:
        nivel_atencao = "ATENCAO"

    else:
        nivel_atencao = "CRITICO"

    return {
        "consumo_previsto_kwh":
            previsao["consumo_total_previsto_kwh"],

        "horario_pico_previsto":
            previsao["horario_pico_previsto"],

        "maior_consumo_previsto_kwh":
            previsao["maior_consumo_previsto_kwh"],

        "media_consumo_sessao_kwh":
            previsao["media_consumo_sessao_kwh"],

        "nivel_demanda":
            previsao["nivel_demanda"],

        "total_anomalias":
            total_anomalias,

        "nivel_atencao":
            nivel_atencao
    }