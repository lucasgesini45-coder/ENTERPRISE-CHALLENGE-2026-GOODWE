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
