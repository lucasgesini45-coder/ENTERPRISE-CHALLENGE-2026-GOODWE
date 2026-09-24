"""
goodwe_service.py
Responsabilidade: Calebe - Integração GoodWe SEMS+

O que esse arquivo faz:
    Pega o relatório exportado do SEMS+ (via csv_service.py) e transforma
    nos dados que o resto do EV ChargeOps entende: dados do Carregador e
    leituras de energia (Energia Carregada, potência, etc).

O que esse arquivo NÃO faz (de propósito):
    - Não sabe quem é o usuário/morador que carregou o carro. O CSV do
      SEMS+ traz dados AGREGADOS da estação (por dia ou por horário), não
      por sessão de recarga individual. Ligar "energia carregada" a um
      morador específico é responsabilidade do módulo de Sessões -
      aqui a gente só entrega a medição real da GoodWe pra essa ligação
      acontecer lá.
    - Não fala com a API oficial da GoodWe. Por enquanto a equipe não tem
      acesso à API (Open API / SEMS Portal API) necessária pra integração
      direta, então o MVP usa a exportação CSV do SEMS+ como fonte de dados
      operacionais. A estrutura foi feita para, no futuro, um
      `obter_relatorio_via_api(...)` poder alimentar as mesmas funções
      abaixo sem mudar o resto do sistema.
"""

from services import csv_service

# "Energia Carregada" é o indicador mais importante pro EV ChargeOps: é ele
# que corresponde à recarga do veículo (consumo_kwh da Sessão -> valor_total
# da cobrança). Os outros indicadores (geração, importação/exportação de
# rede etc) servem pra contexto/monitoramento, não pra cobrança.
INDICADOR_PRINCIPAL = "energia_carregada"


def carregar_relatorio_sems(caminho_csv):
    """Lê e valida um relatório do SEMS+ (Estatístico ou Operacional).
    Lança ValueError se o arquivo não passar na validação."""
    dados = csv_service.ler_csv(caminho_csv)
    ok, erros = csv_service.validar_csv(dados)
    if not ok:
        raise ValueError("CSV do SEMS+ inválido: " + "; ".join(erros))
    return dados


def obter_dados_carregador(dados):
    """Monta as informações do carregador a partir do relatório, no formato
    usado pelo resto do sistema (~ schemas/carregador.py e o model Charger).
    """
    estacao = dados.get("estacao", {})
    return {
        "nome": estacao.get("nome"),
        "localizacao": estacao.get("endereco"),
        "potencia_maxima": estacao.get("potencia_nominal_kw"),
        "modelo": "GoodWe",
        "status": obter_status(dados),
        "atualizado_em": _data_referencia(dados),
    }


def obter_energia_carregada(dados):
    """Energia Carregada total do período (kWh). Só existe no relatório
    Estatístico - o Operacional não traz esse indicador por padrão."""
    indicador = dados.get("indicadores", {}).get(INDICADOR_PRINCIPAL)
    if not indicador:
        return None
    return indicador.get("total")


def obter_energia_carregada_por_dia(dados):
    """{'01/09/2026': 0.5, '02/09/2026': 2.9, ...} - útil pra reconciliar com
    sessões e pra montar histórico/dashboard."""
    indicador = dados.get("indicadores", {}).get(INDICADOR_PRINCIPAL)
    if not indicador:
        return {}
    return indicador.get("por_dia", {})


def obter_potencia(dados):
    """Potência de carga (kW) ao longo do dia - só existe no relatório
    Operacional. Não confundir com a potência nominal do carregador: isso
    aqui é o quanto está sendo consumido em cada horário."""
    indicador = dados.get("indicadores", {}).get("potencia_carga")
    if not indicador:
        return {}
    return indicador.get("por_horario", {})


def obter_status(dados):
    """Heurística simples: se em algum horário do relatório Operacional a
    potência de carga foi maior que zero, a estação esteve 'em_uso' naquele
    dia. Sem o relatório Operacional, cai pra 'disponivel' por padrão -
    fica mais preciso quando os dois relatórios forem usados juntos."""
    potencias = obter_potencia(dados)
    if not potencias:
        return "disponivel"
    if any((v or 0) > 0 for v in potencias.values()):
        return "em_uso"
    return "disponivel"


def gerar_leituras_diarias(dados):
    """Transforma o relatório Estatístico numa lista de leituras diárias,
    prontas pra virar registros no banco (ex: histórico de consumo). Cada
    item representa 1 estação em 1 dia - não é uma Sessão de recarga, é a
    matéria-prima que o módulo de Sessões/Consumo usa para reconciliar."""
    if dados.get("tipo") != "estatistico":
        raise ValueError("gerar_leituras_diarias só funciona com o Relatório Estatístico.")

    indicadores = dados.get("indicadores", {})
    datas = dados.get("periodo", {}).get("datas", [])

    leituras = []
    for data in datas:
        leitura = {"data": data}
        for chave, indicador in indicadores.items():
            leitura[chave] = indicador.get("por_dia", {}).get(data)
        leituras.append(leitura)
    return leituras


def _data_referencia(dados):
    if dados.get("tipo") == "estatistico":
        datas = dados.get("periodo", {}).get("datas", [])
        return datas[-1] if datas else None
    return dados.get("estacao", {}).get("data_criacao")
