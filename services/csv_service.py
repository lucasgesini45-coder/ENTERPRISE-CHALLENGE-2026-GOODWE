import csv
from datetime import datetime


def ler_csv_goodwe(caminho_arquivo: str):
    sessoes = []

    with open(
        caminho_arquivo,
        mode="r",
        encoding="utf-8-sig",
        newline=""
    ) as arquivo:

        leitor = csv.DictReader(arquivo)

        for linha in leitor:

            try:
                serial_number = linha["EV Charger SN"]

                inicio = datetime.strptime(
                    linha["Start Time"],
                    "%m/%d/%Y %H:%M"
                )

                fim = datetime.strptime(
                    linha["End Time"],
                    "%m/%d/%Y %H:%M"
                )

                consumo_kwh = float(
                    linha["Charged Energy"]
                )

                sessoes.append({
                    "serial_number": serial_number,
                    "inicio": inicio,
                    "fim": fim,
                    "consumo_kwh": consumo_kwh
                })

            except (KeyError, ValueError):
                continue

    return sessoes