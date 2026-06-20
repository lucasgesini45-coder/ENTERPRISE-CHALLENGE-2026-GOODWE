# EV ChargeOps

Projeto desenvolvido para o **Enterprise Challenge 2026**, em parceria com a **GoodWe**, com foco na gestão inteligente de infraestruturas compartilhadas de recarga para veículos elétricos.

---

## Objetivo

Desenvolver uma plataforma inteligente capaz de gerenciar carregadores compartilhados de veículos elétricos, oferecendo:

* Controle de usuários;
* Monitoramento de sessões de recarga;
* Rateio individualizado de consumo energético;
* Geração automática de faturas;
* Relatórios gerenciais;
* Aplicação de Inteligência Artificial para análise e previsão de uso.

---

## Problema

Infraestruturas de recarga compartilhada, como as encontradas em condomínios residenciais, edifícios corporativos e instituições de ensino, enfrentam diversos desafios operacionais, entre eles:

* Controle de acesso aos carregadores;
* Identificação dos usuários responsáveis pelo consumo;
* Divisão justa dos custos de energia;
* Monitoramento das sessões de recarga;
* Gestão eficiente da infraestrutura;
* Falta de indicadores para tomada de decisão.

---

## Solução Proposta

O **EV ChargeOps** transforma os dados gerados pelas sessões de recarga em informações estruturadas e acionáveis, permitindo:

* Identificação de usuários;
* Controle e monitoramento de sessões de recarga;
* Rateio individualizado do consumo energético;
* Geração de relatórios operacionais;
* Emissão automática de faturas;
* Aplicação de Inteligência Artificial para:

  * Previsão de consumo;
  * Identificação de padrões de uso;
  * Detecção de anomalias;
  * Apoio à tomada de decisão.

---

## Estrutura do Projeto

### Sprint 01 — Pesquisa e Documentação

* Contexto e Problema;
* Base Regulatória e Técnica;
* Arquitetura da Plataforma;
* Modelo de Rateio;
* Aplicações de Inteligência Artificial.

### Sprint 02 — Desenvolvimento e Protótipo

* Backend;
* Frontend;
* Banco de Dados;
* Integração com GoodWe SEMS API;
* Módulos de Inteligência Artificial;
* Dashboard Gerencial.

---

## Tecnologias Previstas

### Frontend

* React

### Backend

* Node.js
* Python

### Banco de Dados

* PostgreSQL

### Integrações

* GoodWe SEMS API

### Inteligência Artificial

* Machine Learning
* Análise Preditiva
* Detecção de Anomalias

---

## Principais Funcionalidades

* Cadastro e gerenciamento de usuários;
* Registro automático de sessões de recarga;
* Cálculo automático de consumo por usuário;
* Rateio inteligente de custos;
* Geração de faturas e relatórios;
* Monitoramento em tempo real dos carregadores;
* Dashboards de gestão;
* Análise preditiva baseada em IA.

---

## Arquitetura Geral

```text
Carregador GoodWe HCA G2
           │
           ▼
      GoodWe SEMS API
           │
           ▼
       EV ChargeOps
    ┌───────────────┐
    │    Backend    │
    ├───────────────┤
    │ Banco de Dados│
    ├───────────────┤
    │ Inteligência  │
    │ Artificial    │
    └───────────────┘
           │
           ▼
 Dashboard e Portal Web
```

---
## Equipe

| Nome | RM |
|------|------|
| Lucas Ribeiro Gesini | RM569383 |
| Calebe Gonçalves Garcia de Souza | RM568743 |
| Filipe Souza Nascimento | RM573758 |
| Rafael De Freitas Silva | RM570089 |
| Paulo Henrique Gonçalves Bueno | RM570456 |
---
