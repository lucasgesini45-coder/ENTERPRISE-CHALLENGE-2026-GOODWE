import asyncio
import logging
import sys
from pathlib import Path
from datetime import datetime, timezone

import websockets

# Permite acessar database/ a partir deste arquivo
RAIZ_PROJETO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ_PROJETO))

from ocpp.routing import on
from ocpp.v16 import ChargePoint as ChargePointBase
from ocpp.v16 import call_result
from ocpp.v16.enums import Action, RegistrationStatus

from database.database import SessionLocal
from database.models import Carregador, Sessao


logging.basicConfig(
    level=logging.INFO
)


class ChargePoint(ChargePointBase):

    @on(Action.boot_notification)
    async def on_boot_notification(
        self,
        charge_point_vendor,
        charge_point_model,
        **kwargs
    ):

        print(
            f"[OCPP] Carregador conectado: "
            f"{charge_point_vendor} - "
            f"{charge_point_model}"
        )

        return call_result.BootNotification(
            current_time=datetime.now(
                timezone.utc
            ).isoformat(),
            interval=10,
            status=RegistrationStatus.accepted
        )


    @on(Action.status_notification)
    async def on_status_notification(
        self,
        connector_id,
        error_code,
        status,
        **kwargs
    ):

        print(
            f"[OCPP] Status recebido | "
            f"Carregador: {self.id} | "
            f"Conector: {connector_id} | "
            f"Status: {status}"
        )

        mapa_status = {
            "Available": "ATIVO",
            "Charging": "EM_RECARGA",
            "Unavailable": "OFFLINE",
            "Faulted": "OFFLINE"
        }

        status_evchargeops = mapa_status.get(
            str(status),
            "OFFLINE"
        )

        db = SessionLocal()

        try:

            carregador = (
                db.query(Carregador)
                .filter(
                    Carregador.serial_number ==
                    self.id
                )
                .first()
            )

            if carregador:

                carregador.status = (
                    status_evchargeops
                )

                carregador.atualizado_em = (
                    datetime.now()
                )

                db.commit()

                print(
                    f"[BANCO] {self.id} atualizado para "
                    f"{status_evchargeops}"
                )

            else:

                print(
                    f"[BANCO] Carregador {self.id} "
                    f"não encontrado."
                )

        except Exception as erro:

            db.rollback()

            print(
                f"[BANCO] Erro ao atualizar "
                f"{self.id}: {erro}"
            )

        finally:

            db.close()

        return call_result.StatusNotification()
    
    @on(Action.start_transaction)
    async def on_start_transaction(
        self,
        connector_id,
        id_tag,
        meter_start,
        timestamp,
        **kwargs
    ):

        print(
            f"[OCPP] Início de recarga | "
            f"Carregador: {self.id} | "
            f"Conector: {connector_id} | "
            f"RFID: {id_tag} | "
            f"Medidor inicial: {meter_start}"
        )

        db = SessionLocal()

        try:

            carregador = (
                db.query(Carregador)
                .filter(
                    Carregador.serial_number ==
                    self.id
                )
                .first()
            )

            if not carregador:

                print(
                    f"[BANCO] Carregador "
                    f"{self.id} não encontrado."
                )

                return call_result.StartTransaction(
                    transaction_id=0,
                    id_tag_info={
                        "status": "Invalid"
                    }
                )

            inicio = datetime.fromisoformat(
                timestamp.replace(
                    "Z",
                    "+00:00"
                )
            )

            sessao = Sessao(
                carregador_id=carregador.id,
                usuario_id=None,
                inicio=inicio,
                consumo_kwh=0.0,
                duracao=0.0,
                tarifa=0.0,
                valor_total=0.0,
                status="EM_ANDAMENTO"
            )

            db.add(sessao)

            carregador.status = (
                "EM_RECARGA"
            )

            carregador.atualizado_em = (
                datetime.now()
            )

            db.commit()
            db.refresh(sessao)

            print(
                f"[BANCO] Sessão #{sessao.id} "
                f"criada para {self.id}"
            )

            return call_result.StartTransaction(
                transaction_id=sessao.id,
                id_tag_info={
                    "status": "Accepted"
                }
            )

        except Exception as erro:

            db.rollback()

            print(
                f"[BANCO] Erro ao iniciar sessão: "
                f"{erro}"
            )

            raise

        finally:

            db.close()

    @on(Action.meter_values)
    async def on_meter_values(
        self,
        connector_id,
        meter_value,
        transaction_id=None,
        **_
    ):

        print(
            f"[OCPP] MeterValues | "
            f"Transação: {transaction_id}"
        )

        if not transaction_id:
            return call_result.MeterValues()

        if not meter_value:
            return call_result.MeterValues()

        leitura = meter_value[-1]

        sampled_values = (
            leitura.get(
                "sampled_value",
                []
            )
        )

        energia_wh = None

        for valor in sampled_values:

            if (
                valor.get("measurand") ==
                "Energy.Active.Import.Register"
            ):

                energia_wh = float(
                    valor.get(
                        "value",
                        0
                    )
                )

                break

        if energia_wh is None:
            return call_result.MeterValues()

        consumo_kwh = (
            energia_wh / 1000
        )

        db = SessionLocal()

        try:

            sessao = (
                db.query(Sessao)
                .filter(
                    Sessao.id ==
                    transaction_id
                )
                .first()
            )

            if sessao:

                sessao.consumo_kwh = (
                    consumo_kwh
                )

                db.commit()

                print(
                    f"[BANCO] Sessão "
                    f"#{transaction_id} -> "
                    f"{consumo_kwh:.2f} kWh"
                )

        except Exception as erro:

            db.rollback()

            print(
                f"[BANCO] Erro em MeterValues: "
                f"{erro}"
            )

        finally:

            db.close()

        return call_result.MeterValues()
@on(Action.stop_transaction)
async def on_stop_transaction(
    self,
    meter_stop,
    timestamp,
    transaction_id,
    reason=None,
    **_
):

    print(
        f"[OCPP] Fim de recarga | "
        f"Transação: {transaction_id} | "
        f"Medidor final: {meter_stop}"
    )

    db = SessionLocal()

    try:

        sessao = (
            db.query(Sessao)
            .filter(
                Sessao.id ==
                transaction_id
            )
            .first()
        )

        if not sessao:

            print(
                f"[BANCO] Sessão "
                f"#{transaction_id} "
                f"não encontrada."
            )

            return call_result.StopTransaction(
                id_tag_info={
                    "status": "Invalid"
                }
            )

        fim = datetime.fromisoformat(
            timestamp.replace(
                "Z",
                "+00:00"
            )
        )

        sessao.fim = fim

        duracao_segundos = (
            fim - sessao.inicio
        ).total_seconds()

        sessao.duracao = (
            duracao_segundos / 60
        )

        consumo_kwh = (
            float(meter_stop) / 1000
        )

        sessao.consumo_kwh = (
            consumo_kwh
        )

        tarifa_kwh = 0.95

        sessao.tarifa = (
            tarifa_kwh
        )

        sessao.valor_total = (
            consumo_kwh *
            tarifa_kwh
        )

        sessao.status = (
            "CONCLUIDA"
        )

        carregador = (
            db.query(Carregador)
            .filter(
                Carregador.id ==
                sessao.carregador_id
            )
            .first()
        )

        if carregador:

            carregador.status = (
                "ATIVO"
            )

            carregador.atualizado_em = (
                datetime.now()
            )

        db.commit()

        print(
            f"[BANCO] Sessão "
            f"#{transaction_id} concluída | "
            f"{consumo_kwh:.2f} kWh | "
            f"R$ {sessao.valor_total:.2f}"
        )

        return call_result.StopTransaction(
            id_tag_info={
                "status": "Accepted"
            }
        )

    except Exception as erro:

        db.rollback()

        print(
            f"[BANCO] Erro ao finalizar sessão: "
            f"{erro}"
        )

        raise

    finally:

        db.close()

async def on_connect(websocket):

    caminho = websocket.request.path

    charge_point_id = (
        caminho.split("/")[-1]
    )

    print(
        f"[OCPP] Conexão recebida: "
        f"{charge_point_id}"
    )

    carregador = ChargePoint(
        charge_point_id,
        websocket
    )

    await carregador.start()


async def main():

    servidor = await websockets.serve(
        on_connect,
        "0.0.0.0",
        9000,
        subprotocols=[
            "ocpp1.6"
        ]
    )

    print(
        "[OCPP] Servidor iniciado em "
        "ws://127.0.0.1:9000"
    )

    await servidor.wait_closed()


if __name__ == "__main__":
    asyncio.run(main())