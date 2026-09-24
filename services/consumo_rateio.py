from sqlalchemy.orm import Session

from database.models import Sessao, Usuario


def calcular_valor_individual(
    consumo_kwh: float,
    tarifa_kwh: float
) -> float:
    return round(consumo_kwh * tarifa_kwh, 2)


def buscar_sessoes_concluidas(db: Session):
    return (
        db.query(Sessao)
        .filter(Sessao.status == "CONCLUIDA")
        .all()
    )


def calcular_consumo_total(db: Session) -> float:
    sessoes = buscar_sessoes_concluidas(db)

    total = sum(
        sessao.consumo_kwh or 0
        for sessao in sessoes
    )

    return round(total, 3)


def calcular_rateio_por_usuario(db: Session):
    sessoes = buscar_sessoes_concluidas(db)

    rateio = {}

    for sessao in sessoes:
        usuario = (
            db.query(Usuario)
            .filter(Usuario.id == sessao.usuario_id)
            .first()
        )

        if usuario is None:
            continue

        if usuario.id not in rateio:
            rateio[usuario.id] = {
                "usuario_id": usuario.id,
                "nome": usuario.nome,
                "consumo_kwh": 0.0,
                "valor_total": 0.0
            }

        rateio[usuario.id]["consumo_kwh"] += (
            sessao.consumo_kwh or 0
        )

        rateio[usuario.id]["valor_total"] += (
            sessao.valor_total or 0
        )

    for dados in rateio.values():
        dados["consumo_kwh"] = round(
            dados["consumo_kwh"],
            3
        )

        dados["valor_total"] = round(
            dados["valor_total"],
            2
        )

    return list(rateio.values())


def gerar_relatorio_rateio(db: Session):
    rateio = calcular_rateio_por_usuario(db)

    consumo_total = round(
        sum(
            usuario["consumo_kwh"]
            for usuario in rateio
        ),
        3
    )

    valor_total = round(
        sum(
            usuario["valor_total"]
            for usuario in rateio
        ),
        2
    )

    return {
        "consumo_total_kwh": consumo_total,
        "valor_total": valor_total,
        "usuarios": rateio
    }

from datetime import datetime


def gerar_rateio_por_periodo(
    db: Session,
    inicio: datetime | None = None,
    fim: datetime | None = None
):
    consulta = (
        db.query(Sessao)
        .filter(Sessao.status == "CONCLUIDA")
    )

    if inicio is not None:
        consulta = consulta.filter(
            Sessao.inicio >= inicio
        )

    if fim is not None:
        consulta = consulta.filter(
            Sessao.inicio <= fim
        )

    sessoes = consulta.all()

    rateio = {}

    for sessao in sessoes:
        if sessao.usuario_id is None:
            continue

        usuario = (
            db.query(Usuario)
            .filter(Usuario.id == sessao.usuario_id)
            .first()
        )

        if usuario is None:
            continue

        if usuario.id not in rateio:
            rateio[usuario.id] = {
                "usuario_id": usuario.id,
                "nome": usuario.nome,
                "total_sessoes": 0,
                "consumo_kwh": 0.0,
                "valor_total": 0.0
            }

        rateio[usuario.id]["total_sessoes"] += 1

        rateio[usuario.id]["consumo_kwh"] += (
            sessao.consumo_kwh or 0
        )

        rateio[usuario.id]["valor_total"] += (
            sessao.valor_total or 0
        )

    usuarios = list(rateio.values())

    for usuario in usuarios:
        usuario["consumo_kwh"] = round(
            usuario["consumo_kwh"],
            3
        )

        usuario["valor_total"] = round(
            usuario["valor_total"],
            2
        )

    consumo_total = round(
        sum(
            usuario["consumo_kwh"]
            for usuario in usuarios
        ),
        3
    )

    valor_total = round(
        sum(
            usuario["valor_total"]
            for usuario in usuarios
        ),
        2
    )

    return {
        "periodo": {
            "inicio": inicio,
            "fim": fim
        },
        "total_usuarios": len(usuarios),
        "consumo_total_kwh": consumo_total,
        "valor_total": valor_total,
        "usuarios": usuarios
    }