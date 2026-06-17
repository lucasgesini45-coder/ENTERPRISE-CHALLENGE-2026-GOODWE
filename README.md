# Sistema de Gestão de Recarga Compartilhada para Veículos Elétricos

## Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de criar um sistema capaz de gerenciar infraestruturas de recarga compartilhada para veículos elétricos em ambientes como condomínios, empresas e universidades.

A solução permite controlar usuários, organizar sessões de recarga, registrar dados de consumo energético e auxiliar na administração dos carregadores, contribuindo para uma utilização mais eficiente dos recursos disponíveis.

---

## Objetivos

- Compreender os desafios da recarga compartilhada.
- Estudar modelos de negócio utilizados no setor.
- Analisar os dados gerados durante uma sessão de recarga.
- Desenvolver um sistema para gerenciamento de usuários e sessões.
- Aplicar estruturas de dados como filas e pilhas na solução proposta.

---

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

# Introdução

O crescimento da adoção de veículos elétricos tem impulsionado a necessidade de novas soluções de recarga em ambientes compartilhados.

Condomínios, empresas e universidades enfrentam desafios relacionados à disponibilidade de energia, controle de acesso, gestão dos carregadores e monitoramento do consumo energético.

Diante desse cenário, torna-se fundamental compreender como funcionam as infraestruturas de recarga compartilhada e quais informações precisam ser gerenciadas por um sistema.

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

# Conclusão

A infraestrutura de recarga compartilhada é um elemento fundamental para o crescimento da mobilidade elétrica.

Os desafios relacionados à capacidade energética, gestão de usuários, controle de acesso e monitoramento do consumo demonstram a necessidade de soluções tecnológicas eficientes.

Com base nesses conceitos, foi desenvolvido um sistema capaz de organizar e registrar informações das sessões de recarga, utilizando estruturas de dados e mecanismos de autenticação para garantir um gerenciamento eficiente da infraestrutura compartilhada.
