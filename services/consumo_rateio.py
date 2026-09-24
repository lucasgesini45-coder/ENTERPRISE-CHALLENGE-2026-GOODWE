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