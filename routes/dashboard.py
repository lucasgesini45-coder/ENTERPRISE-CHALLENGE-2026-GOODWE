from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from services.dashboard_service import gerar_resumo_dashboard


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/resumo")
def resumo_dashboard(
    inicio: datetime | None = None,
    fim: datetime | None = None,
    db: Session = Depends(get_db)
):
    return gerar_resumo_dashboard(
        db=db,
        inicio=inicio,
        fim=fim
    )