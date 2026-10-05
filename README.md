# EV ChargeOps

## Enterprise Challenge 2026 — GoodWe × FIAP

O **EV ChargeOps** é uma plataforma para gestão inteligente de infraestruturas compartilhadas de recarga de veículos elétricos.

O projeto foi desenvolvido para o **Enterprise Challenge 2026**, em parceria com a **GoodWe**, com o objetivo de transformar os dados gerados pelos carregadores em informações úteis para operação, monitoramento, controle de consumo e tomada de decisão.

---

# 1. Sobre o projeto

Infraestruturas de recarga compartilhada, como as presentes em condomínios, empresas e instituições de ensino, apresentam desafios relacionados ao controle de acesso, identificação dos usuários, acompanhamento das sessões, consumo de energia e divisão dos custos.

O **EV ChargeOps** propõe uma solução centralizada para organizar essas informações e permitir que administradores acompanhem a utilização da infraestrutura de recarga.

A plataforma trabalha com dados de:

- Usuários;
- Carregadores;
- Sessões de recarga;
- Consumo energético;
- Indicadores operacionais;
- Previsões e análises utilizando Inteligência Artificial.

---

# 2. Objetivo

O objetivo do EV ChargeOps é desenvolver uma plataforma capaz de gerenciar uma infraestrutura compartilhada de carregamento de veículos elétricos, oferecendo informações organizadas para usuários e administradores.

A solução busca permitir:

- Cadastro e gerenciamento de usuários;
- Autenticação e controle de acesso;
- Monitoramento dos carregadores;
- Registro das sessões de recarga;
- Controle do consumo de energia;
- Visualização de indicadores;
- Análise histórica dos dados;
- Identificação de possíveis anomalias;
- Previsão de consumo;
- Apoio à tomada de decisão por meio de Inteligência Artificial.

---

# 3. Problema

O crescimento da utilização de veículos elétricos aumenta a necessidade de uma infraestrutura de recarga organizada e monitorada.

Em ambientes compartilhados, podem surgir problemas como:

- Dificuldade para identificar quem utilizou determinado carregador;
- Falta de histórico organizado das sessões;
- Dificuldade para acompanhar o consumo individual;
- Falta de indicadores para administração da infraestrutura;
- Dificuldade para identificar comportamentos fora do padrão;
- Necessidade de maior controle operacional dos carregadores.

O EV ChargeOps foi desenvolvido para centralizar essas informações e transformar os dados de utilização em indicadores que auxiliem a operação.

---

# 4. Solução proposta

O EV ChargeOps utiliza uma arquitetura baseada em API para receber, processar e disponibilizar informações relacionadas à infraestrutura de recarga.

A solução permite trabalhar com:

- Usuários;
- Carregadores;
- Sessões de recarga;
- Consumo energético;
- Indicadores;
- Dados históricos;
- Inteligência Artificial.

A plataforma possui uma área administrativa para acompanhamento da operação e uma interface web para visualização dos dados.

---

# 5. Principais funcionalidades

## 5.1 Autenticação

O sistema possui autenticação de usuários utilizando:

- Login;
- Senha protegida por hash;
- Token JWT;
- Controle de acesso por perfil.

A autenticação é utilizada para controlar o acesso às funcionalidades administrativas da plataforma.

---

## 5.2 Gerenciamento de usuários

O sistema possui estrutura para cadastro e consulta de usuários.

Os dados utilizados incluem informações como:

- Nome;
- E-mail;
- Telefone;
- Senha;
- Perfil de acesso.

O acesso às informações administrativas de usuários é protegido por autenticação.

---

## 5.3 Gerenciamento de carregadores

A plataforma permite trabalhar com informações dos carregadores disponíveis na infraestrutura.

Entre os dados utilizados estão:

- Nome/localização;
- Número de série;
- Modelo;
- Potência;
- Status;
- Localização geográfica.

Os carregadores podem ser associados às sessões de recarga para geração do histórico de utilização.

---

## 5.4 Sessões de recarga

Cada sessão de recarga pode armazenar informações como:

- Usuário;
- Carregador;
- Data e hora de início;
- Data e hora de término;
- Duração;
- Energia consumida;
- Valor da sessão;
- Status.

Esses dados formam a base para os indicadores e análises da plataforma.

---

## 5.5 Monitoramento de consumo

Os dados das sessões são utilizados para acompanhar o consumo energético.

A aplicação permite organizar informações relacionadas a:

- Energia consumida;
- Histórico de utilização;
- Quantidade de sessões;
- Valores associados ao consumo;
- Utilização dos carregadores.

---

## 5.6 Dashboard

O sistema possui um dashboard para visualização dos principais indicadores da infraestrutura.

O dashboard utiliza os dados armazenados no banco de dados para apresentar informações de forma organizada e facilitar o acompanhamento da operação.

Entre os dados apresentados estão informações relacionadas a:

- Sessões;
- Consumo;
- Carregadores;
- Usuários;
- Indicadores operacionais.

---

# 6. Inteligência Artificial

Um dos diferenciais do EV ChargeOps é a utilização de Inteligência Artificial para análise dos dados de recarga.

A solução possui módulos voltados para:

### Previsão de consumo

Utilização dos dados históricos para estimar padrões de consumo e auxiliar no planejamento da infraestrutura.

### Detecção de anomalias

Identificação de comportamentos que podem fugir do padrão esperado de utilização.

### Análise de padrões

Avaliação dos dados históricos para identificar comportamentos recorrentes de utilização dos carregadores.

### Apoio à tomada de decisão

As informações produzidas pela camada de Inteligência Artificial podem auxiliar administradores na identificação de problemas e oportunidades de otimização.

---

# 7. Assistente de IA

O projeto também possui um módulo de **Assistente de IA**, integrado à API.

O assistente permite que o usuário envie perguntas relacionadas aos dados da operação.

A API disponibiliza o endpoint:


## 8. RFID e Controle de Acesso

O projeto possui uma estrutura dedicada ao **controle de acesso por RFID**, permitindo identificar o usuário responsável pela utilização de um carregador.

A identificação é associada à sessão de recarga, possibilitando maior controle e organização das informações de utilização.

### Principais funcionalidades

* **Identificação do usuário** por RFID;
* **Controle de acesso** aos carregadores;
* **Associação do usuário à sessão de recarga**;
* **Organização e rastreabilidade** do histórico de utilização.

POST /assistente-ia/perguntar

## 9. Arquitetura da Solução

A arquitetura do **EV ChargeOps** foi desenvolvida de forma modular, tendo o **FastAPI** como núcleo da aplicação. A API é responsável por intermediar a comunicação entre o frontend, banco de dados e os diferentes serviços da solução.

O fluxo da aplicação pode ser representado da seguinte forma:

```text
                         USUÁRIO
                            │
                            ▼
                  ┌──────────────────┐
                  │     FRONTEND     │
                  │      Web App     │
                  └────────┬─────────┘
                           │
                           │ HTTP / REST
                           ▼
                  ┌──────────────────┐
                  │     FASTAPI      │
                  │       API        │
                  └────────┬─────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         ┌─────────┐  ┌──────────┐  ┌──────────────┐
         │ Usuários│  │ Sessões  │  │ Carregadores │
         └────┬────┘  └────┬─────┘  └──────┬───────┘
              │            │               │
              └────────────┼───────────────┘
                           ▼
                  ┌──────────────────┐
                  │    PostgreSQL    │
                  │   Banco de Dados │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   IA / Análise   │
                  │ Previsões        │
                  │ Detecção de      │
                  │ Anomalias        │
                  └──────────────────┘
```

### Principais componentes
* **Frontend**: interface web utilizada pelo usuário para visualizar e interagir com a plataforma.
* **FastAPI**: camada responsável pela API e pela comunicação entre os componentes da aplicação.
* **PostgreSQL**: armazenamento dos dados relacionados a usuários, carregadores e sessões de recarga.
* ***IA e análise de dados**: processamento das informações para geração de previsões e identificação de possíveis anomalias.

## 10. Tecnologias Utilizadas

O **EV ChargeOps** utiliza um conjunto de tecnologias voltadas para desenvolvimento de APIs, gerenciamento de dados, análise inteligente e disponibilização da aplicação.

### Backend

* **Python** — linguagem principal do backend;
* **FastAPI** — desenvolvimento da API REST;
* **SQLAlchemy** — mapeamento e gerenciamento do banco de dados;
* **Pydantic** — validação e estruturação dos dados;
* **JWT** — autenticação e gerenciamento de sessões;
* **Passlib** — gerenciamento e proteção de credenciais;
* **Uvicorn** — servidor ASGI para execução da aplicação;
* **Scikit-learn** — recursos de Machine Learning;
* **NumPy** — processamento e manipulação de dados numéricos;
* **SciPy** — recursos para análise e processamento científico.

### Frontend

* **HTML** — estrutura das páginas;
* **CSS** — estilização e identidade visual;
* **JavaScript** — interatividade e comunicação com a API.

### Banco de Dados

* **PostgreSQL** — banco de dados utilizado em produção;
* **SQLite** — banco utilizado para desenvolvimento e testes locais.

### Deploy e Infraestrutura

* **Render** — hospedagem do backend e banco PostgreSQL;
* **Vercel** — hospedagem do frontend.

## 11. Estrutura do Projeto

A estrutura do **EV ChargeOps** foi organizada de forma modular, separando as responsabilidades da aplicação entre banco de dados, rotas, serviços, inteligência artificial e frontend.

```text
ENTERPRISE-CHALLENGE-2026-GOODWE/
│
├── database/
│   ├── database.py
│   └── models.py
│
├── routes/
│   ├── auth.py
│   ├── carregadores.py
│   ├── consumo.py
│   ├── dashboard.py
│   ├── sessoes.py
│   ├── usuarios.py
│   ├── goodwe.py
│   ├── ia.py
│   ├── rfid.py
│   ├── assistente_ia.py
│   └── ...
│
├── schemas/
│   ├── usuario.py
│   ├── sessao.py
│   ├── assistente_ia.py
│   └── ...
│
├── services/
│   ├── auth_service.py
│   ├── consumo_service.py
│   ├── sessao_service.py
│   ├── goodwe_service.py
│   ├── ia_service.py
│   ├── assistente_ia_service.py
│   └── ...
│
├── ia/
│   ├── dados.py
│   ├── detector.py
│   ├── previsor.py
│   ├── gerar_dados_teste.py
│   └── __init__.py
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── login.js
│   ├── rfid-ui.js
│   ├── assistente-ia-ui.js
│   └── ...
│
├── seed_sessoes.py
├── main.py
├── requirements.txt
├── README.md
└── ...
```

### Organização dos módulos

| Diretório   | Responsabilidade                                                   |
| ----------- | ------------------------------------------------------------------ |
| `database/` | Configuração do banco e definição dos modelos                      |
| `routes/`   | Endpoints e rotas da API                                           |
| `schemas/`  | Validação e estruturação dos dados                                 |
| `services/` | Regras de negócio e integração entre componentes                   |
| `ia/`       | Modelos, previsões, detecção de anomalias e processamento de dados |
| `frontend/` | Interface web e interação com a API                                |

Essa organização permite maior **separação de responsabilidades, manutenção, escalabilidade e evolução independente dos componentes** da aplicação.

> A estrutura pode receber novos arquivos e módulos conforme a evolução do projeto.


## 12. Backend

O backend do **EV ChargeOps** foi desenvolvido em **Python**, utilizando o framework **FastAPI** para construção da API REST.

O ponto de entrada principal da aplicação é:

```text
main.py
```

A aplicação utiliza uma arquitetura modular baseada em **routers**, organizando os endpoints de acordo com o domínio de cada funcionalidade.

### Principais endpoints

```text
/auth
/usuarios
/carregadores
/sessoes
/consumo
/dashboard
/goodwe
/ia
/rfid
/assistente-ia
```

Cada domínio possui sua própria camada de **rotas, serviços e schemas**, permitindo uma melhor separação de responsabilidades e facilitando a manutenção e evolução do sistema.

Essa estrutura também permite adicionar novas funcionalidades sem comprometer a organização dos módulos existentes.

## 13. Banco de Dados

O **EV ChargeOps** utiliza o **SQLAlchemy** como ORM (*Object-Relational Mapping*) para facilitar a comunicação entre a aplicação e o banco de dados.

A configuração foi estruturada para permitir diferentes ambientes:

* **SQLite** — utilizado em ambiente de desenvolvimento e testes locais;
* **PostgreSQL** — utilizado no ambiente de produção.

A conexão com o banco de dados é definida por meio da variável de ambiente:

```text
DATABASE_URL
```

Dessa forma, a aplicação pode alternar entre diferentes bancos de dados de acordo com o ambiente, sem a necessidade de alterar a estrutura principal do código.

Essa abordagem contribui para a **portabilidade, organização e facilidade de implantação** do sistema.

# 14. Configuração do Ambiente Local

## 14.1 Pré-requisitos

Para executar o **EV ChargeOps** localmente, é necessário possuir:

* **Python 3**
* **Git**
* **pip**

---

## 14.2 Clonar o Repositório

Clone o repositório:

```bash
git clone https://github.com/lucasgesini45-coder/ENTERPRISE-CHALLENGE-2026-GOODWE.git
```

Entre na pasta do projeto:

```bash
cd ENTERPRISE-CHALLENGE-2026-GOODWE
```

---

# 15. Criar Ambiente Virtual

### Windows

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente:

```bash
venv\Scripts\activate
```

### Linux / macOS

Crie o ambiente virtual:

```bash
python3 -m venv venv
```

Ative o ambiente:

```bash
source venv/bin/activate
```

---

# 16. Instalar Dependências

Com o ambiente virtual ativado, instale as dependências do projeto:

```bash
pip install -r requirements.txt
```

---

# 17. Executar o Backend

Para iniciar a API localmente em modo de desenvolvimento:

```bash
uvicorn main:app --reload
```

Após iniciar, a API estará disponível em:

```text
http://127.0.0.1:8000
```

A documentação interativa do FastAPI pode ser acessada em:

```text
http://127.0.0.1:8000/docs
```

---

# 18. Health Check

O backend possui um endpoint de verificação de disponibilidade:

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "online"
}
```

### Ambiente de produção

O endpoint também está disponível na aplicação publicada:

```text
https://enterprise-challenge-2026-goodwe.onrender.com/health
```

---

# 19. Dados de Teste

Para facilitar o desenvolvimento e a demonstração do protótipo, o projeto utiliza **dados de teste** para representar sessões de recarga e utilização dos carregadores.

O script responsável pela geração dessas sessões é:

```text
seed_sessoes.py
```

Para executá-lo:

```bash
python seed_sessoes.py
```

O script permite popular o banco de dados com **sessões históricas de recarga associadas aos carregadores cadastrados**, facilitando os testes das funcionalidades de consumo, dashboard e análise de dados.

---

# 20. API

A API do **EV ChargeOps** foi desenvolvida com **FastAPI**, que disponibiliza automaticamente uma documentação interativa dos endpoints.

Após iniciar o backend, acesse:

```text
http://127.0.0.1:8000/docs
```

Por meio da documentação, é possível consultar os endpoints disponíveis e realizar requisições diretamente pela interface do Swagger.

### Principais recursos da API

```text
Autenticação
Usuários
Carregadores
Sessões
Consumo
Dashboard
Integração GoodWe
Inteligência Artificial
RFID
Assistente de IA
```

A organização modular da API permite que cada recurso possua suas próprias rotas, serviços e schemas, facilitando a manutenção e a expansão do sistema.

# 21. Deploy

O **EV ChargeOps** foi estruturado com frontend e backend independentes, permitindo que cada camada seja implantada e evolua de forma separada.

## Backend

O backend está hospedado na plataforma **Render**.

**URL da API:**

```text
https://enterprise-challenge-2026-goodwe.onrender.com
```

**Health Check:**

```text
https://enterprise-challenge-2026-goodwe.onrender.com/health
```

## Banco de Dados

O ambiente de produção utiliza **PostgreSQL**, hospedado no Render e integrado ao backend da aplicação.

## Frontend

O frontend está hospedado na **Vercel**.

A URL definitiva pode ser adicionada ao projeto após a definição do domínio utilizado:

```text
FRONTEND_URL
```

---

# 22. Decisões Técnicas

## FastAPI

O **FastAPI** foi escolhido para o desenvolvimento do backend devido à sua facilidade para criação de APIs REST, alto desempenho e geração automática de documentação.

A documentação através do **Swagger UI** facilita o desenvolvimento, testes e apresentação dos endpoints da aplicação.

## SQLAlchemy

O **SQLAlchemy** foi utilizado como ORM (*Object-Relational Mapping*) para facilitar a comunicação entre a aplicação Python e o banco de dados.

A utilização de ORM também contribui para a manutenção e evolução da estrutura de dados.

## PostgreSQL

O **PostgreSQL** foi escolhido para o ambiente de produção por ser um banco de dados relacional robusto, confiável e adequado para o armazenamento dos dados estruturados da aplicação.

## SQLite

O **SQLite** é utilizado como alternativa para desenvolvimento e testes locais.

Essa abordagem permite executar o projeto sem a necessidade de configurar um servidor de banco de dados local.

## JWT

O sistema utiliza **JWT (JSON Web Token)** para autenticação.

Os tokens são utilizados para validar usuários autenticados e proteger os endpoints que exigem autorização.

## Separação em Camadas

A aplicação foi organizada em diferentes camadas:

```text
routes/
schemas/
services/
database/
ia/
```

Essa divisão promove a **separação de responsabilidades**, facilitando a manutenção, testes e evolução do código.

---

# 23. Inteligência Artificial Aplicada

A **Inteligência Artificial** foi incorporada ao EV ChargeOps como uma camada de análise dos dados relacionados às sessões e ao consumo dos carregadores.

A arquitetura considera diferentes aplicações de IA:

```text
Dados históricos
       │
       ▼
┌──────────────────────┐
│ Inteligência Artificial │
└──────────┬───────────┘
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
 Previsão Anomalias Indicadores
```

A camada de IA utiliza dados de consumo e sessões para gerar informações que podem auxiliar na **gestão da infraestrutura, identificação de comportamentos fora do padrão e análise da demanda**.

Entre as funcionalidades implementadas estão:

* **Previsão de consumo;**
* **Detecção de anomalias;**
* **Análise dos dados de utilização;**
* **Assistente de IA.**

---

# 24. Integração com GoodWe

A arquitetura do **EV ChargeOps** foi planejada considerando a integração com o ecossistema de energia e carregamento da **GoodWe**.

O projeto também considera possibilidades de evolução da integração com equipamentos e sistemas externos.

Entre os conceitos considerados estão:

* **Integração com sistemas GoodWe;**
* **Monitoramento energético;**
* **Dados de carregamento;**
* **Integração com geração fotovoltaica;**
* **Protocolos de comunicação aplicáveis ao ecossistema de recarga, como OCPP.**

A arquitetura modular permite que novas integrações sejam adicionadas futuramente sem a necessidade de reestruturar completamente a aplicação.

---

# 25. Segurança

O projeto possui mecanismos de segurança voltados à autenticação, autorização e proteção das informações da aplicação.

Entre as medidas implementadas estão:

* **Autenticação por usuário e senha;**
* **Armazenamento de senhas utilizando hash;**
* **Autenticação baseada em JWT;**
* **Controle de acesso para operações administrativas;**
* **Separação de responsabilidades entre rotas e serviços;**
* **Utilização de variáveis de ambiente para informações de infraestrutura.**

Informações sensíveis, como credenciais e chaves de acesso, não devem ser armazenadas diretamente no código-fonte.

---

# 26. Desvios em Relação à Sprint 01

Na **Sprint 01**, o projeto estava concentrado principalmente em pesquisa, documentação, definição da arquitetura e levantamento das funcionalidades da solução.

Durante a etapa de prototipação, algumas decisões foram adaptadas para permitir a construção e validação de uma versão funcional dentro do período disponível.

## 26.1 Integrações Externas

A arquitetura foi planejada considerando integrações com equipamentos e serviços externos. Para a demonstração do protótipo, também foram utilizados **dados estruturados e dados de teste**.

Essa abordagem permitiu validar o fluxo da aplicação sem depender exclusivamente da disponibilidade de equipamentos físicos durante o desenvolvimento e apresentação.

## 26.2 Inteligência Artificial

A proposta inicial considerava diferentes possibilidades de aplicação de IA.

Na implementação do protótipo, o foco foi direcionado para:

* **Previsão de consumo;**
* **Detecção de anomalias;**
* **Análise dos dados de utilização;**
* **Assistente de IA.**

Essa abordagem permitiu demonstrar aplicações práticas de IA dentro do contexto de gestão da infraestrutura de carregamento.

## 26.3 Evolução do Controle de Usuários

A autenticação e o controle administrativo foram priorizados para estabelecer uma base funcional para a aplicação.

Funcionalidades adicionais relacionadas ao gerenciamento de usuários permanecem como pontos de evolução do projeto.

---

# 27. Evidências de Funcionamento

As evidências do funcionamento do protótipo podem ser organizadas no repositório para facilitar a avaliação das funcionalidades implementadas.

Sugestão de organização:

```text
docs/
└── evidencias/
    ├── login.png
    ├── dashboard.png
    ├── carregadores.png
    ├── sessoes.png
    ├── consumo.png
    ├── inteligencia-artificial.png
    ├── assistente-ia.png
    ├── swagger.png
    └── sistema-online.png
```

As imagens podem demonstrar as principais funcionalidades da aplicação, desde a autenticação até a utilização dos recursos de análise e IA.

---

# 28. Fluxo de Demonstração

Para demonstrar o funcionamento do sistema, recomenda-se o seguinte fluxo:

### 1. Login

Acessar a aplicação e realizar a autenticação.

### 2. Dashboard

Apresentar os principais indicadores da infraestrutura.

### 3. Carregadores

Visualizar os carregadores cadastrados e suas respectivas informações.

### 4. Sessões

Apresentar o histórico das sessões de recarga.

### 5. Consumo

Demonstrar o

# 29. Status do Projeto

O **EV ChargeOps** possui uma versão funcional com os principais módulos da solução implementados.

| Funcionalidade                                     | Status       |
| -------------------------------------------------- | ------------ |
| API FastAPI                                        | Concluído    |
| Banco de dados                                     | Concluído    |
| PostgreSQL em produção                             | Concluído    |
| Autenticação                                       | Concluído    |
| JWT                                                | Concluído    |
| Gerenciamento de usuários                          | Concluído    |
| Gerenciamento de carregadores                      | Concluído    |
| Sessões de recarga                                 | Concluído    |
| Dados de consumo                                   | Concluído    |
| Dashboard                                          | Concluído    |
| Inteligência Artificial                            | Concluído    |
| Detecção de anomalias                              | Concluído    |
| Previsão de consumo                                | Concluído    |
| Assistente de IA                                   | Concluído    |
| RFID                                               | Implementado |
| Deploy do backend                                  | Concluído    |
| Deploy do frontend                                 | Concluído    |
| Documentação Swagger                               | Concluído    |
| Cadastro completo de novos usuários pela interface | Em evolução  |
| Dashboard específico para usuário comum            | Em evolução  |

---

# 30. Próximos Passos

A evolução do **EV ChargeOps** está direcionada ao aprimoramento das funcionalidades existentes e à ampliação das integrações da plataforma.

Entre os principais próximos passos estão:

* **Evolução do dashboard** específico para usuários comuns;
* **Aperfeiçoamento do cadastro e gerenciamento de usuários**;
* **Evolução da integração com equipamentos físicos**;
* **Ampliação da integração com sistemas GoodWe**;
* **Ampliação dos recursos de Inteligência Artificial**;
* **Aprimoramento das previsões de demanda**;
* **Evolução da detecção de anomalias**;
* **Melhorias na experiência e usabilidade da plataforma**;
* **Ampliação dos relatórios gerenciais**;
* **Evolução do controle de acesso por RFID**.

# 31. Organização do Desenvolvimento

O desenvolvimento do **EV ChargeOps** foi realizado utilizando **Git e GitHub** para controle de versão e colaboração entre os integrantes da equipe.

A utilização de branches permitiu organizar o desenvolvimento de diferentes funcionalidades de forma independente, reduzindo conflitos e facilitando a integração das alterações.

A divisão das responsabilidades foi estruturada da seguinte forma:

| Integrante | Responsabilidade           |
| ---------- | -------------------------- |
| Lucas      | FastAPI e integração geral |
| Calebe     | Integração GoodWe / SEMS+  |
| Filipe     | PostgreSQL e SQLAlchemy    |
| Rafael     | Sessões de recarga         |
| Paulo      | Consumo e rateio           |

Essa organização permitiu que diferentes integrantes trabalhassem simultaneamente em módulos específicos da aplicação.

---

# 32. Processo de Desenvolvimento

Durante o desenvolvimento foram utilizados **commits frequentes** para registrar a evolução das funcionalidades, correções e melhorias realizadas no projeto.

As alterações foram organizadas por funcionalidades, permitindo acompanhar a evolução do protótipo ao longo das etapas da Sprint.

A utilização de branches também possibilitou o desenvolvimento independente de funcionalidades antes da integração ao código principal.

O fluxo de desenvolvimento foi baseado em:

```text
Desenvolvimento
      │
      ▼
Branch
      │
      ▼
Implementação
      │
      ▼
Testes
      │
      ▼
Commit
      │
      ▼
Integração
      │
      ▼
Código principal
```

---

# 33. Considerações Finais

O **EV ChargeOps** transforma o gerenciamento de uma infraestrutura compartilhada de carregamento de veículos elétricos em uma solução digital centralizada.

A plataforma reúne diferentes recursos para permitir uma gestão mais organizada e inteligente da infraestrutura:

* **Gestão de carregadores;**
* **Monitoramento de sessões;**
* **Análise de consumo;**
* **Autenticação e controle de acesso;**
* **Inteligência Artificial;**
* **RFID;**
* **API REST;**
* **Dashboard para visualização dos dados.**

O protótipo demonstra a **viabilidade técnica da solução** e estabelece uma base para futuras evoluções, incluindo integrações mais amplas com carregadores reais, sistemas GoodWe e outros serviços relacionados à infraestrutura de mobilidade elétrica.

---

# 34. Repositório

O código-fonte e a documentação do projeto estão disponíveis no repositório oficial:

[Repositório oficial — EV ChargeOps](https://github.com/lucasgesini45-coder/ENTERPRISE-CHALLENGE-2026-GOODWE?utm_source=chatgpt.com)

---

# 35. Tecnologias

As principais tecnologias utilizadas no desenvolvimento do projeto são:

```text
Python
FastAPI
SQLAlchemy
PostgreSQL
SQLite
Pydantic
JWT
Scikit-learn
NumPy
SciPy
HTML
CSS
JavaScript
Render
Vercel
Git
GitHub
```

---

# 36. Projeto Acadêmico

**Enterprise Challenge 2026**

**GoodWe × FIAP**

**Projeto:** EV ChargeOps

**Área:** Gestão inteligente de infraestrutura de recarga de veículos elétricos.

O projeto foi desenvolvido como parte do **Enterprise Challenge 2026**, unindo conhecimentos de desenvolvimento de software, bancos de dados, APIs, análise de dados e Inteligência Artificial para criação de uma solução aplicada ao contexto de mobilidade elétrica.

## Integrantes da Equipe

| Integrante                       | RM       |
| -------------------------------- | -------- |
| Lucas Ribeiro Gesini             | RM569383 |
| Calebe Gonçalves Garcia de Souza | RM568743 |
| Filipe Souza Nascimento          | RM573758 |
| Rafael De Freitas Silva          | RM570089 |
| Paulo Henrique Gonçalves Bueno   | RM570456 |
