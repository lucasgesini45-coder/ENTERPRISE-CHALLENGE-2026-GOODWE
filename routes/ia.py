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