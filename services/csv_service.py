import csv
from datetime import datetime


def ler_csv_goodwe(caminho_arquivo: str):
    sessoes = []
    erros = []

    with open(
        caminho_arquivo,
        mode="r",
        encoding="utf-8-sig",
        newline=""
    ) as arquivo:

        leitor = csv.DictReader(arquivo)

        colunas_obrigatorias = {
            "EV Charger SN",
            "Start Time",
            "End Time",
            "Charged Energy"
        }

        if leitor.fieldnames is None:
            return {
                "sessoes": [],
                "erros": ["Arquivo CSV sem cabecalho"]
            }

        colunas_encontradas = set(leitor.fieldnames)

        faltando = (
            colunas_obrigatorias
            - colunas_encontradas
        )

        if faltando:
            return {
                "sessoes": [],
                "erros": [
                    "Colunas obrigatorias ausentes: "
                    + ", ".join(sorted(faltando))
                ]
            }

        for numero_linha, linha in enumerate(
            leitor,
            start=2
        ):
            try:
                serial_number = (
                    linha["EV Charger SN"]
                    .strip()
                )

                inicio_texto = (
                    linha["Start Time"]
                    .strip()
                )

                fim_texto = (
                    linha["End Time"]
                    .strip()
                )

                consumo_texto = (
                    linha["Charged Energy"]
                    .strip()
                    .replace(",", ".")
                )

                if not serial_number:
                    raise ValueError(
                        "Serial do carregador vazio"
                    )

                inicio = datetime.strptime(
                    inicio_texto,
                    "%m/%d/%Y %H:%M"
                )

                fim = datetime.strptime(
                    fim_texto,
                    "%m/%d/%Y %H:%M"
                )

                consumo_kwh = float(
                    consumo_texto
                )

                if fim < inicio:
                    raise ValueError(
                        "Fim anterior ao inicio"
                    )

                if consumo_kwh < 0:
                    raise ValueError(
                        "Consumo negativo"
                    )

                sessoes.append({
                    "serial_number": serial_number,
                    "inicio": inicio,
                    "fim": fim,
                    "consumo_kwh": consumo_kwh
                })

            except (KeyError, ValueError) as erro:
                erros.append({
                    "linha": numero_linha,
                    "erro": str(erro)
                })

    return {
        "sessoes": sessoes,
        "erros": erros
    }