"""
Script simples pra rodar a integração contra os relatórios reais do SEMS+ e
conferir se os valores batem com os que aparecem na tela do SEMS+.

Como rodar (a partir da raiz do projeto):
    python tests/testar_integracao_goodwe.py

Não é um teste automatizado com pytest de propósito - é o mesmo tipo de
verificação manual que o item "Testes" da entrega pede: "testar com um CSV
real e conferir se os valores importados correspondem aos apresentados pelo
SEMS+".
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services import goodwe_service  # noqa: E402

PASTA_EXEMPLOS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dados", "sems_exemplo")
CSV_ESTATISTICO = os.path.join(PASTA_EXEMPLOS, "relatorio_estatistico_exemplo.csv")
CSV_OPERACIONAL = os.path.join(PASTA_EXEMPLOS, "relatorio_operacional_exemplo.csv")


def testar_relatorio_estatistico():
    print("=" * 60)
    print("RELATÓRIO ESTATÍSTICO")
    print("=" * 60)

    dados = goodwe_service.carregar_relatorio_sems(CSV_ESTATISTICO)

    carregador = goodwe_service.obter_dados_carregador(dados)
    print("Carregador:", carregador)

    total = goodwe_service.obter_energia_carregada(dados)
    print(f"Energia Carregada (total do período): {total} kWh  (esperado: 29.8 kWh)")
    assert total == 29.8, "Energia Carregada total não bate com o SEMS+"

    por_dia = goodwe_service.obter_energia_carregada_por_dia(dados)
    print(f"Energia Carregada em 01/09/2026: {por_dia.get('01/09/2026')} kWh  (esperado: 0.5 kWh)")
    assert por_dia.get("01/09/2026") == 0.5, "Energia Carregada do dia 01/09 não bate com o SEMS+"

    leituras = goodwe_service.gerar_leituras_diarias(dados)
    print(f"Total de leituras diárias geradas: {len(leituras)}")
    print("Exemplo de leitura (dia 1):", leituras[0])

    print("OK - Relatório Estatístico validado.\n")


def testar_relatorio_operacional():
    print("=" * 60)
    print("RELATÓRIO OPERACIONAL")
    print("=" * 60)

    dados = goodwe_service.carregar_relatorio_sems(CSV_OPERACIONAL)

    carregador = goodwe_service.obter_dados_carregador(dados)
    print("Carregador:", carregador)

    status = goodwe_service.obter_status(dados)
    print("Status inferido a partir da potência de carga:", status)

    print("OK - Relatório Operacional validado.\n")


if __name__ == "__main__":
    testar_relatorio_estatistico()
    testar_relatorio_operacional()
    print("Todos os testes passaram.")
