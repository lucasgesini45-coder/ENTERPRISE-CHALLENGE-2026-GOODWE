from datetime import datetime, timedelta
import random

from database.database import SessionLocal
from database.models import (
    Usuario,
    Carregador,
    Sessao
)


QUANTIDADE_SESSOES = 140
DIAS_HISTORICO = 90
TARIFA_KWH = 0.95

randomizador = random.Random(2026)


def gerar_historico():

    db = SessionLocal()

    try:

        carregadores = (
            db.query(Carregador)
            .all()
        )

        if not carregadores:

            print(
                "[SEED] Nenhum carregador encontrado."
            )
            return

        usuarios = (
            db.query(Usuario)
            .all()
        )

        print(
            f"[SEED] Carregadores encontrados: "
            f"{len(carregadores)}"
        )

        print(
            f"[SEED] Usuários encontrados: "
            f"{len(usuarios)}"
        )

        agora = datetime.now()

        criadas = 0
        ignoradas = 0

        for indice in range(
            QUANTIDADE_SESSOES
        ):

            carregador = (
                randomizador.choice(
                    carregadores
                )
            )

            usuario = (
                randomizador.choice(
                    usuarios
                )
                if usuarios
                else None
            )

            dias_atras = (
                randomizador.randint(
                    1,
                    DIAS_HISTORICO
                )
            )

            hora = randomizador.choices(
                population=[
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18,
                    19,
                    20,
                    21
                ],
                weights=[
                    2,
                    4,
                    5,
                    4,
                    3,
                    2,
                    2,
                    3,
                    3,
                    4,
                    5,
                    5,
                    4,
                    3,
                    2
                ],
                k=1
            )[0]

            minuto = (
                randomizador.randint(
                    0,
                    59
                )
            )

            inicio = (
                agora -
                timedelta(
                    days=dias_atras
                )
            ).replace(
                hour=hora,
                minute=minuto,
                second=0,
                microsecond=0
            )

            duracao_minutos = (
                randomizador.randint(
                    25,
                    180
                )
            )

            fim = (
                inicio +
                timedelta(
                    minutes=duracao_minutos
                )
            )

            consumo_kwh = round(
                randomizador.uniform(
                    3.5,
                    18.0
                ),
                2
            )

            # Algumas sessões propositalmente
            # fora do padrão para a IA/anomalias.
            if indice in (
                17,
                53,
                91,
                126
            ):

                consumo_kwh = round(
                    randomizador.uniform(
                        25.0,
                        38.0
                    ),
                    2
                )

                duracao_minutos = (
                    randomizador.randint(
                        180,
                        300
                    )
                )

                fim = (
                    inicio +
                    timedelta(
                        minutes=duracao_minutos
                    )
                )

            valor_total = round(
                consumo_kwh *
                TARIFA_KWH,
                2
            )

            existente = (
                db.query(Sessao)
                .filter(
                    Sessao.carregador_id ==
                    carregador.id,
                    Sessao.inicio ==
                    inicio
                )
                .first()
            )

            if existente:

                ignoradas += 1
                continue

            sessao = Sessao(
                usuario_id=(
                    usuario.id
                    if usuario
                    else None
                ),

                carregador_id=(
                    carregador.id
                ),

                inicio=inicio,
                fim=fim,

                consumo_kwh=(
                    consumo_kwh
                ),

                duracao=(
                    float(
                        duracao_minutos
                    )
                ),

                tarifa=(
                    TARIFA_KWH
                ),

                valor_total=(
                    valor_total
                ),

                status="CONCLUIDA"
            )

            db.add(sessao)

            criadas += 1

        db.commit()

        print()
        print(
            "[SEED] Histórico concluído."
        )

        print(
            f"[SEED] Sessões criadas: "
            f"{criadas}"
        )

        print(
            f"[SEED] Sessões já existentes: "
            f"{ignoradas}"
        )

        total = (
            db.query(Sessao)
            .count()
        )

        print(
            f"[SEED] Total no banco: "
            f"{total}"
        )

    except Exception as erro:

        db.rollback()

        print(
            f"[SEED] Erro: {erro}"
        )

        raise

    finally:

        db.close()


if __name__ == "__main__":
    gerar_historico()