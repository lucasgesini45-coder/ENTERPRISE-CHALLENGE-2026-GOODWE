import asyncio
from datetime import datetime, timezone

import websockets

from ocpp.v16 import ChargePoint as ChargePointBase
from ocpp.v16 import call
from ocpp.v16.enums import RegistrationStatus


class ChargePoint(ChargePointBase):

    async def enviar_boot_notification(self):

        resposta = await self.call(
            call.BootNotification(
                charge_point_model="HCA G2",
                charge_point_vendor="GoodWe"
            )
        )

        if (
            resposta.status ==
            RegistrationStatus.accepted
        ):
            print(
                "[SIMULADOR] Carregador aceito pelo servidor."
            )

            await asyncio.sleep(1)

            await self.enviar_status(
                "Available"
            )

            await asyncio.sleep(2)

            await self.enviar_status(
                "Charging"
            )

            await asyncio.sleep(1)

            await self.iniciar_recarga()

        else:
            print(
                "[SIMULADOR] Carregador recusado."
            )


    async def enviar_status(
        self,
        status
    ):

        await self.call(
            call.StatusNotification(
                connector_id=1,
                error_code="NoError",
                status=status
            )
        )

        print(
            f"[SIMULADOR] Status enviado: {status}"
        )


    async def iniciar_recarga(self):

        resposta = await self.call(
            call.StartTransaction(
                connector_id=1,
                id_tag="RFID-DEMO-001",
                meter_start=0,
                timestamp=datetime.now(
                    timezone.utc
                ).isoformat()
            )
        )

        transaction_id = (
            resposta.transaction_id
        )

        print(
            f"[SIMULADOR] Recarga iniciada. "
            f"Transação: {transaction_id}"
        )

        await asyncio.sleep(2)

        await self.enviar_medicao(
            transaction_id,
            1800
        )

        await asyncio.sleep(2)

        await self.enviar_medicao(
            transaction_id,
            4200
        )

        await asyncio.sleep(2)

        await self.enviar_medicao(
            transaction_id,
            7300
        )
        await asyncio.sleep(2)

        await self.finalizar_recarga(
            transaction_id,
            7300
        )

    async def enviar_medicao(
        self,
        transaction_id,
        energia_wh
    ):

        await self.call(
            call.MeterValues(
                connector_id=1,
                transaction_id=transaction_id,
                meter_value=[
                    {
                        "timestamp":
                            datetime.now(
                                timezone.utc
                            ).isoformat(),

                        "sampled_value": [
                            {
                                "value":
                                    str(energia_wh),

                                "measurand":
                                    "Energy.Active.Import.Register",

                                "unit":
                                    "Wh"
                            }
                        ]
                    }
                ]
            )
        )

        print(
            f"[SIMULADOR] Medição enviada: "
            f"{energia_wh} Wh"
        )
    async def finalizar_recarga(
        self,
        transaction_id,
        meter_stop
    ):

        await self.call(
            call.StopTransaction(
                transaction_id=transaction_id,
                meter_stop=meter_stop,
                timestamp=datetime.now(
                    timezone.utc
                ).isoformat(),
                reason="Local"
            )
        )

        print(
            f"[SIMULADOR] Recarga finalizada. "
            f"Transação: {transaction_id}"
        )

        await asyncio.sleep(1)

        await self.enviar_status(
            "Available"
        )


async def main():

    async with websockets.connect(
        "ws://127.0.0.1:9000/FIAP-PAULISTA-001",
        subprotocols=[
            "ocpp1.6"
        ]
    ) as websocket:

        carregador = ChargePoint(
            "FIAP-PAULISTA-001",
            websocket
        )

        await asyncio.gather(
            carregador.start(),
            carregador.enviar_boot_notification()
        )


if __name__ == "__main__":
    asyncio.run(main())