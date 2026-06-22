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
# Infraestruturas de Recarga Compartilhada

## Introdução

O crescimento da adoção de veículos elétricos tem impulsionado a necessidade de novas soluções de recarga em ambientes compartilhados. Condomínios, empresas e universidades enfrentam desafios relacionados à disponibilidade de energia, controle de acesso e gestão dos carregadores.

Nesse contexto, torna-se fundamental compreender o funcionamento das infraestruturas de recarga compartilhada, os modelos de negócio existentes e os dados gerados durante as sessões de carregamento.

---

## O que são Infraestruturas de Recarga Compartilhada?

Infraestruturas de recarga compartilhada são sistemas de carregamento de veículos elétricos que podem ser utilizados por múltiplos usuários ou organizações, em vez de pertencerem exclusivamente a um único proprietário.

Esse modelo é amplamente adotado em:

* Condomínios residenciais;
* Edifícios corporativos;
* Universidades;
* Estacionamentos;
* Centros comerciais.

---

# Principais Desafios

## Condomínios

### Capacidade da Rede Elétrica

Grande parte dos condomínios foi construída antes da popularização dos veículos elétricos. Dessa forma, a instalação de diversos carregadores pode causar:

* Sobrecarga da rede elétrica;
* Quedas de energia;
* Acionamento frequente de disjuntores;
* Riscos à segurança elétrica.

Além disso, muitas vezes é necessário investir em:

* Transformadores;
* Quadros de distribuição;
* Cabos de maior capacidade;
* Sistemas de proteção elétrica.

### Divisão dos Custos

É necessário definir:

* Quem será responsável pelo investimento inicial;
* Como cobrar o consumo individual de energia;
* Como dividir os custos de manutenção.

### Gestão das Vagas

A utilização simultânea dos carregadores pode gerar conflitos entre moradores que desejam utilizar a infraestrutura nos mesmos horários.

### Aprovação em Assembleia

Alterações na infraestrutura do condomínio geralmente exigem aprovação formal dos condôminos.

### Segurança

A instalação deve seguir normas técnicas para evitar:

* Sobrecargas;
* Curtos-circuitos;
* Danos aos equipamentos;
* Acidentes elétricos.

---

## Empresas

### Investimento Inicial

A implantação de carregadores exige investimentos em:

* Equipamentos;
* Infraestrutura elétrica;
* Sistemas de monitoramento;
* Adequações técnicas.

### Controle de Acesso

É necessário definir quais usuários poderão utilizar os carregadores:

* Funcionários;
* Clientes;
* Visitantes;
* Frota corporativa.

Os métodos mais comuns de autenticação incluem:

* Aplicativos móveis;
* Cartões RFID;
* QR Codes.

### Gerenciamento da Demanda Energética

O carregamento simultâneo de diversos veículos pode aumentar significativamente o consumo energético da empresa, especialmente nos horários de pico.

### Monitoramento e Manutenção

A operação eficiente da infraestrutura depende de:

* Monitoramento remoto;
* Identificação rápida de falhas;
* Manutenção preventiva;
* Alta disponibilidade dos equipamentos.

### Políticas de Uso

As empresas podem implementar:

* Limites de tempo de utilização;
* Sistemas de reserva;
* Cobrança por permanência;
* Critérios de prioridade.

---

## Universidades

### Grande Fluxo de Usuários

Universidades recebem diariamente:

* Alunos;
* Professores;
* Funcionários;
* Visitantes.

Esse fluxo pode gerar elevada demanda pelos carregadores.

### Tempo Prolongado de Ocupação

Os veículos permanecem estacionados por várias horas, reduzindo a rotatividade das vagas de recarga.

### Expansão da Infraestrutura

O crescimento da frota elétrica exige a ampliação gradual da infraestrutura de carregamento.

### Custos Operacionais

A operação dos carregadores gera despesas relacionadas a:

* Energia elétrica;
* Manutenção;
* Suporte técnico.

### Integração Tecnológica

A integração com aplicativos e sistemas de monitoramento permite:

* Verificar disponibilidade;
* Controlar utilização;
* Melhorar a experiência dos usuários.

---
# Modelos de Negócio para Recarga Compartilhada

## Recarga Gratuita

O usuário não paga pela energia consumida.

A instituição responsável absorve os custos da instalação e operação.

Comum em:

* Universidades;
* Empresas;
* Centros comerciais.

---

## Cobrança por kWh

O usuário paga pela quantidade de energia efetivamente consumida.

### Vantagens

* Modelo mais justo;
* Cobrança proporcional ao consumo real.

---

## Cobrança por Tempo

O valor é calculado com base no tempo em que o veículo permanece conectado ao carregador.

### Objetivo

* Aumentar a rotatividade das vagas;
* Evitar ocupação desnecessária.

---

## Assinatura Mensal

Os usuários pagam uma mensalidade fixa para utilizar a infraestrutura.

Dependendo do plano contratado, podem existir:

* Limites de utilização;
* Uso ilimitado;
* Benefícios adicionais.

---

## Rateio Condominial

Modelo amplamente utilizado em condomínios residenciais.

Os custos são distribuídos entre os moradores considerando:

* Consumo individual;
* Custos de manutenção;
* Custos de instalação.

---
# Funcionamento de uma Sessão de Recarga

## 1. Conexão do Veículo

O usuário conecta o veículo ao carregador utilizando um cabo compatível.

O sistema verifica:

* Integridade da conexão;
* Compatibilidade do equipamento;
* Condições de segurança.

---

## 2. Autenticação

O usuário é identificado por meio de:

* Aplicativos;
* Cartões RFID;
* QR Codes;
* Credenciais de acesso.

---

## 3. Início da Recarga

Após a autenticação, o carregador inicia o fornecimento de energia para a bateria do veículo.

---

## 4. Monitoramento

Durante a sessão são monitorados:

* Energia consumida (kWh);
* Potência utilizada (kW);
* Tempo de carregamento;
* Status da sessão.

---

## 5. Encerramento

A sessão é encerrada quando:

* A bateria atinge o nível desejado;
* O usuário interrompe a recarga;
* O veículo é desconectado.

---

# Dados Gerados Durante a Sessão de Recarga

Durante uma sessão, diversas informações são registradas para fins de monitoramento, controle e cobrança.

| Dado              | Finalidade                             |
| ----------------- | -------------------------------------- |
| Usuário           | Identificar quem utilizou o carregador |
| Horário de Início | Registrar o início da sessão           |
| Horário de Fim    | Registrar o encerramento da sessão     |
| Duração           | Calcular o tempo de utilização         |
| Energia (kWh)     | Medir o consumo energético             |
| Potência (kW)     | Avaliar o desempenho da recarga        |

---

# Conclusão

A infraestrutura de recarga compartilhada é um elemento fundamental para a expansão da mobilidade elétrica. Os desafios relacionados à gestão energética, divisão de custos e controle de usuários demonstram a necessidade de soluções inteligentes capazes de transformar dados operacionais em informações úteis para gestores e usuários.

Esses conceitos servirão de base para o desenvolvimento da plataforma EV ChargeOps nas próximas etapas do projeto.

---
## EV ChargeOps — Sprint 01

## Pessoa 2 — Análise de Mercado (Opção A)

**Projeto:** EV ChargeOps — Energy Innovation Lab, GoodWe x FIAP  
**Sprint 01 — Pesquisa e Documentação | Frente: Análise de Mercado**

---

# 1. Objetivo

Mapear pelo menos três soluções existentes no mercado de recarga de veículos elétricos (VEs) que resolvem problemas similares aos endereçados pelo EV ChargeOps — gestão de sessões de recarga, rateio de consumo e experiência digital para usuários e gestores de infraestrutura compartilhada — de modo a embasar as decisões técnicas e de produto da equipe na Sprint 02.

---

# 2. Metodologia

Foram pesquisadas três soluções consolidadas no mercado internacional de carregadores e plataformas de gestão de recarga (ChargePoint, Zaptec e Wallbox Pulsar Plus), com base em documentação oficial dos fabricantes, páginas de produto, estudos de caso e avaliações especializadas. Para cada solução foram documentados: problema resolvido, funcionalidades principais, modelo de negócio e limitações conhecidas.

---

# 3. Perfis das Soluções Analisadas

## 3.1. ChargePoint

**Origem / mercado principal:** Estados Unidos — maior rede de estações de recarga de VEs do mundo, com presença na América do Norte, Europa e Austrália.

### Problema que resolve

ChargePoint resolve o problema de fragmentação e falta de padronização no acesso à recarga pública e semipública, oferecendo uma rede unificada de estações de propriedade independente (operadas por terceiros, mas conectadas a uma plataforma comum), permitindo localizar, reservar e pagar sessões de recarga de forma simples para o motorista, e gerenciar operação, faturamento e acesso para empresas, frotas e condomínios.

### Funcionalidades principais

- Aplicativo móvel/web para localizar, reservar e pagar sessões de recarga em tempo real.
- Plataforma de gestão para empresas e operadores (ChargePoint as a Service), incluindo controle de acesso, faturamento e relatórios.
- Soluções voltadas a diferentes públicos: residencial, comercial, frotas corporativas.
- Rede de estações de propriedade de terceiros operando sob um padrão de software comum (modelo de marketplace/rede aberta).

### Modelo de negócio

Modelo de assinatura por hardware + serviço (ChargePoint as a Service — CPaaS): o cliente paga pela instalação do equipamento e por uma taxa recorrente de acesso à plataforma de gestão, suporte e atualizações de software. Receita adicional via comissão sobre transações de recarga na rede pública e contratos corporativos para frotas.

### Limitações conhecidas

- Forte dependência de assinatura contínua do software (modelo SaaS atrelado ao hardware) — interrupção do contrato pode limitar funcionalidades do equipamento.
- Voltado majoritariamente a redes públicas e semipúblicas de grande escala, com pouca ênfase em rateio fino de custos entre usuários de uma mesma instalação compartilhada (ex.: condomínios pequenos).
- Contratos como o CPaaS possuem cláusulas rígidas de recuperação de equipamento e responsabilidade do cliente em caso de rescisão.

---

## 3.2. Zaptec (Zaptec Pro / Zaptec Go)

**Origem / mercado principal:** Noruega — fabricante europeu focado em soluções de recarga residencial, comercial e para edifícios multifamiliares.

### Problema que resolve

Zaptec resolve o problema técnico de sobrecarga elétrica em instalações compartilhadas: quando vários veículos carregam simultaneamente em um prédio ou estacionamento, a capacidade elétrica disponível pode não suportar a demanda. A solução também endereça a necessidade de gestão centralizada de múltiplos pontos de carga sem grandes obras de reforço da infraestrutura elétrica.

### Funcionalidades principais

- Balanceamento dinâmico de carga e de fases (dynamic load & phase balancing), distribuindo a energia disponível entre todos os carregadores conectados em tempo real.
- Escalabilidade de 1 a mais de 1.000 pontos de carga gerenciados pelo mesmo sistema (Zaptec Portal).
- Aplicativo (Zaptec App) para monitorar sessões, histórico de carregamento, controle de acesso e bloqueio de cabo.
- Software aberto para integração de sistemas de pagamento por terceiros, permitindo cobrança e rateio conforme a necessidade do operador.
- Medidor certificado (MID) embutido em modelos Pro, viabilizando cobrança comercial compatível com regulação.

### Modelo de negócio

Venda de hardware (carregadores) através de uma rede de parceiros e instaladores certificados, sem cobrança recorrente obrigatória de software — o gerenciamento básico via Zaptec Portal é gratuito. Monetização adicional ocorre por meio da venda de dispositivos complementares (como o Zaptec Sense, para gestão de carga residencial) e parcerias com provedores de pagamento/back-office.

### Limitações conhecidas

- O rateio financeiro entre usuários não é nativo: depende da integração com sistemas de pagamento de terceiros via software aberto, exigindo configuração adicional pelo operador do condomínio ou empresa.
- Foco primário em eficiência elétrica (evitar sobrecarga), não em geração de inteligência analítica sobre padrões de uso.
- Funcionalidades avançadas (ex.: carregamento bidirecional) disponíveis apenas em modelos específicos (Zaptec Pro), aumentando o custo conforme o caso de uso.

---

## 3.3. Wallbox Pulsar Plus

**Origem / mercado principal:** Espanha — fabricante com forte atuação em recarga residencial e em edifícios multifamiliares de alta densidade.

### Problema que resolve

O Pulsar Plus resolve o problema de recarga doméstica e em prédios residenciais que necessitam de um equipamento compacto, fácil de instalar e capaz de ajustar a potência de saída conforme a infraestrutura elétrica disponível, além de oferecer controle remoto e rastreamento de uso para múltiplos usuários através do aplicativo myWallbox.

### Funcionalidades principais

- Conectividade Wi-Fi e Bluetooth, com controle e agendamento de sessões pelo aplicativo myWallbox.
- Potência ajustável (de 16A a 48A) para adequação à capacidade do circuito elétrico do local.
- Compartilhamento inteligente de energia (power sharing) entre múltiplos veículos em um mesmo circuito.
- Compatibilidade com balanceamento dinâmico de carga via módulo adicional (Power Boost), incluindo priorização de energia solar.
- Integração com assistentes de voz (Alexa, Google Home) e histórico de consumo/custos no aplicativo.

### Modelo de negócio

Venda direta de hardware (modelos plug-in e hardwired) através de distribuidores, instaladores certificados e e-commerce. Para uso comercial e multiusuário, a empresa oferece o modelo Pulsar Pro com acesso ao myWallbox Business — portal de gestão de usuários, faturamento e tarifação — funcionando como uma camada de serviço (SaaS) adicional sobre o hardware vendido.

### Limitações conhecidas

- O modelo Pulsar Plus (voltado a uso residencial) não possui medidor certificado (MID) nem portal de gestão multiusuário robusto — esses recursos exigem o modelo Pulsar Pro.
- Balanceamento dinâmico de carga depende de um módulo adicional pago (Power Boost), não incluso de fábrica.
- Relatos de usuários sobre instabilidade de conexão Wi-Fi/Bluetooth e dependência quase total do aplicativo para qualquer controle, com poucos comandos físicos no equipamento.
- Suporte ao cliente apontado como ponto fraco em avaliações recentes.

---

# 4. Tabela Comparativa

| Solução | Problema Resolvido | Funcionalidades | Modelo de Negócio | Limitações |
|----------|----------|----------|----------|----------|
| ChargePoint | Fragmentação da recarga pública/semipública; falta de rede unificada | Localização, reserva e pagamento via app; Gestão para frotas e empresas (CPaaS); Rede aberta de operadores parceiros | Hardware + assinatura SaaS recorrente (CPaaS) + comissão sobre transações | Dependência de assinatura contínua; Pouco foco em rateio fino multiusuário; Contratos rígidos |
| Zaptec (Pro/Go) | Sobrecarga elétrica em instalações compartilhadas; falta de gestão centralizada | Balanceamento dinâmico de carga e fases; Gestão de até 1000+ pontos via portal; Medidor MID embutido (modelo Pro) | Venda de hardware; portal de gestão gratuito; integrações pagas de pagamento/back-office | Rateio não nativo (depende de terceiros); Foco em eficiência elétrica, não em analytics; Recursos avançados apenas em modelos mais caros |
| Wallbox Pulsar Plus | Recarga residencial/multifamiliar com ajuste de potência e controle remoto | App myWallbox: agendamento e monitoramento; Potência ajustável 16–48A; Power sharing entre veículos | Venda direta de hardware; camada SaaS (myWallbox Business) no modelo Pro | Sem MID/gestão multiusuário no Plus; Balanceamento exige módulo pago; Suporte ao cliente criticado |

---

# 5. Conclusão

## 5.1 O que o EV ChargeOps pode aproveitar dessas soluções

- Balanceamento de carga (Zaptec): incorporar lógica de gestão de capacidade elétrica do estacionamento L1, evitando que múltiplas sessões simultâneas comprometam a infraestrutura do Energy Innovation Lab.
- Estrutura de dados por sessão (ChargePoint e Zaptec): registrar duração, energia entregue (kWh), horário e usuário de cada sessão como unidade básica de análise, replicando o padrão de granularidade observado nas soluções líderes.
- Camada de aplicativo centrada no usuário (Wallbox/ChargePoint): oferecer visibilidade individual de consumo e custo, histórico de sessões e controle remoto, elevando a transparência percebida pelo usuário final.
- Separação entre hardware e inteligência de software (Zaptec): preservar flexibilidade para conectar o EV ChargeOps a diferentes modelos de carregador via software aberto, sem prender a solução a um único fabricante.
- Modelo de portal de gestão para operadores (ChargePoint CPaaS e myWallbox Business): inspirar o desenho do painel de gestão para o Energy Innovation Lab, com faturamento, regras de acesso e relatórios agregados.

## 5.2 Diferenciais da proposta da equipe

- Rateio justo nativo: diferente de Zaptec e Wallbox Pulsar Plus (que dependem de módulos ou integrações externas), o EV ChargeOps pode oferecer rateio de custos como funcionalidade central do produto, não um complemento.
- Inteligência acionável via IA: nenhuma das três soluções analisadas usa IA como motor lógico central — todas se concentram em telemetria e gestão de carga. O diferencial do EV ChargeOps está em transformar os dados de sessão em recomendações, previsões de consumo e priorização inteligente de uso compartilhado.
- Foco em contextos compartilhados de médio porte: enquanto ChargePoint mira redes públicas em larga escala e Zaptec/Wallbox miram principalmente hardware, o EV ChargeOps pode se posicionar para condomínios, campus e edifícios corporativos de porte intermediário, com setup mais simples e custo de entrada menor.
- Independência de hardware proprietário: ao não estar atrelado à venda de um carregador específico (como Zaptec e Wallbox), o EV ChargeOps tem potencial para atuar como camada de software agnóstica, compatível com diferentes modelos de carregador, incluindo o HCA G2 já instalado no Lab.

---

**Fontes consultadas:** documentação oficial e páginas de produto de ChargePoint, Zaptec e Wallbox; avaliações independentes especializadas (EnergySage, Smart Home Charge, Autoblog, Electric Vehicle Geek), consultadas em junho de 2026.

---

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

## Opçao B - Definiçao Do Papel Da Ia
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

## Fluxo de Dados

O fluxo de dados da plataforma segue uma trajetória sequencial que garante a integridade e a rastreabilidade das informações, desde a captura física dos dados até a entrega dos resultados ao usuário final.

### Etapas do Fluxo de Dados

#### 1. Carregador

O carregador inicia uma sessão de recarga e registra os principais parâmetros elétricos da operação, incluindo:

* Tensão (V);
* Corrente (A);
* Potência (kW);
* Energia consumida (kWh).

#### 2. API GoodWe

Os dados coletados são enviados para o ambiente em nuvem por meio da API GoodWe, onde são recebidos, validados e disponibilizados para processamento.

#### 3. Banco de Dados

Após a validação, as informações são armazenadas em um banco de dados relacional, formando o histórico de utilização necessário para consultas, relatórios e treinamento dos modelos de Inteligência Artificial.

#### 4. Inteligência Artificial

Os modelos de IA processam os dados armazenados para:

* Prever o consumo energético futuro;
* Identificar padrões de utilização;
* Detectar anomalias e comportamentos atípicos.

#### 5. Dashboard

Os resultados gerados são disponibilizados em tempo real por meio de dashboards e painéis interativos, permitindo o acompanhamento do consumo e da utilização dos carregadores.

#### 6. Faturamento

Com base no consumo registrado e nas tarifas configuradas, o sistema realiza automaticamente o cálculo dos valores devidos e gera as faturas individuais dos usuários.

### Fluxograma Simplificado

```text
Carregador
    ↓
API GoodWe
    ↓
Banco de Dados
    ↓
Inteligência Artificial
    ↓
Dashboard
    ↓
Fatura
```

---

## Inteligência Artificial

A Inteligência Artificial desempenha um papel estratégico no EV ChargeOps, transformando dados brutos de consumo em informações úteis para tomada de decisão.

A solução prevê inicialmente duas aplicações principais de IA:

### Previsão de Consumo

Utiliza técnicas de regressão para estimar o consumo energético futuro com base em dados históricos, padrões de uso e variáveis externas.

**Objetivos:**

* Prever demanda energética;
* Auxiliar no planejamento de custos;
* Otimizar a utilização da infraestrutura de recarga;
* Apoiar decisões operacionais.

---

# Inteligência Artificial

A Inteligência Artificial desempenha um papel estratégico no EV ChargeOps, transformando dados brutos de consumo em informações acionáveis para usuários e gestores. Nesta etapa do projeto, foram definidas duas aplicações principais de IA:

* Previsão de Consumo Energético;
* Detecção de Anomalias.

Além dessas aplicações, foram identificadas oportunidades futuras para ampliar a inteligência da plataforma.

---

## IA 1 — Previsão de Consumo

### Técnica Utilizada

**Regressão**

A regressão é uma das técnicas mais utilizadas para previsão de consumo energético. Seu objetivo é identificar a relação entre variáveis de entrada e o consumo de energia esperado.

A **Regressão Linear** utiliza o método dos mínimos quadrados para ajustar coeficientes que minimizam os erros de previsão, considerando variáveis como:

* Hora do dia;
* Dia da semana;
* Temperatura ambiente;
* Tipo de veículo elétrico.

Para cenários mais complexos, podem ser utilizados algoritmos mais robustos, como:

* Random Forest Regressor;
* XGBoost.

Esses modelos conseguem capturar padrões não lineares, sazonalidades e comportamentos complexos de consumo.

### Pipeline da IA

```text
Coleta de Dados
       ↓
Pré-processamento
       ↓
Treinamento do Modelo
       ↓
Previsão de Consumo
       ↓
Dashboard e Relatórios
```

### Dados Necessários

* Histórico de sessões de carregamento;
* Data e horário das sessões;
* Duração da recarga;
* Energia consumida (kWh);
* Identificação do usuário;
* Identificação do veículo;
* Temperatura ambiente;
* Tarifas energéticas;
* Dia da semana;
* Mês;
* Feriados.

### Benefícios

* Planejamento de recargas em horários de menor tarifa;
* Previsão da demanda energética da infraestrutura;
* Otimização da distribuição de carga elétrica;
* Estimativa mais precisa de gastos mensais;
* Redução de desperdícios energéticos;
* Apoio à tomada de decisões operacionais.

Estudos recentes demonstram que modelos de Machine Learning aplicados à previsão de consumo energético podem alcançar índices de erro (MAPE) próximos de 3,33%, evidenciando alta precisão preditiva.

---

## IA 2 — Detecção de Anomalias

### Técnicas Utilizadas

* Isolation Forest;
* Autoencoder.

A detecção de anomalias tem como objetivo identificar comportamentos incomuns que possam indicar:

* Falhas técnicas;
* Fraudes;
* Uso indevido dos carregadores;
* Problemas operacionais.

### Isolation Forest

O Isolation Forest é um algoritmo não supervisionado baseado em árvores de decisão.

Seu funcionamento consiste em isolar observações incomuns em menos divisões da estrutura de dados, permitindo identificar rapidamente comportamentos fora do padrão.

### Autoencoder

Autoencoders são redes neurais treinadas para reconstruir dados de entrada.

Quando um comportamento apresenta erro elevado de reconstrução, ele pode ser classificado como uma possível anomalia.

### Pipeline da IA

```text
Dados Históricos
       ↓
Treinamento do Modelo
       ↓
Análise dos Padrões
       ↓
Detecção de Anomalias
       ↓
Geração de Alertas
```

### Benefícios

* Identificação precoce de falhas;
* Detecção de fraudes;
* Maior confiabilidade da infraestrutura;
* Monitoramento contínuo do sistema;
* Redução de custos operacionais.

---

## Aplicações Futuras de Inteligência Artificial

Além das aplicações principais, o EV ChargeOps poderá incorporar funcionalidades adicionais baseadas em IA.

### Clustering de Usuários

Utilização de algoritmos como **K-Means** para segmentação de usuários conforme seus padrões de consumo.

#### Possíveis Aplicações

* Tarifação personalizada;
* Programas de fidelidade;
* Perfis de utilização;
* Planejamento de expansão da infraestrutura.

---

### Chatbot com NLP

Desenvolvimento de um assistente virtual utilizando **Processamento de Linguagem Natural (NLP)**.

#### Funcionalidades

* Consulta de consumo;
* Consulta de faturas;
* Suporte ao usuário;
* Agendamento de manutenção;
* Resolução de dúvidas frequentes.

---

# Conclusão

A integração entre as camadas física, conectividade, aplicação e apresentação, aliada às aplicações de Inteligência Artificial, transforma uma simples rede de carregadores elétricos em uma plataforma inteligente de gestão energética.

A previsão de consumo permite que usuários e administradores tomem decisões mais eficientes sobre utilização e custos. Já a detecção de anomalias aumenta a segurança operacional ao identificar automaticamente falhas, fraudes e comportamentos incomuns.

Em conjunto, essas tecnologias formam um ecossistema capaz de gerar valor operacional, econômico e ambiental, contribuindo para o avanço da mobilidade elétrica e da gestão sustentável de energia.

---

# Entregáveis

A execução desta etapa do projeto resulta em três entregáveis principais.

## 1. Diagrama de Arquitetura

Representação visual das quatro camadas da plataforma:

* Camada Física;
* Camada de Conectividade;
* Camada de Aplicação;
* Camada de Apresentação.

### Objetivos

* Identificar os componentes da solução;
* Demonstrar a comunicação entre as camadas;
* Posicionar os módulos de Inteligência Artificial na arquitetura.

### Formatos Recomendados

* UML de Componentes;
* Modelo C4.

---

## 2. Fluxograma de Dados

Representação do fluxo completo das informações.

```text
Carregador
    ↓
API GoodWe
    ↓
Banco de Dados
    ↓
Modelos de IA
    ↓
Dashboard
    ↓
Fatura
```

### Etapas

1. Coleta de dados no carregador;
2. Transmissão para a nuvem;
3. Armazenamento em banco de dados;
4. Processamento pelos modelos de IA;
5. Visualização em dashboards;
6. Geração automática de faturas.

---

## 3. Documento de IA

Documento técnico contendo detalhes sobre os modelos utilizados.

### IA 1 — Previsão de Consumo

* Algoritmo utilizado;
* Dados de treinamento;
* Variáveis de entrada;
* Variáveis de saída;
* Métricas de avaliação:

  * MAPE;
  * RMSE;
  * R².

### IA 2 — Detecção de Anomalias

* Isolation Forest;
* Autoencoder;
* Estratégia de detecção;
* Limiar de anomalia;
* Taxa esperada de falsos positivos.

### Pipeline de Dados

* Coleta;
* Limpeza;
* Normalização;
* Divisão treino/teste;
* Atualização periódica dos modelos.

### Integração com a Plataforma

* APIs de inferência;
* Frequência de execução;
* Sistema de alertas;
* Exposição dos resultados ao dashboard.

---
# Regulamentação — ANEEL RN 1.000/2021

**Atualizado em:** Junho de 2026

---

# O que a norma cobre

A **Resolução Normativa (RN) 1.000/2021 da ANEEL** consolidou as regras sobre fornecimento de energia elétrica no Brasil, revogando diversas normas anteriores, incluindo a RN 819/2018, que tratava especificamente da recarga de veículos elétricos.

O tema de recarga de veículos elétricos (VEs) está localizado no **Capítulo V**, a partir do **Artigo 550**, dentro do bloco de **Atividades Acessórias**.

A norma define uma **Estação de Recarga** como:

> Conjunto de softwares e equipamentos destinados ao fornecimento de corrente alternada (CA) ou corrente contínua (CC) para veículos elétricos, incluindo funções de controle, supervisão e comunicação, instalados externamente ao veículo.

Para o projeto **EV ChargeOps**, três pilares regulatórios devem ser observados:

1. Exploração comercial da recarga;
2. Comunicação com a distribuidora de energia;
3. Utilização de protocolos abertos de comunicação.

---

# Exploração Comercial da Recarga

A RN 1.000/2021 estabelece que qualquer pessoa física ou jurídica pode instalar e operar estações de recarga para veículos elétricos.

Exemplos:

- Condomínios;
- Postos de combustível;
- Shoppings;
- Empresas privadas;
- Operadores de eletropostos.

## Regras principais

- A atividade é livre e não exige concessão para venda do serviço de recarga.
- Os preços podem ser definidos livremente pelo operador.
- A cobrança pelo carregamento não é considerada comercialização de energia elétrica.
- A atividade é classificada como atividade acessória ao serviço de distribuição.

## Participação das Distribuidoras

As distribuidoras podem instalar estações públicas de recarga, desde que:

- Operem por sua conta e risco;
- Mantenham separação contábil da atividade regulada de distribuição.

## Restrições

- ❌ É proibida a injeção de energia do veículo na rede elétrica (**Vehicle-to-Grid – V2G**).
- ❌ A operação não pode ser caracterizada como comercialização regulada de energia elétrica.

---

# Comunicação com a Distribuidora

Antes da energização da estação, o responsável pela instalação deve comunicar a distribuidora local quando houver necessidade de:

- Reforço da rede elétrica;
- Alteração do sistema de medição;
- Mudança do nível de tensão de atendimento.

## Quando não é obrigatório comunicar?

A comunicação prévia pode não ser necessária em instalações pequenas que:

- Não alterem a demanda da rede;
- Não exijam adequações elétricas;
- Permaneçam dentro das condições já contratadas.

## Responsabilidades das Distribuidoras

As distribuidoras devem:

- Consolidar os dados recebidos;
- Reportar informações à ANEEL semestralmente.

Os custos de adequação da rede seguem os critérios definidos pelo:

- PRODIST;
- Condições Gerais de Fornecimento.

## Aplicação no EV ChargeOps

O sistema deverá:

- Registrar a comunicação enviada à distribuidora;
- Armazenar documentos e comprovantes;
- Vincular o registro à estação cadastrada;
- Permitir auditoria futura.

---

# Protocolos Abertos

A RN 1.000/2021 determina que estações de recarga operadas por terceiros (não exclusivas para uso privado) utilizem protocolos abertos para comunicação e supervisão remota.

## Objetivo

Garantir:

- Interoperabilidade;
- Integração entre fabricantes;
- Fiscalização;
- Auditoria;
- Livre concorrência.

O sistema não deve depender de protocolos proprietários.

---

# Protocolos Relevantes para o Projeto

| Protocolo | Camada | Finalidade |
|------------|---------|------------|
| OCPP 1.6 / 2.0.1 | Aplicação | Comunicação entre carregadores e sistema de gestão (back-end) |
| OCPI | Aplicação | Integração entre operadores de recarga, roaming e faturamento |
| Modbus RTU/TCP | Campo / LAN | Comunicação industrial entre carregadores, inversores e medidores |
| RS-485 | Física / Serial | Comunicação do GoodWe HCA G2 com inversores e medidores |
| LAN / Wi-Fi | Rede | Conexão ao portal SEMS e APIs REST |
| Bluetooth | Rede Local | Configuração inicial via aplicativo SolarGo |
| RFID (ISO 14443) | Autenticação | Identificação do usuário para iniciar recargas |

---

# Aplicação no EV ChargeOps

Para garantir conformidade regulatória e escalabilidade futura:

## Controle dos Carregadores

Utilizar:

- ✅ OCPP 1.6
- ✅ OCPP 2.0.1

Como protocolo principal de comunicação.

## Monitoramento e Telemetria

Utilizar:

- ✅ API SEMS GoodWe

Para:

- Monitoramento da estação;
- Coleta de dados energéticos;
- Integração com geração fotovoltaica.

## Evitar Dependência de Fabricante

O sistema deve permitir integração futura com carregadores de diferentes fabricantes sem necessidade de alterações estruturais.

---

# Resumo do Impacto no Projeto

| Exigência da RN 1.000/2021 | Implementação no EV ChargeOps |
|----------------------------|-------------------------------|
| Exploração comercial livre | Tarifas configuráveis por operador |
| Comunicação à distribuidora | Fluxo de cadastro com registro e armazenamento do comprovante |
| Protocolos abertos | Utilização de OCPP como protocolo principal |
| Integração operacional | Uso da API SEMS para monitoramento e coleta de dados |
| Proibição de V2G | Não implementar injeção de energia na rede |
| Responsabilidade por danos elétricos | Armazenar logs de tensão e dados de cada sessão |

---

# Conclusão

A RN 1.000/2021 permite a exploração comercial da recarga de veículos elétricos de forma livre, desde que sejam observadas as exigências de comunicação com a distribuidora e o uso de protocolos abertos.

Para garantir conformidade regulatória, interoperabilidade e escalabilidade, o **EV ChargeOps** adotará o protocolo **OCPP** como padrão de comunicação dos carregadores, utilizará a **API SEMS da GoodWe** para monitoramento e manterá registros de todas as comunicações e eventos operacionais da infraestrutura de recarga.

---

### Referência

**ANEEL — Resolução Normativa nº 1.000/2021**

---

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
---
# Carregador GoodWe HCA G2

## Visão Geral

O GoodWe HCA G2 é um carregador AC para veículos elétricos disponível em versões de 7 kW, 11 kW e 22 kW.

## Interfaces de Comunicação

### RS-485

Comunicação com inversores e medidores.

### LAN

Integração via rede local.

### Wi-Fi

Conexão sem fio ao portal SEMS.

### Bluetooth

Configuração inicial através do aplicativo SolarGo.

### RFID

Autenticação dos usuários.

## Aplicação no EV ChargeOps

As interfaces permitem monitoramento, identificação dos usuários e integração com sistemas externos.

---
# Modelo de Rateio

## O que é um Sistema de Rateio?

Em infraestruturas de uso compartilhado, como condomínios residenciais, edifícios corporativos e campi universitários, o rateio é o mecanismo utilizado para distribuir os custos de um serviço coletivo entre seus usuários.

No contexto da recarga de veículos elétricos, essa necessidade surge quando múltiplos moradores ou colaboradores utilizam os mesmos pontos de carregamento, tornando indispensável um critério claro e justo para definir quanto cada usuário deve pagar ao final do mês.

Sem um mecanismo estruturado de rateio, a gestão dos custos de energia recai sobre a administração do condomínio de forma manual e imprecisa, gerando conflitos e cobranças desproporcionais.

A ausência de um sistema individualizado representa um dos principais obstáculos para a expansão da infraestrutura de recarga compartilhada no Brasil. Quando não há controle do consumo por usuário, os custos tendem a ser divididos igualmente entre todos os moradores, independentemente da utilização real dos carregadores.

Essa abordagem gera insatisfação entre moradores que não possuem veículos elétricos e desestimula a adoção de soluções mais eficientes.

Nesse cenário, o **EV ChargeOps** surge como uma solução capaz de registrar, organizar e cobrar cada sessão de recarga de forma transparente, automatizada e auditável.

---

# Modelo Adotado — Rateio Individualizado por Consumo

Para solucionar os problemas da divisão igualitária dos custos, o EV ChargeOps adota o modelo de **rateio individualizado por consumo**, também conhecido como **Pay-Per-Use**.

Diferentemente dos modelos tradicionais, em que o custo total de energia é dividido igualmente entre todos os usuários, essa abordagem garante que cada pessoa pague exclusivamente pela energia consumida durante suas sessões de recarga.

## Vantagens do Modelo

* Transparência na cobrança;
* Justiça na divisão dos custos;
* Eliminação de subsídios cruzados;
* Incentivo ao uso consciente da energia;
* Facilidade de auditoria e rastreabilidade.

Essa abordagem é especialmente adequada para ambientes compartilhados, onde os perfis de utilização podem variar significativamente entre os usuários.

---

# Funcionamento do Sistema

O processo inicia-se com a identificação individual do usuário por meio de:

* Cartão RFID;
* Token de acesso;
* Aplicativo de gerenciamento.

Após a autenticação, a sessão de recarga é iniciada e a plataforma passa a registrar automaticamente os principais dados operacionais.

## Dados Registrados

* Horário de início;
* Horário de término;
* Duração da sessão;
* Energia consumida (kWh);
* Identificação do usuário;
* Identificação do veículo;
* Carregador utilizado.

Ao final da sessão, essas informações são enviadas para a plataforma e armazenadas para consultas futuras, relatórios e faturamento.

---

# Cálculo da Cobrança

A cobrança segue uma fórmula simples, transparente e auditável.

## Fórmula

```text
Valor a pagar = Consumo Total (kWh) × Tarifa (R$/kWh)
```

### Exemplo Prático

Consumo no mês:

```text
18,5 kWh
```

Tarifa aplicada:

```text
R$ 0,95/kWh
```

Cálculo:

```text
18,5 × 0,95 = R$ 17,58
```

### Resultado

| Consumo  | Tarifa      | Valor Final |
| -------- | ----------- | ----------- |
| 18,5 kWh | R$ 0,95/kWh | R$ 17,58    |

Ao final de cada ciclo mensal, o sistema consolida todas as sessões registradas e gera automaticamente uma fatura individual para cada usuário.

---

# Sistema de Exceções

Situações atípicas podem ocorrer durante a operação dos carregadores e precisam ser tratadas adequadamente para garantir a integridade do modelo de cobrança.

O EV ChargeOps implementa regras específicas para cada cenário.

## Sessão Interrompida

Ocorre quando o veículo é desconectado antes do término previsto da recarga.

### Tratamento

* Registrar a energia efetivamente entregue;
* Encerrar a sessão;
* Aplicar a cobrança normalmente sobre o consumo realizado.

## Usuário sem Consumo no Mês

Quando um usuário não realiza nenhuma sessão de recarga durante o período de faturamento.

### Tratamento

| Situação    | Valor Cobrado |
| ----------- | ------------- |
| Sem consumo | R$ 0,00       |

O modelo Pay-Per-Use garante que apenas usuários ativos sejam cobrados.

## Dois Veículos na Mesma Unidade

Uma mesma unidade pode possuir mais de um veículo elétrico cadastrado.

### Tratamento

1. Cada veículo possui sessões registradas individualmente;
2. O consumo de todos os veículos da unidade é consolidado;
3. Uma única fatura é gerada para a unidade.

Dessa forma, o valor final reflete o consumo total da residência.

---

# Benefícios do Modelo de Rateio

A adoção do rateio individualizado proporciona diversas vantagens para gestores e usuários.

## Para o Usuário

* Cobrança justa;
* Transparência;
* Acompanhamento detalhado do consumo;
* Histórico de utilização.

## Para o Condomínio

* Eliminação de cálculos manuais;
* Redução de conflitos;
* Facilidade de gestão;
* Auditoria simplificada.

## Para a Plataforma

* Escalabilidade;
* Automatização do faturamento;
* Integração com Inteligência Artificial;
* Base de dados estruturada para análises futuras.

---

# Base de Dados

A estrutura de dados da plataforma EV ChargeOps foi modelada utilizando um diagrama Entidade-Relacionamento (ER), que representa visualmente as entidades do sistema, seus atributos e relacionamentos.

Esse modelo servirá como base para a implementação do banco de dados durante a Sprint 02.

## Entidades do Sistema

### Usuário

Armazena informações cadastrais dos moradores.

**Atributos:**

* ID
* Nome
* E-mail
* Telefone
* Token RFID

---

### Unidade

Representa o apartamento, sala comercial ou vaga vinculada ao usuário.

**Atributos:**

* ID
* Número
* Bloco

---

### Veículo

Registra os veículos elétricos cadastrados.

**Atributos:**

* ID
* Modelo
* Placa

---

### Carregador

Representa o equipamento físico GoodWe HCA G2.

**Atributos:**

* ID
* Localização
* Potência Máxima
* Status

---

### Sessão

Entidade central do sistema responsável pelo registro das recargas.

**Atributos:**

* ID
* Data/Hora Início
* Data/Hora Fim
* Energia Consumida (kWh)
* Status

---

### Fatura

Consolida os consumos mensais e gera a cobrança.

**Atributos:**

* ID
* Consumo Total
* Tarifa Aplicada
* Valor Final
* Data de Emissão

---

# Relacionamentos

```text
Usuário
   │
   ├── Unidade
   │
   ├── Veículo
   │
   └── Sessão
          │
          └── Carregador

Unidade
   │
   └── Fatura
```

Esse modelo garante rastreabilidade completa das sessões de recarga, permitindo que todas as informações utilizadas no faturamento sejam auditáveis e facilmente consultadas.
