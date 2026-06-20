# Fluxo de Dados da Plataforma EV ChargeOps

## Visão Geral

O fluxo de dados descreve o caminho percorrido pelas informações desde a coleta realizada pelo carregador até a geração da fatura para o usuário.

```text
Veículo
   ↓
Carregador GoodWe
   ↓
API SEMS
   ↓
Banco de Dados
   ↓
Motor de IA
   ↓
Dashboard
   ↓
Faturamento
```

---

## Etapa 1 – Coleta

Durante a sessão de carregamento, o carregador registra:

- Potência instantânea
- Energia consumida
- Duração da sessão
- Status operacional

---

## Etapa 2 – Transmissão

Os dados são enviados para a nuvem através da API GoodWe SEMS.

### Tecnologias

- LAN
- Wi-Fi
- API REST

---

## Etapa 3 – Persistência

Os dados são armazenados em banco de dados relacional.

### Informações Registradas

- Usuário
- Veículo
- Sessão
- Consumo
- Carregador

---

## Etapa 4 – Processamento por IA

Os dados armazenados alimentam os modelos de Inteligência Artificial.

### Objetivos

- Previsão de consumo
- Detecção de anomalias
- Análise comportamental

---

## Etapa 5 – Visualização

As informações processadas são disponibilizadas em dashboards.

### Usuário

- Consumo individual
- Histórico de sessões
- Custos

### Gestor

- Indicadores operacionais
- Utilização dos carregadores
- Alertas

---

## Etapa 6 – Faturamento

Ao final do ciclo mensal:

1. O sistema consolida todas as sessões.
2. Calcula o consumo total.
3. Aplica a tarifa vigente.
4. Gera a fatura individual.

---

## Resultado Esperado

O fluxo de dados garante rastreabilidade completa desde a sessão de carregamento até a cobrança final do usuário.
