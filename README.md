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

**Integrantes do Projeto**

* Lucas Ribeiro Gesini RM569383
* Caleb Gonçalves Garcia de Souza RM568743
* Filipe Souza Nascimento RM573758
* Raphael De Freitas Silva RM570089
* Paulo Henrique Gonçalves Bueno RM570456
---

## Parceria

Projeto desenvolvido no contexto do **Enterprise Challenge 2026** em parceria com a **GoodWe**, empresa global referência em soluções de energia renovável, inversores fotovoltaicos e sistemas de armazenamento de energia.

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais no âmbito do Enterprise Challenge 2026.

## Sumário

1. Introdução
2. Infraestruturas de Recarga Compartilhada
3. Desafios da Recarga Compartilhada
   - Condomínios
   - Empresas
   - Universidades
4. Modelos de Negócio
5. Funcionamento da Sessão de Recarga
6. Dados Gerados Durante a Recarga
7. Aplicação no Sistema Desenvolvido
8. Conclusão

---

# Infraestruturas de Recarga Compartilhada

Infraestruturas de recarga compartilhada são sistemas de carregamento de veículos elétricos que podem ser utilizados por múltiplos usuários ou organizações, em vez de pertencerem a um único proprietário.

Seu objetivo é otimizar o uso dos carregadores e permitir o acesso a um maior número de pessoas.

---

# Desafios da Recarga Compartilhada

## Condomínios

### Capacidade da Rede Elétrica

Muitos condomínios foram construídos antes da popularização dos veículos elétricos e não possuem infraestrutura preparada para atender uma alta demanda energética.

Os principais problemas incluem:

- Sobrecarga da rede elétrica;
- Quedas de energia;
- Acionamento frequente de disjuntores;
- Necessidade de ampliação da infraestrutura elétrica.

### Divisão dos Custos

É necessário definir:

- Quem será responsável pela instalação;
- Como será feita a cobrança do consumo;
- Como serão divididos os custos de manutenção.

### Gestão das Vagas

Pode haver conflitos quando diversos moradores precisam utilizar os carregadores simultaneamente.

### Aprovação em Assembleia

Alterações estruturais geralmente exigem aprovação dos condôminos.

### Segurança

A instalação deve seguir normas técnicas para evitar:

- Sobrecargas;
- Curtos-circuitos;
- Acidentes elétricos.

---

## Empresas

### Investimento Inicial

A implementação de pontos de recarga exige investimentos em:

- Equipamentos;
- Infraestrutura elétrica;
- Sistemas de monitoramento.

### Controle de Acesso

É necessário definir quais usuários poderão utilizar os carregadores:

- Funcionários;
- Clientes;
- Visitantes;
- Veículos corporativos.

### Gerenciamento da Demanda Energética

O carregamento simultâneo de vários veículos pode aumentar significativamente o consumo de energia.

### Monitoramento e Manutenção

Garantir a disponibilidade dos carregadores requer:

- Monitoramento contínuo;
- Manutenção preventiva;
- Identificação rápida de falhas.

### Políticas de Uso

Algumas medidas comuns incluem:

- Limites de tempo;
- Sistemas de reserva;
- Prioridades de utilização;
- Cobrança por permanência.

---

## Universidades

### Grande Fluxo de Usuários

As universidades recebem diariamente:

- Alunos;
- Professores;
- Funcionários;
- Visitantes.

Isso pode gerar alta demanda pelos pontos de recarga.

### Tempo Prolongado de Ocupação

Os veículos costumam permanecer conectados por várias horas, reduzindo a rotatividade das vagas.

### Expansão da Infraestrutura

O crescimento da frota elétrica exige ampliação contínua da capacidade instalada.

### Custos Operacionais

Os custos envolvem:

- Energia elétrica;
- Manutenção;
- Suporte técnico.

### Integração Tecnológica

Aplicativos e sistemas de monitoramento ajudam a:

- Controlar o uso;
- Verificar disponibilidade;
- Gerar relatórios;
- Melhorar a experiência do usuário.

---

# Modelos de Negócio para Recarga Compartilhada

## Recarga Gratuita

O usuário não paga pela energia consumida.

Utilizada principalmente por:

- Empresas;
- Universidades;
- Centros comerciais.

---

## Cobrança por kWh

O usuário paga pela quantidade de energia efetivamente consumida.

### Vantagem

- Cobrança proporcional ao consumo real.

---

## Cobrança por Tempo

A cobrança é baseada no tempo de permanência do veículo conectado ao carregador.

### Objetivo

- Incentivar a rotatividade das vagas.

---

## Assinatura Mensal

Os usuários pagam uma mensalidade fixa para utilizar a infraestrutura.

Dependendo do plano contratado, o uso pode ser limitado ou ilimitado.

---

## Rateio Condominial

Os custos de instalação, manutenção e consumo são distribuídos entre os moradores.

O rateio pode ser:

- Igualitário;
- Proporcional ao consumo individual.

---

# Funcionamento de uma Sessão de Recarga

## Fluxo da Sessão

```mermaid
flowchart LR
A[Conexão do Veículo] --> B[Autenticação]
B --> C[Início da Carga]
C --> D[Monitoramento]
D --> E[Encerramento]
```

## 1. Conexão do Veículo

O veículo é conectado ao carregador utilizando um cabo compatível.

---

## 2. Autenticação

O usuário é identificado através de:

- Aplicativo;
- Cartão RFID;
- QR Code;
- Credenciais de acesso.

---

## 3. Início da Carga

Após a autenticação, o sistema libera o fornecimento de energia.

---

## 4. Monitoramento

Durante a sessão são registrados diversos dados operacionais.

---

## 5. Encerramento

A sessão é encerrada quando:

- A bateria atinge a carga desejada;
- O usuário interrompe a recarga;
- O veículo é desconectado.

---

# Dados Gerados Durante a Sessão de Recarga

| Dado | Finalidade |
|--------|------------|
| Usuário | Identificar quem utilizou o carregador |
| Horário de início | Registrar o começo da sessão |
| Horário de fim | Registrar o encerramento |
| Duração | Calcular o tempo de utilização |
| Energia (kWh) | Medir o consumo de energia |
| Potência (kW) | Avaliar o desempenho da recarga |

---

# Aplicação no Sistema Desenvolvido

O sistema implementado utiliza os conceitos estudados para realizar o gerenciamento das sessões de recarga.

### Funcionalidades

- Sistema de login de usuários;
- Cadastro e gerenciamento de sessões;
- Registro de consumo energético;
- Controle das informações da recarga;
- Visualização dos dados registrados.

### Estruturas de Dados Utilizadas

#### Fila (FIFO)

A fila segue o princípio **First In, First Out**, onde o primeiro elemento inserido é o primeiro a ser removido.

Aplicação:

- Organização da ordem de atendimento dos veículos.

#### Pilha (LIFO)

A pilha segue o princípio **Last In, First Out**, onde o último elemento inserido é o primeiro a ser removido.

Aplicação:

- Controle de operações recentes realizadas no sistema.

---
## Parte 2


(Falntando)
---
# Conclusão

A infraestrutura de recarga compartilhada é um elemento fundamental para o crescimento da mobilidade elétrica.

Os desafios relacionados à capacidade energética, gestão de usuários, controle de acesso e monitoramento do consumo demonstram a necessidade de soluções tecnológicas eficientes.

Com base nesses conceitos, foi desenvolvido um sistema capaz de organizar e registrar informações das sessões de recarga, utilizando estruturas de dados e mecanismos de autenticação para garantir um gerenciamento eficiente da infraestrutura compartilhada.
