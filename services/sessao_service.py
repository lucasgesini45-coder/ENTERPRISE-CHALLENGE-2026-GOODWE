from datetime import datetime
from sqlalchemy.orm import Session

from database.models import Sessao


def buscar_sessao(db: Session, sessao_id: int):
    return (
        db.query(Sessao)
        .filter(Sessao.id == sessao_id)
        .first()
    )


def listar_todas_sessoes(db: Session):
    return db.query(Sessao).all()


def finalizar_sessao(
    db: Session,
    sessao_id: int,
    consumo_kwh: float
):
    sessao = buscar_sessao(db, sessao_id)

    if sessao is None:
        return None

    sessao.fim = datetime.now()
    sessao.consumo_kwh = consumo_kwh
    sessao.valor_total = round(
        consumo_kwh * sessao.tarifa,
        2
    )
    sessao.status = "CONCLUIDA"

    db.commit()
    db.refresh(sessao)

    return sessao

def associar_usuario_sessao(
    db: Session,
    sessao_id: int,
    usuario_id: int
):
    sessao = buscar_sessao(db, sessao_id)

    if sessao is None:
        return None

    sessao.usuario_id = usuario_id

    db.commit()
    db.refresh(sessao)

    return sessao