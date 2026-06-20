# Arquitetura da Plataforma e Inteligência Artificial

## Introdução

O EV ChargeOps é uma plataforma inteligente para monitoramento e gestão de carregadores de veículos elétricos. A solução integra dispositivos físicos, conectividade, processamento de dados e Inteligência Artificial para transformar informações operacionais em conhecimento útil para usuários e gestores.

A arquitetura foi estruturada em quatro camadas principais:

* Camada Física;
* Camada de Conectividade;
* Camada de Aplicação;
* Camada de Apresentação.

A plataforma também incorpora modelos de Inteligência Artificial voltados para:

* Previsão de consumo energético;
* Detecção de anomalias;
* Análise comportamental de usuários.

---

# Arquitetura da Plataforma

A arquitetura segue o modelo de camadas amplamente utilizado em soluções de Internet das Coisas (IoT), permitindo modularidade, escalabilidade e facilidade de manutenção.

## Camada Física (Carregador)

A camada física corresponde aos dispositivos responsáveis pela coleta de dados e interação direta com os veículos elétricos.

### Responsabilidades

* Leitura de tensão, corrente e potência em tempo real;
* Registro das sessões de carregamento;
* Identificação de usuários;
* Comunicação com os sistemas superiores.

### Dados Coletados

* Tensão (V);
* Corrente (A);
* Potência (kW);
* Energia consumida (kWh);
* Data e hora da sessão;
* Identificação do usuário.

### Tecnologias Utilizadas

* RFID;
* Wi-Fi;
* RS-485;
* MQTT.

---

## Camada de Conectividade

Responsável pela transmissão segura e confiável dos dados coletados.

### Principais Funções

* Envio de dados para a nuvem;
* Comunicação entre dispositivos e plataforma;
* Autenticação e segurança;
* Integração com APIs externas.

### Tecnologias

* MQTT;
* HTTPS;
* Wi-Fi;
* Redes 4G/5G;
* API GoodWe SEMS.

---

## Camada de Aplicação

Representa o núcleo da plataforma.

### Responsabilidades

* Processamento dos dados;
* Armazenamento de informações;
* Execução dos modelos de IA;
* Geração de relatórios;
* Cálculo de faturas.

### Componentes

#### Banco de Dados

Armazenamento de:

* Usuários;
* Veículos;
* Sessões de recarga;
* Histórico de consumo;
* Faturas.

#### APIs REST

Disponibilizam os dados para dashboards e aplicações externas.

#### Motor de Inteligência Artificial

Executa os algoritmos responsáveis pelas análises preditivas e detecção de anomalias.

---

## Camada de Apresentação

Interface utilizada pelos usuários e administradores.

### Funcionalidades

* Dashboard em tempo real;
* Relatórios de consumo;
* Alertas operacionais;
* Consulta de faturas;
* Visualização de previsões de consumo.

### Plataformas

* Aplicação Web;
* Aplicação Mobile.

---

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
