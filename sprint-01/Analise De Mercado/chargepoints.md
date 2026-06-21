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
