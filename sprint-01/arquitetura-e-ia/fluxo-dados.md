# Fluxo de Dados

O fluxo de dados da plataforma ocorre em seis etapas principais.

## 1. Coleta

O carregador registra:

* Tensão;
* Corrente;
* Potência;
* Energia consumida.

## 2. Transmissão

Os dados são enviados para a nuvem por meio da API GoodWe SEMS.

## 3. Persistência

As informações são armazenadas em banco de dados relacional.

## 4. Processamento

Os modelos de Inteligência Artificial analisam os dados armazenados.

## 5. Visualização

Os resultados são apresentados em dashboards e relatórios.

## 6. Faturamento

O sistema calcula automaticamente os valores devidos pelos usuários.

---

# Inteligência Artificial

A Inteligência Artificial é responsável por transformar dados operacionais em informações úteis para tomada de decisão.

## IA 1 — Previsão de Consumo

### Objetivo

Prever o consumo energético futuro dos usuários.

### Técnica Utilizada

Modelos de Regressão:

* Regressão Linear;
* Random Forest Regressor;
* XGBoost.

### Dados Necessários

* Histórico de sessões;
* Horário de carregamento;
* Duração da sessão;
* Energia consumida;
* Tipo de veículo;
* Temperatura ambiente;
* Tarifas energéticas;
* Dia da semana;
* Mês;
* Feriados.

### Benefícios

* Planejamento de gastos;
* Previsão de demanda;
* Otimização da rede elétrica;
* Redução de desperdícios energéticos.

### Métricas de Avaliação

* MAPE (Mean Absolute Percentage Error);
* RMSE (Root Mean Squared Error);
* R² (Coeficiente de Determinação).

## Fluxograma de Dados

Representação do caminho percorrido pelos dados:

```text
Carregador
    ↓
API GoodWe SEMS
    ↓
Banco de Dados
    ↓
Modelos de IA
    ↓
Dashboard
    ↓
Fatura
```

---

## Documento de IA

O documento deve conter:

### Previsão de Consumo

* Algoritmo utilizado;
* Variáveis de entrada;
* Variáveis de saída;
* Métricas de avaliação.

### Detecção de Anomalias

* Técnica escolhida;
* Estratégia de detecção;
* Critérios de alerta;
* Taxa esperada de falsos positivos.

### Pipeline de Dados

* Coleta;
* Pré-processamento;
* Treinamento;
* Inferência;
* Atualização dos modelos.
