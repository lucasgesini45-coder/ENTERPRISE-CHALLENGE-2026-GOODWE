# Integração GoodWe SEMS+ (Calebe)

## Onde isso se encaixa
`services/goodwe_service.py` estava vazio no repositório. Este documento e os
arquivos abaixo implementam a minha parte definida em
"Organização do Projeto e Branches": **entrar no SEMS+, listar os dados
disponíveis e iniciar o `goodwe_service.py`**, já seguindo a atualização de
arquitetura que trocou a integração via API pela exportação em CSV.

Como o time não tem acesso à API oficial da GoodWe (Open API / SEMS Portal
API) necessária pra integração direta, o MVP usa a exportação CSV do SEMS+
como fonte de dados operacionais - a estrutura já deixa isso pronto pra
trocar por chamada de API no futuro, sem afetar o resto do sistema.

## Arquivos entregues
```
services/
  csv_service.py      -> lê e valida o CSV exportado do SEMS+ (sem dependências novas)
  goodwe_service.py    -> transforma os dados do SEMS+ nos dados que o EV ChargeOps usa
dados/sems_exemplo/
  relatorio_estatistico_exemplo.csv
  relatorio_operacional_exemplo.csv
tests/
  testar_integracao_goodwe.py   -> roda a integração contra os CSVs reais e confere os valores
```

Os dois CSVs de exemplo são os relatórios reais baixados do SEMS+ (estação
"LAB FIAP Eco Smart Home"), usados para testar a integração de ponta a
ponta antes de entregar.

## Relatório Estatístico x Relatório Operacional
- **Estatístico**: 1 valor total + 1 valor por dia, por indicador, no
  período escolhido. É a fonte principal pro projeto porque traz
  **Energia Carregada** - o indicador que corresponde à recarga do veículo
  e alimenta `consumo_kwh` da Sessão e, depois, o valor cobrado.
- **Operacional**: 1 valor por horário (ou por intervalo de 5 min,
  dependendo do filtro), de um único dia. Serve mais pra monitoramento e
  comportamento da infraestrutura ao longo do dia do que pra cobrança.


## Limitação importante: o CSV não identifica o morador
O relatório do SEMS+ traz o consumo **agregado da estação** (por dia ou por
horário), não por sessão de recarga individual. Ele não diz "morador X
carregou Y kWh". Por isso `goodwe_service.py` entrega a **medição real da
GoodWe** (`obter_energia_carregada`, `gerar_leituras_diarias`), e a
associação `usuário -> sessão -> consumo` continua sendo responsabilidade do
módulo de Sessões - a reconciliação entre o que o CSV mostra e o
que o EV ChargeOps registrou como sessão precisa ser feita em conjunto.

## Testando
```bash
python tests/testar_integracao_goodwe.py
```
O script lê os dois CSVs de exemplo e confere se os valores batem com os
apresentados na tela do SEMS+ (ex.: Energia Carregada total = 29,80 kWh,
01/09/2026 = 0,50 kWh).


