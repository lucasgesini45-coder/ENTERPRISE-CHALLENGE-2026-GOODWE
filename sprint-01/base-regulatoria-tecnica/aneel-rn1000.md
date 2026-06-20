# EV ChargeOps — Sprint 02

## Regulamentação — ANEEL RN 1.000/2021

**Junho de 2026**

---

## O que a norma cobre

A **Resolução Normativa (RN) 1.000/2021 da ANEEL** consolidou as regras sobre fornecimento de energia elétrica no Brasil, revogando diversas normas anteriores, incluindo a RN 819/2018, que tratava especificamente da recarga de veículos elétricos.

O tema de recarga de veículos elétricos está localizado no **Capítulo V**, a partir do **Artigo 550**, dentro do bloco de atividades acessórias.

### Definição de Estação de Recarga

Uma estação de recarga é composta por:

- Softwares;
- Equipamentos para fornecimento de energia em corrente alternada (CA) ou contínua (CC);
- Sistemas de controle;
- Sistemas de comunicação;

Todos instalados externamente ao veículo.

---

## Três pilares da regulamentação

### 1. Exploração Comercial da Recarga

A norma estabelece que qualquer pessoa física ou jurídica pode instalar e operar estações de recarga mediante cobrança pelo serviço.

Exemplos:

- Condomínios;
- Postos de combustível;
- Shopping centers;
- Empresas privadas.

### Regras Importantes

Os preços são livremente negociados entre operador e usuário.

A recarga de veículos elétricos **não é considerada comercialização de energia elétrica**.

Distribuidoras podem instalar estações públicas, desde que a atividade seja contabilizada separadamente do serviço regulado.

### Restrições

É proibido utilizar tecnologia **V2G (Vehicle-to-Grid)** para injetar energia do veículo na rede.

A atividade de recarga não pode ser caracterizada como venda regulada de energia elétrica.

---

### 2. Comunicação com a Distribuidora

Antes da ativação de uma estação, o responsável deve comunicar a distribuidora quando houver:

- Necessidade de reforço da rede elétrica;
- Alteração do sistema de medição;
- Mudança do nível de tensão.

#### Quando não é necessário?

Pequenas instalações em baixa tensão que não causem impactos na rede normalmente não exigem comunicação prévia.

### Requisitos para o EV ChargeOps

- Registrar a comunicação realizada;
- Armazenar comprovantes;
- Vincular a documentação ao cadastro da estação.

---

### 3. Protocolos Abertos

Estações operadas comercialmente devem utilizar protocolos abertos para:

- Comunicação;
- Supervisão;
- Controle remoto.

O objetivo é garantir:

- Interoperabilidade;
- Independência de fabricante;
- Facilidade de auditoria;
- Escalabilidade futura.

---

## 🔌 Protocolos Compatíveis

| Protocolo | Camada | Finalidade |
|------------|---------|-------------|
| **OCPP 1.6 / 2.0.1** | Aplicação | Comunicação entre carregadores e sistema de gestão |
| **OCPI** | Aplicação | Troca de dados entre operadores de recarga |
| **Modbus RTU/TCP** | Campo/LAN | Comunicação com inversores e medidores |
| **RS-485** | Física/Serial | Interface utilizada pelo GoodWe HCA G2 |
| **LAN / Wi-Fi** | Rede | Integração com portal SEMS e APIs |
| **Bluetooth** | Rede Local | Configuração inicial via SolarGo |
| **RFID (ISO 14443)** | Autenticação | Identificação do usuário para iniciar a recarga |

---

## Aplicação no Projeto EV ChargeOps

### OCPP como padrão principal

O sistema deve adotar o protocolo:

```text
OCPP 1.6 ou OCPP 2.0.1
```

Motivos:

- Conformidade regulatória;
- Compatibilidade com diversos fabricantes;
- Maior escalabilidade;
- Facilidade de manutenção.

### Integração Complementar

- API SEMS → Monitoramento e coleta de dados.
- OCPP → Controle operacional dos carregadores.

---

## Impacto da Norma no Sistema

| Exigência da ANEEL | Implementação no EV ChargeOps |
|-------------------|------------------------------|
| Exploração comercial livre | Permitir tarifa configurável pelo operador |
| Comunicação à distribuidora | Criar fluxo de cadastro com registro da comunicação |
| Protocolos abertos | Utilizar OCPP para controle dos carregadores |
| V2G proibido | Não implementar injeção de energia na rede |
| Responsabilidade por danos elétricos | Registrar logs de tensão e eventos por sessão |

---

## Conclusão

A RN 1.000/2021 estabelece diretrizes claras para a operação de estações de recarga de veículos elétricos no Brasil.

Para manter a conformidade regulatória, o **EV ChargeOps** deverá:

- Utilizar protocolos abertos;
- Registrar comunicações obrigatórias à distribuidora;
- Permitir cobrança livre pelos operadores;
- Evitar funcionalidades de V2G;
- Manter histórico e logs operacionais para auditoria e suporte.

---

### Referência

**ANEEL — Resolução Normativa nº 1.000/2021**
