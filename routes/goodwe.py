import os
import shutil
from fastapi import UploadFile, File

from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from services.goodwe_service import importar_sessao_goodwe
from schemas.goodwe import ImportacaoGoodWeLote
from services.goodwe_service import (
    importar_sessao_goodwe,
    importar_sessoes_lote,
    importar_csv_goodwe
)

router = APIRouter(
    prefix="/goodwe",
    tags=["GoodWe"]
)


@router.post("/importar-sessao")
def importar_sessao(
    serial_number: str,
    inicio: datetime,
    fim: datetime,
    consumo_kwh: float,
    tarifa: float = 0.0,
    usuario_id: int | None = None,
    db: Session = Depends(get_db)
):
    return importar_sessao_goodwe(
        db=db,
        serial_number=serial_number,
        inicio=inicio,
        fim=fim,
        consumo_kwh=consumo_kwh,
        usuario_id=usuario_id,
        tarifa=tarifa
    )

@router.post("/importar-lote")
def importar_lote(
    dados: ImportacaoGoodWeLote,
    db: Session = Depends(get_db)
):
    return importar_sessoes_lote(
        db,
        dados.sessoes
    )

@router.post("/importar-csv")
def importar_csv(
    arquivo: UploadFile = File(...),
    tarifa: float = 0.0,
    db: Session = Depends(get_db)
):
    caminho_temporario = f"temp_{arquivo.filename}"

    with open(caminho_temporario, "wb") as buffer:
        shutil.copyfileobj(
            arquivo.file,
            buffer
        )

    try:
        resultado = importar_csv_goodwe(
            db=db,
            caminho_arquivo=caminho_temporario,
            tarifa=tarifa
        )

        return resultado

    finally:
        if os.path.exists(caminho_temporario):
            os.remove(caminho_temporario)