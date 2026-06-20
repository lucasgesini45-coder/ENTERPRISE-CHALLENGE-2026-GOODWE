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
