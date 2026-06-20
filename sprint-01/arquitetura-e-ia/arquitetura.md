# Arquitetura da Plataforma EV ChargeOps

## Introdução

A plataforma EV ChargeOps foi projetada utilizando uma arquitetura em camadas, permitindo escalabilidade, modularidade e integração com diferentes fabricantes de carregadores e sistemas de gestão energética.

O modelo arquitetural é dividido em quatro camadas principais:

1. Camada Física
2. Camada de Conectividade
3. Camada de Aplicação
4. Camada de Apresentação

---

## Camada Física

A camada física é responsável pela coleta dos dados gerados durante as sessões de carregamento.

### Componentes

- Carregador GoodWe HCA G2
- Medidores de energia
- Veículos elétricos
- Cartões RFID

### Funções

- Fornecimento de energia ao veículo
- Identificação dos usuários
- Registro de potência e consumo
- Comunicação com sistemas externos

---

## Camada de Conectividade

Responsável pela transmissão dos dados entre os equipamentos físicos e a plataforma.

### Tecnologias Utilizadas

- RS-485
- Modbus RTU
- Ethernet (LAN)
- Wi-Fi
- Bluetooth
- API GoodWe SEMS

### Objetivos

- Garantir comunicação segura
- Transmitir dados em tempo real
- Integrar dispositivos e sistemas

---

## Camada de Aplicação

Representa o núcleo operacional do EV ChargeOps.

### Componentes

#### Backend

Responsável pelo processamento das regras de negócio.

#### Banco de Dados

Armazena:

- Usuários
- Veículos
- Sessões
- Faturas

#### Motor de Rateio

Calcula os custos individuais de cada usuário.

#### Módulos de IA

Executam análises preditivas e monitoramento inteligente.

---

## Camada de Apresentação

Camada responsável pela interação com os usuários.

### Dashboard do Usuário

Permite:

- Visualizar consumo
- Consultar histórico
- Acompanhar faturas

### Dashboard do Gestor

Permite:

- Monitorar carregadores
- Gerenciar usuários
- Emitir relatórios

---

## Benefícios da Arquitetura

- Escalabilidade
- Modularidade
- Interoperabilidade
- Conformidade regulatória
- Facilidade de manutenção
