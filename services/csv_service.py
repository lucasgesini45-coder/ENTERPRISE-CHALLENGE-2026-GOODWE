"""
csv_service.py

Responsável por LER e VALIDAR os relatórios exportados do SEMS+ (GoodWe).
Não sabe nada sobre "Carregador", "Sessão" ou regras do EV ChargeOps - isso
fica por conta do goodwe_service.py. Aqui é só: abrir o CSV, entender a
estrutura bagunçada que o SEMS+ exporta e devolver um dicionário organizado.

Por que não usa pandas: o export do SEMS+ tem um cabeçalho "solto" (linhas de
metadados antes da tabela, célula com várias infos separadas por \n) que dá
mais trabalho pra encaixar num DataFrame do que ler com o csv padrão do
Python. Como não precisamos de nenhuma dependência nova, ficou só stdlib.

O SEMS+ tem dois formatos de relatório e os dois vêm com essa mesma estrutura
confusa:

- Relatório ESTATÍSTICO: 1a linha "Report Cycle:.. ~ ..", depois um resumo do
  período inteiro, depois uma tabela com 1 coluna "Total Value" + 1 coluna
  por DIA do período.
- Relatório OPERACIONAL: 1a linha "Report Date:..", depois direto a tabela
  com 1 coluna por HORÁRIO (ou por intervalo de 5 minutos, dependendo do
  filtro escolhido no SEMS+) daquele dia.

Importante: os indicadores presentes variam de exportação para exportação,
dependendo do que a pessoa marcou na tela "Selecionar indicadores" do SEMS+.
Por isso o parser aqui NÃO fixa quais colunas devem existir - ele lê
dinamicamente o que estiver no arquivo. Quem decide o que é "obrigatório"
pro EV ChargeOps é o goodwe_service.py.
"""

import csv
import re

# Nomes de indicador como o SEMS+ exporta (em inglês, com a unidade colada)
# -> chave interna que a gente usa daqui pra frente. Se aparecer um indicador
# que não está no mapa, ele não é descartado: guardamos com o nome original
# "fatiado" (ver _slug), só não ganha uma chave "bonita".
MAPA_INDICADORES = {
    "Energy Generation": "energia_gerada",
    "Charged Energy": "energia_carregada",
    "Discharge Energy": "energia_descarga",
    "Grid Export Energy": "energia_exportada_rede",
    "Import Energy": "energia_importada",
    "Energy Consumption": "energia_consumida",
    "Import Cost": "custo_importacao",
    "Load Power": "potencia_carga",
    "Grid Power": "potencia_rede",
    "Power Factor": "fator_potencia",
    "Grid Frequency": "frequencia_rede",
    "PV Power": "potencia_fotovoltaica",
    "Battery Power": "potencia_bateria",
    "SOC": "soc_bateria",
}


def _slug(texto):
    texto = texto.strip().lower()
    texto = re.sub(r"[^a-z0-9]+", "_", texto)
    return texto.strip("_")


def _numero(valor):
    """Converte texto do CSV em float. Célula vazia (comum em 'Power Factor'
    quando o carregador está parado) vira None em vez de dar erro."""
    if valor is None:
        return None
    valor = valor.strip()
    if valor == "" or valor == "--":
        return None
    try:
        return float(valor)
    except ValueError:
        return None


def _nome_indicador(bruto):
    """'Energy Generation(kWh)' -> 'Energy Generation'
    'Import Cost(BRL (R$))'   -> 'Import Cost'  (usa o 1o '(' só)"""
    return bruto.split("(", 1)[0].strip()


def _chave_indicador(nome):
    return MAPA_INDICADORES.get(nome, _slug(nome))


def _parse_estacao(celula):
    """Quebra a célula de metadados da estação, tipo:
    'Station Name:LAB FIAP Eco Smart Home\nStation Address:...\n
     Rated Power:7.5(kW)\nCreation Time:2025-07-01\n'
    em um dicionário normalizado."""
    campos = {}
    for linha in celula.split("\n"):
        linha = linha.strip()
        if not linha or ":" not in linha:
            continue
        chave, valor = linha.split(":", 1)
        campos[chave.strip()] = valor.strip()

    potencia = None
    if "Rated Power" in campos:
        match = re.search(r"[\d.,]+", campos["Rated Power"])
        if match:
            potencia = float(match.group().replace(",", "."))

    return {
        "nome": campos.get("Station Name"),
        "endereco": campos.get("Station Address"),
        "potencia_nominal_kw": potencia,
        "data_criacao": campos.get("Creation Time"),
    }


def detectar_tipo_relatorio(caminho):
    """Olha só as 2 primeiras linhas do arquivo pra saber se é o relatório
    Estatístico ou o Operacional, sem precisar ler o arquivo inteiro."""
    with open(caminho, encoding="utf-8-sig", newline="") as arquivo:
        leitor = csv.reader(arquivo)
        for linha in leitor:
            if not linha or not linha[0]:
                continue
            if linha[0].startswith("Report Cycle"):
                return "estatistico"
            if linha[0].startswith("Report Date"):
                return "operacional"
    raise ValueError(
        "Não foi possível identificar o tipo do relatório SEMS+ "
        "(esperava uma linha 'Report Cycle:' ou 'Report Date:')."
    )


def _ler_tabela(caminho):
    """Lê o CSV inteiro e devolve (linha_cabecalho, linhas_de_indicador),
    já pulando as linhas de metadados soltas no topo do arquivo."""
    with open(caminho, encoding="utf-8-sig", newline="") as arquivo:
        linhas = list(csv.reader(arquivo))

    indice_cabecalho = None
    for i, linha in enumerate(linhas):
        if len(linha) >= 2 and linha[0].strip() == "Station Information" and linha[1].strip() == "Indicator":
            indice_cabecalho = i
            break

    if indice_cabecalho is None:
        raise ValueError(
            "CSV do SEMS+ fora do formato esperado: não encontrei a linha "
            "de cabeçalho 'Station Information / Indicator'."
        )

    cabecalho = linhas[indice_cabecalho]
    linhas_indicador = [
        linha for linha in linhas[indice_cabecalho + 1:]
        if len(linha) > 1 and linha[1].strip()
    ]
    return cabecalho, linhas_indicador


def ler_relatorio_estatistico(caminho):
    """Relatório Estatístico: 1 valor total + 1 valor por dia, por indicador."""
    cabecalho, linhas_indicador = _ler_tabela(caminho)
    datas = [c.strip() for c in cabecalho[3:]]

    estacao = None
    indicadores = {}
    for linha in linhas_indicador:
        if linha[0].strip() and estacao is None:
            estacao = _parse_estacao(linha[0])

        nome = _nome_indicador(linha[1])
        chave = _chave_indicador(nome)
        valores_dia = linha[3:3 + len(datas)]

        indicadores[chave] = {
            "nome_original": linha[1].strip(),
            "total": _numero(linha[2]) if len(linha) > 2 else None,
            "por_dia": {
                data: _numero(valor) for data, valor in zip(datas, valores_dia)
            },
        }

    return {
        "tipo": "estatistico",
        "estacao": estacao or {},
        "periodo": {"datas": datas},
        "indicadores": indicadores,
    }


def ler_relatorio_operacional(caminho):
    """Relatório Operacional: 1 valor por horário (ou intervalo), por indicador,
    de um único dia."""
    cabecalho, linhas_indicador = _ler_tabela(caminho)
    horarios = [c.strip() for c in cabecalho[2:]]

    estacao = None
    indicadores = {}
    for linha in linhas_indicador:
        if linha[0].strip() and estacao is None:
            estacao = _parse_estacao(linha[0])

        nome = _nome_indicador(linha[1])
        chave = _chave_indicador(nome)
        valores_horario = linha[2:2 + len(horarios)]

        indicadores[chave] = {
            "nome_original": linha[1].strip(),
            "por_horario": {
                horario: _numero(valor) for horario, valor in zip(horarios, valores_horario)
            },
        }

    return {
        "tipo": "operacional",
        "estacao": estacao or {},
        "horarios": horarios,
        "indicadores": indicadores,
    }


def ler_csv(caminho):
    """Ponto de entrada único: detecta o tipo do relatório e chama o parser certo."""
    tipo = detectar_tipo_relatorio(caminho)
    if tipo == "estatistico":
        return ler_relatorio_estatistico(caminho)
    return ler_relatorio_operacional(caminho)


def validar_csv(dados):
    """Confere se os dados lidos fazem sentido antes de seguir pro
    goodwe_service.py. Devolve (ok, lista_de_erros)."""
    erros = []

    if not dados.get("estacao", {}).get("nome"):
        erros.append("Não foi possível identificar o nome da estação/carregador no CSV.")

    if not dados.get("indicadores"):
        erros.append("Nenhum indicador foi encontrado no relatório.")

    if dados.get("tipo") == "estatistico":
        for chave, indicador in dados["indicadores"].items():
            total = indicador.get("total")
            soma_dias = sum(v for v in indicador["por_dia"].values() if v is not None)
            if total is not None and abs(total - soma_dias) > 0.5:
                erros.append(
                    f"Indicador '{indicador['nome_original']}': total do relatório "
                    f"({total}) não bate com a soma dos dias ({round(soma_dias, 2)})."
                )

    return (len(erros) == 0, erros)
