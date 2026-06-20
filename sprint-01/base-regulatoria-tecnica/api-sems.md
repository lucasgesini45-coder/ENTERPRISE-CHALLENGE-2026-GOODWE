# API GoodWe SEMS

## Visão Geral

## Processo de Autenticação

### Login

Endpoint:
POST /CrossLogin

## Endpoints Principais

### GetMonitorDetailByPowerstationId

### EvChargerDetail

### List

## Dados Disponíveis

| Campo | Descrição |
|---------|------------|
| evChargerStatus | Status |
| power | Potência |
| eChargeToday | Energia diária |
| eChargeTotal | Energia acumulada |
| chargeDuration | Duração |

## Fluxo de Integração com o EV ChargeOps

1. Login
2. Armazenamento do token
3. Consulta periódica
4. Registro das sessões
5. Geração de faturamento
