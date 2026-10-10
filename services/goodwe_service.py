from datetime import datetime
from sqlalchemy.orm import Session

from database.models import Carregador, Sessao
from services.csv_service import ler_csv_goodwe


def buscar_carregador_por_serial(
    db: Session,
    serial_number: str
):
    return (
        db.query(Carregador)
        .filter(Carregador.serial_number == serial_number)
        .first()
    )


def buscar_sessao_existente(
    db: Session,
    carregador_id: int,
    inicio: datetime,
    fim: datetime
):
    return (
        db.query(Sessao)
        .filter(
            Sessao.carregador_id == carregador_id,
            Sessao.inicio == inicio,
            Sessao.fim == fim
        )
        .first()
    )


def importar_sessao_goodwe(
    db: Session,
    serial_number: str,
    inicio: datetime,
    fim: datetime,
    consumo_kwh: float,
    usuario_id: int | None = None,
    tarifa: float = 0.0
):
    carregador = buscar_carregador_por_serial(
        db,
        serial_number
    )

    if carregador is None:
        return {
            "sucesso": False,
            "erro": "Carregador nao encontrado"
        }

    sessao_existente = buscar_sessao_existente(
        db,
        carregador.id,
        inicio,
        fim
    )

    if sessao_existente:
        return {
            "sucesso": False,
            "erro": "Sessao ja importada",
            "sessao_id": sessao_existente.id
        }

    duracao_minutos = (
        fim - inicio
    ).total_seconds() / 60

    valor_total = round(
        consumo_kwh * tarifa,
        2
    )

    nova_sessao = Sessao(
        usuario_id=usuario_id,
        carregador_id=carregador.id,
        inicio=inicio,
        fim=fim,
        consumo_kwh=consumo_kwh,
        duracao=round(duracao_minutos, 2),
        tarifa=tarifa,
        valor_total=valor_total,
        status="CONCLUIDA"
    )

    db.add(nova_sessao)
    db.commit()
    db.refresh(nova_sessao)

    return {
        "sucesso": True,
        "sessao_id": nova_sessao.id,
        "carregador_id": carregador.id,
        "consumo_kwh": nova_sessao.consumo_kwh,
        "duracao_minutos": nova_sessao.duracao,
        "valor_total": nova_sessao.valor_total
    }

def importar_sessoes_lote(
    db: Session,
    sessoes: list
):
    resultados = []

    importadas = 0
    duplicadas = 0
    erros = 0

    for sessao in sessoes:
        resultado = importar_sessao_goodwe(
            db=db,
            serial_number=sessao.serial_number,
            inicio=sessao.inicio,
            fim=sessao.fim,
            consumo_kwh=sessao.consumo_kwh,
            usuario_id=sessao.usuario_id,
            tarifa=sessao.tarifa
        )

        resultados.append(resultado)

        if resultado.get("sucesso"):
            importadas += 1

        elif resultado.get("erro") == "Sessao ja importada":
            duplicadas += 1

        else:
            erros += 1

    return {
        "total_recebidas": len(sessoes),
        "importadas": importadas,
        "duplicadas": duplicadas,
        "erros": erros,
        "resultados": resultados
    }

def importar_csv_goodwe(
    db: Session,
    caminho_arquivo: str,
    tarifa: float = 0.0
):
    leitura = ler_csv_goodwe(
        caminho_arquivo
    )

    sessoes = leitura["sessoes"]
    erros_csv = leitura["erros"]

    resultados = []

    importadas = 0
    duplicadas = 0
    erros = len(erros_csv)

    for sessao in sessoes:
        resultado = importar_sessao_goodwe(
            db=db,
            serial_number=sessao["serial_number"],
            inicio=sessao["inicio"],
            fim=sessao["fim"],
            consumo_kwh=sessao["consumo_kwh"],
            tarifa=tarifa,
            usuario_id=None
        )

        resultados.append(resultado)

        if resultado.get("sucesso"):
            importadas += 1

        elif resultado.get("erro") == "Sessao ja importada":
            duplicadas += 1

        else:
            erros += 1

    return {
        "total_lidas": len(sessoes),
        "importadas": importadas,
        "duplicadas": duplicadas,
        "erros": erros,
        "erros_csv": erros_csv,
        "resultados": resultados
    }