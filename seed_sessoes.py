from datetime import datetime, timedelta
import random

from database.database import SessionLocal
from database.models import Usuario, Carregador, Sessao


QUANTIDADE_SESSOES = 140
DIAS_HISTORICO = 90
TARIFA_KWH = 0.95

randomizador = random.Random(2026)


def gerar_historico():

    db = SessionLocal()

    try:

        carregadores = (
            db.query(Carregador)
            .order_by(Carregador.id)
            .all()
        )

        if not carregadores:

            print(
                "[SEED] Nenhum carregador encontrado."
            )

            return


        # Mantém SOMENTE os carregadores
        # que já existem no banco.
        print(
            f"[SEED] Carregadores encontrados: "
            f"{len(carregadores)}"
        )

        for carregador in carregadores:

            print(
                f" - {carregador.id}: "
                f"{carregador.nome}"
            )


        usuarios = (
            db.query(Usuario)
            .order_by(Usuario.id)
            .all()
        )


        if not usuarios:

            print(
                "[SEED] Nenhum usuário encontrado."
            )

            return


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

            usuario = (
                usuarios[
                    indice %
                    len(usuarios)
                ]
            )

            carregador = (
                carregadores[
                    indice %
                    len(carregadores)
                ]
            )


            chave_operacao = (
                f"DEMO-RECARGA-{indice + 1:04d}"
            )


            existente = (
                db.query(Sessao)
                .filter(
                    Sessao.chave_operacao ==
                    chave_operacao
                )
                .first()
            )


            if existente:

                ignoradas += 1

                continue


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
                    30,
                    180
                )
            )


            consumo_kwh = round(
                randomizador.uniform(
                    4.0,
                    18.0
                ),
                2
            )


            # Algumas sessões diferentes
            # para a IA detectar anomalias.
            if indice in (
                17,
                53,
                91,
                126
            ):

                consumo_kwh = round(
                    randomizador.uniform(
                        26.0,
                        38.0
                    ),
                    2
                )

                duracao_minutos = (
                    randomizador.randint(
                        190,
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


            sessao = Sessao(

                usuario_id=
                    usuario.id,

                carregador_id=
                    carregador.id,

                inicio=
                    inicio,

                fim=
                    fim,

                consumo_kwh=
                    consumo_kwh,

                duracao=
                    float(
                        duracao_minutos
                    ),

                tarifa=
                    TARIFA_KWH,

                valor_total=
                    valor_total,

                status=
                    "CONCLUIDA",

                confirmado=
                    True,

                ultima_medicao=
                    fim,

                origem=
                    "DEMO",

                chave_operacao=
                    chave_operacao

            )


            db.add(
                sessao
            )

            criadas += 1


        db.commit()


        print()
        print(
            "================================"
        )

        print(
            " HISTÓRICO CRIADO COM SUCESSO"
        )

        print(
            "================================"
        )

        print(
            f"Sessões criadas: "
            f"{criadas}"
        )

        print(
            f"Sessões já existentes: "
            f"{ignoradas}"
        )

        print(
            f"Usuários utilizados: "
            f"{len(usuarios)}"
        )

        print(
            f"Carregadores utilizados: "
            f"{len(carregadores)}"
        )


        total = (
            db.query(Sessao)
            .count()
        )


        confirmadas = (
            db.query(Sessao)
            .filter(
                Sessao.status ==
                "CONCLUIDA",

                Sessao.confirmado.is_(
                    True
                )
            )
            .count()
        )


        print(
            f"Total de sessões: "
            f"{total}"
        )

        print(
            f"Sessões válidas para IA: "
            f"{confirmadas}"
        )


    except Exception as erro:

        db.rollback()

        print(
            f"[SEED] Erro: "
            f"{erro}"
        )

        raise


    finally:

        db.close()


if __name__ == "__main__":

    gerar_historico()