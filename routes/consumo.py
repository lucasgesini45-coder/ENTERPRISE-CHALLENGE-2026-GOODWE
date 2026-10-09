from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from fastapi.responses import StreamingResponse
from services.fatura_pdf_service import gerar_pdf_fatura
from database.database import get_db
from services.consumo_service import calcular_valor_recarga
from services.consumo_rateio import (
    gerar_relatorio_rateio,
    gerar_rateio_por_periodo,
    gerar_fatura_usuario
)

router = APIRouter(
    prefix="/consumo",
    tags=["Consumo"]
)


@router.get("/calcular")
def calcular_recarga(
    kwh: float,
    tarifa: float
):
    valor_total = calcular_valor_recarga(
        kwh,
        tarifa
    )

    return {
        "consumo_kwh": kwh,
        "tarifa": tarifa,
        "valor_total": valor_total
    }


@router.get("/rateio")
def consultar_rateio(
    db: Session = Depends(get_db)
):
    return gerar_relatorio_rateio(db)


@router.get("/rateio-mensal")
def consultar_rateio_mensal(
    inicio: datetime | None = None,
    fim: datetime | None = None,
    db: Session = Depends(get_db)
):
    return gerar_rateio_por_periodo(
        db=db,
        inicio=inicio,
        fim=fim
    )

@router.get("/fatura-usuario/{usuario_id}")
def fatura_usuario(
    usuario_id: int,
    inicio: datetime | None = None,
    fim: datetime | None = None,
    db: Session = Depends(get_db)
):
    return gerar_fatura_usuario(
        db=db,
        usuario_id=usuario_id,
        inicio=inicio,
        fim=fim
    )

@router.get("/fatura-usuario/{usuario_id}/pdf")
def fatura_usuario_pdf(
    usuario_id: int,
    inicio: datetime | None = None,
    fim: datetime | None = None,
    db: Session = Depends(get_db)
):
    dados = gerar_fatura_usuario(
        db=db,
        usuario_id=usuario_id,
        inicio=inicio,
        fim=fim
    )

    if not dados.get("sucesso"):
        return dados

    pdf = gerar_pdf_fatura(dados)

    nome_arquivo = f"fatura_usuario_{usuario_id}.pdf"

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f'attachment; filename="{nome_arquivo}"'
        }
    )