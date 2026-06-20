# API GoodWe SEMS

## Visão Geral

O GoodWe HCA G2 é um carregador AC para veículos elétricos disponível em versões de 7 kW, 11 kW e 22 kW.

O equipamento pode ser integrado ao portal SEMS (Smart Energy Management System), plataforma em nuvem da GoodWe responsável pelo monitoramento e gerenciamento de inversores, baterias e carregadores elétricos.

A integração do EV ChargeOps será realizada através da API REST disponibilizada pelo portal SEMS.

---

## Interfaces de Comunicação do HCA G2

| Interface | Tipo | Função |
|------------|--------|---------|
| RS-485 | Serial / Modbus RTU | Comunicação com inversores e medidores |
| LAN (RJ-45) | Ethernet TCP/IP | Integração com o portal SEMS |
| Wi-Fi | IEEE 802.11 | Conexão sem fio |
| Bluetooth | BLE | Configuração inicial |
| RFID | ISO 14443 | Identificação dos usuários |

---

# Processo de Autenticação

A API utiliza autenticação baseada em token.

O processo ocorre em duas etapas:

1. Login
2. Utilização do token em todas as requisições subsequentes

---

## Endpoint de Login

### CrossLogin

```http
POST /api/v1/Common/CrossLogin
```

### Headers

```json
{
  "Content-Type": "application/json"
}
```

### Body

```json
{
  "account": "email@dominio.com",
  "pwd": "senha"
}
```

### Dados Retornados

| Campo | Descrição |
|---------|------------|
| uid | Identificador do usuário |
| timestamp | Momento do login |
| token | Token de autenticação |
| api | URL base da API |

---

## Header de Autenticação

Após o login:

```json
{
  "version": "v2.1.0",
  "client": "ios",
  "language": "pt",
  "timestamp": "...",
  "uid": "...",
  "token": "..."
}
```

---

# Endpoints Principais

## Listagem de Estações

```http
POST /v1/PowerStation/List
```

Retorna todas as estações vinculadas à conta.

---

## Dados da Estação

```http
POST /v1/PowerStation/GetMonitorDetailByPowerstationId
```

Retorna dados gerais da estação.

---

## Dados do Carregador

```http
GET /powerstation/EvChargerDetail
```

Endpoint principal utilizado pelo EV ChargeOps.

Retorna:

- Status do carregador;
- Potência instantânea;
- Energia consumida;
- Tempo de carregamento.

---

# Campos Disponíveis

| Campo | Tipo | Descrição |
|---------|---------|-------------|
| evChargerStatus | int | Status do carregador |
| power | decimal | Potência instantânea (kW) |
| eChargeToday | decimal | Energia consumida no dia |
| eChargeTotal | decimal | Energia acumulada |
| chargeDuration | int | Duração da sessão |
| sn | string | Número de série |
| model | string | Modelo do equipamento |

---

## Status do Carregador

| Código | Situação |
|----------|-----------|
| 0 | Offline |
| 1 | Disponível |
| 2 | Carregando |
| 3 | Erro |

---

# Fluxo de Integração com o EV ChargeOps

## Etapa 1 — Autenticação

Realizar login e armazenar:

- Token;
- UID;
- URL da API.

## Etapa 2 — Monitoramento

Consultar o endpoint `EvChargerDetail` periodicamente.

Sugestão:

- Atualização a cada 60 segundos.

## Etapa 3 — Início da Sessão

Quando:

```text
evChargerStatus
1 → 2
```

Registrar:

- Usuário;
- Data;
- Hora de início.

## Etapa 4 — Acompanhamento

Monitorar:

- Potência;
- Energia acumulada;
- Tempo de sessão.

## Etapa 5 — Encerramento

Quando:

```text
evChargerStatus
2 → 1
```

Registrar:

- Energia total consumida;
- Horário final;
- Duração.

---

# Mapeamento para o Banco de Dados

| Campo API | Campo Banco |
|------------|------------|
| evChargerStatus | status |
| eChargeToday | energia_kwh |
| chargeDuration | duração |
| sn | carregador_id |

---

# Pontos de Atenção

## Expiração do Token

A API pode retornar:

```text
The authorization has expired, please log in again.
```

O sistema deverá realizar reautenticação automática.

---

## URL Dinâmica

A URL retornada no login pode variar conforme a região.

Sempre utilizar a URL retornada pelo endpoint de autenticação.

---

## Polling

Evitar intervalos inferiores a 30 segundos.

Recomendação:

- Atualização a cada 60 segundos.

---

## Fallback

Caso a API fique indisponível:

- Manter o último estado conhecido;
- Registrar o incidente;
- Retomar a sincronização automaticamente.

---

## Conclusão

A API GoodWe SEMS fornece todas as informações necessárias para monitorar sessões de carregamento, registrar consumo energético e alimentar o sistema de faturamento do EV ChargeOps.

Sua integração permitirá a construção de uma plataforma capaz de controlar usuários, registrar sessões, calcular cobranças e gerar inteligência operacional baseada em dados reais de utilização.
