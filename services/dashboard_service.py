from datetime import datetime
from sqlalchemy.orm import Session

from database.models import Usuario, Carregador, Sessao


def gerar_resumo_dashboard(
    db: Session,
    inicio: datetime | None = None,
    fim: datetime | None = None
):
    total_usuarios = db.query(Usuario).count()
    total_carregadores = db.query(Carregador).count()

    consulta = db.query(Sessao)

    if inicio is not None:
        consulta = consulta.filter(
            Sessao.inicio >= inicio
        )

    if fim is not None:
        consulta = consulta.filter(
            Sessao.inicio <= fim
        )

    sessoes = consulta.all()

    sessoes_concluidas = [
        sessao
        for sessao in sessoes
        if sessao.status == "CONCLUIDA"
    ]

    sessoes_sem_usuario = sum(
        1
        for sessao in sessoes
        if sessao.usuario_id is None
    )

    consumo_total = round(
        sum(
            sessao.consumo_kwh or 0
            for sessao in sessoes_concluidas
        ),
        3
    )

    valor_total = round(
        sum(
            sessao.valor_total or 0
            for sessao in sessoes_concluidas
        ),
        2
    )

    return {
        "periodo": {
            "inicio": inicio,
            "fim": fim
        },
        "total_usuarios": total_usuarios,
        "total_carregadores": total_carregadores,
        "total_sessoes": len(sessoes),
        "sessoes_concluidas": len(sessoes_concluidas),
        "sessoes_sem_usuario": sessoes_sem_usuario,
        "consumo_total_kwh": consumo_total,
        "valor_total": valor_total
    }