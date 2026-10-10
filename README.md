# EV ChargeOps

## Enterprise Challenge 2026 — GoodWe × FIAP

O **EV ChargeOps** é uma plataforma para gestão inteligente de infraestruturas compartilhadas de recarga de veículos elétricos.

O projeto foi desenvolvido para o **Enterprise Challenge 2026**, em parceria com a **GoodWe**, com o objetivo de transformar dados de recarga em informações úteis para operação, monitoramento, controle de consumo, controle de acesso, análise de desempenho e apoio à tomada de decisão.

---

# 1. Sobre o projeto

Infraestruturas de recarga compartilhada, como as presentes em condomínios, empresas e instituições de ensino, apresentam desafios relacionados ao controle de acesso, identificação dos usuários, acompanhamento das sessões, consumo de energia, divisão dos custos e monitoramento dos carregadores.

O **EV ChargeOps** propõe uma solução centralizada para organizar essas informações e disponibilizá-las de forma clara para administradores e usuários.

A plataforma trabalha com dados de:

- Usuários;
- Carregadores;
- Sessões de recarga;
- Consumo energético;
- Valores e rateio;
- RFID;
- Indicadores operacionais;
- Dados históricos;
- Previsões;
- Detecção de anomalias;
- Assistente inteligente;
- Informações de localização dos carregadores.

---

# 2. Objetivo

O objetivo do EV ChargeOps é desenvolver uma plataforma capaz de gerenciar uma infraestrutura compartilhada de carregamento de veículos elétricos, oferecendo informações organizadas para usuários e administradores.

A solução busca permitir:

- Cadastro e gerenciamento de usuários;
- Cadastro de novos usuários pela interface;
- Autenticação e controle de acesso;
- Monitoramento dos carregadores;
- Registro das sessões de recarga;
- Controle do consumo de energia;
- Visualização de indicadores;
- Análise histórica dos dados;
- Identificação de possíveis anomalias;
- Previsão de consumo;
- Controle por RFID;
- Localização dos carregadores;
- Traçado de rota;
- Consulta de dados pelo usuário;
- Alteração de senha;
- Apoio à tomada de decisão por meio de análise de dados e Inteligência Artificial.

---

# 3. Problema

O crescimento da utilização de veículos elétricos aumenta a necessidade de uma infraestrutura de recarga organizada e monitorada.

Em ambientes compartilhados, podem surgir problemas como:

- Dificuldade para identificar quem utilizou determinado carregador;
- Falta de histórico organizado das sessões;
- Dificuldade para acompanhar o consumo individual;
- Falta de indicadores para administração da infraestrutura;
- Dificuldade para identificar comportamentos fora do padrão;
- Necessidade de maior controle operacional dos carregadores;
- Dificuldade para localizar pontos de recarga;
- Necessidade de separar funcionalidades administrativas das funcionalidades disponíveis ao usuário comum.

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
- RFID;
- Localização;
- Inteligência Artificial;
- OCPP em ambiente de protótipo.

A plataforma possui uma área administrativa para acompanhamento da operação e uma área específica para o usuário final.

---

# 5. Principais funcionalidades

## 5.1 Autenticação

O sistema possui autenticação de usuários utilizando:

- Cadastro de usuário;
- Login;
- Senha protegida por hash;
- Token JWT;
- Controle de acesso por perfil;
- Alteração de senha.

A autenticação é utilizada para controlar o acesso às funcionalidades administrativas e também às informações individuais de cada usuário.

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

O sistema também possui cadastro de novos usuários diretamente pela interface web, permitindo o fluxo:

```text
Cadastro
   │
   ▼
Login
   │
   ▼
Dashboard do usuário
```

---

## 5.3 Gerenciamento de carregadores

A plataforma permite trabalhar com informações dos carregadores disponíveis na infraestrutura.

Entre os dados utilizados estão:

- Nome;
- Localização;
- Número de série;
- Modelo;
- Potência;
- Status;
- Latitude;
- Longitude.

Os carregadores podem ser associados às sessões de recarga para geração do histórico de utilização.

No dashboard do usuário, os carregadores também podem ser visualizados em mapa e em cards individuais.

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
- Utilização dos carregadores;
- Média de consumo por sessão;
- Total gasto pelo usuário.

---

## 5.6 Dashboard administrativo

O sistema possui um dashboard administrativo para visualização dos principais indicadores da infraestrutura.

Entre os dados e recursos apresentados estão informações relacionadas a:

- Sessões;
- Consumo;
- Carregadores;
- Usuários;
- Indicadores operacionais;
- Rateio;
- RFID;
- Inteligência Artificial;
- Integrações.

---

## 5.7 Dashboard do usuário

O EV ChargeOps possui um dashboard específico para usuários comuns.

Entre os recursos disponíveis estão:

- Visualização do consumo total;
- Quantidade de sessões;
- Total gasto;
- Média de consumo por sessão;
- Últimas recargas;
- Histórico completo de sessões;
- Mapa de carregadores;
- Localização de estações;
- Traçado de rota;
- Abertura de rota no Google Maps;
- Consulta do RFID vinculado;
- Assistente EV;
- Configurações da conta;
- Consulta de nome, e-mail e telefone;
- Alteração de senha;
- Tema claro e escuro.

Os dados pessoais exibidos nas configurações são apresentados somente para consulta.

---

# 6. Inteligência Artificial

Um dos diferenciais do EV ChargeOps é a utilização de recursos de Inteligência Artificial e análise de dados aplicados às informações de recarga.

A solução possui módulos voltados para:

### Previsão de consumo

Utilização dos dados históricos para estimar padrões de consumo e auxiliar no planejamento da infraestrutura.

### Detecção de anomalias

Identificação de comportamentos que podem fugir do padrão esperado de utilização.

### Análise de padrões

Avaliação dos dados históricos para identificar comportamentos recorrentes de utilização dos carregadores.

### Apoio à tomada de decisão

As informações produzidas pela camada de análise podem auxiliar administradores na identificação de problemas e oportunidades de otimização.

---

# 7. Assistente EV

O projeto possui um módulo de **Assistente EV**, integrado à API e ao dashboard do usuário.

O assistente permite realizar consultas relacionadas aos próprios dados de recarga.

Exemplos:

- Quanto eu já gastei?
- Quanto eu consumi?
- Quantas recargas eu fiz?
- Qual foi minha última recarga?

A API disponibiliza o endpoint:

```http
POST /assistente-ia/perguntar
```

O Assistente EV trabalha dentro do contexto e dos dados disponíveis na plataforma.

---

# 8. RFID e Controle de Acesso

O projeto possui uma estrutura dedicada ao **controle de acesso por RFID**, permitindo identificar o usuário responsável pela utilização de um carregador.

A identificação é associada ao usuário e pode fazer parte da sessão de recarga, possibilitando maior controle e rastreabilidade.

### Principais funcionalidades

- Identificação do usuário por RFID;
- Associação do RFID à conta;
- Consulta do RFID pelo usuário;
- Controle de acesso aos carregadores;
- Associação do usuário à sessão;
- Organização e rastreabilidade do histórico de utilização.

---

# 9. Mapa de carregadores

O dashboard do usuário possui uma área dedicada à localização dos carregadores.

Entre os recursos implementados estão:

- Mapa interativo;
- Visualização das estações cadastradas;
- Seleção de carregadores;
- Consulta de status;
- Consulta de potência;
- Uso da localização do usuário;
- Traçado de rota;
- Cards individuais das estações;
- Abertura da localização diretamente no Google Maps.

O mapa utiliza **Leaflet** no frontend.

---

# 10. Configurações do usuário

A área de configurações permite ao usuário:

- Consultar nome;
- Consultar e-mail;
- Consultar telefone;
- Alterar a senha;
- Alternar entre tema claro e escuro.

A preferência de tema é armazenada no navegador para manter a aparência escolhida pelo usuário.

Os dados pessoais são apresentados em modo de consulta, sem edição direta.

---

# 11. Arquitetura da Solução

A arquitetura do **EV ChargeOps** foi desenvolvida de forma modular, tendo o **FastAPI** como núcleo da aplicação.

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
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
         ┌─────────┐   ┌──────────┐  ┌──────────────┐
         │ Usuários│   │ Sessões  │  │ Carregadores │
         └────┬────┘   └────┬─────┘  └──────┬───────┘
              │             │               │
              └─────────────┼───────────────┘
                            ▼
                   ┌──────────────────┐
                   │    PostgreSQL    │
                   │   Banco de Dados │
                   └────────┬─────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌──────────────────┐       ┌──────────────────┐
      │ IA / Análise     │       │ RFID / OCPP      │
      │ Previsões        │       │ Integrações      │
      │ Anomalias        │       │ experimentais    │
      └──────────────────┘       └──────────────────┘
```

### Principais componentes

- **Frontend:** interface web utilizada por administradores e usuários.
- **FastAPI:** API responsável pela comunicação entre os componentes.
- **PostgreSQL:** armazenamento dos dados em produção.
- **SQLite:** banco utilizado em desenvolvimento local.
- **IA e análise de dados:** previsão, detecção de anomalias e análise dos dados.
- **RFID:** identificação e controle de acesso.
- **OCPP:** camada experimental de comunicação com carregadores.

---

# 12. Tecnologias Utilizadas

## Backend

- **Python** — linguagem principal;
- **FastAPI** — API REST;
- **SQLAlchemy** — ORM;
- **Pydantic** — validação e estruturação;
- **JWT** — autenticação;
- **Passlib** — proteção de credenciais;
- **Uvicorn** — servidor ASGI;
- **Scikit-learn** — Machine Learning;
- **NumPy** — processamento numérico;
- **SciPy** — análise e processamento científico.

## Frontend

- **HTML** — estrutura;
- **CSS** — estilização;
- **JavaScript** — interatividade e integração com a API;
- **Leaflet** — mapa interativo.

## Banco de Dados

- **PostgreSQL** — produção;
- **SQLite** — desenvolvimento e testes locais.

## Deploy e Infraestrutura

- **Render** — backend e banco PostgreSQL;
- **Vercel** — frontend;
- **GitHub** — versionamento e colaboração;
- **Git** — controle de versão.

---

# 13. Estrutura do Projeto

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
├── ocpp/
│   └── ...
│
├── frontend/
│   ├── landing.html
│   ├── login.html
│   ├── cadastro.html
│   ├── usuario.html
│   ├── usuario.css
│   ├── usuario.js
│   ├── assets/
│   └── ...
│
├── seed_sessoes.py
├── main.py
├── requirements.txt
├── .gitignore
└── README.md
```

### Organização dos módulos

| Diretório | Responsabilidade |
|---|---|
| `database/` | Configuração do banco e modelos |
| `routes/` | Endpoints e rotas da API |
| `schemas/` | Validação e estruturação dos dados |
| `services/` | Regras de negócio |
| `ia/` | Previsões, anomalias e análise de dados |
| `ocpp/` | Comunicação OCPP em ambiente de protótipo |
| `frontend/` | Interface web e comunicação com a API |

---

# 14. Backend

O backend do **EV ChargeOps** foi desenvolvido em **Python**, utilizando **FastAPI**.

Ponto de entrada:

```text
main.py
```

A aplicação utiliza uma arquitetura modular baseada em routers.

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

---

# 15. Banco de Dados

O EV ChargeOps utiliza **SQLAlchemy** como ORM.

A configuração permite diferentes ambientes:

- **SQLite** — desenvolvimento e testes locais;
- **PostgreSQL** — produção.

A conexão é definida pela variável:

```text
DATABASE_URL
```

Essa abordagem permite alternar entre bancos sem alterar a estrutura principal do sistema.

---

# 16. Configuração do Ambiente Local

## 16.1 Pré-requisitos

- Python 3;
- Git;
- pip.

## 16.2 Clonar o repositório

```bash
git clone https://github.com/lucasgesini45-coder/ENTERPRISE-CHALLENGE-2026-GOODWE.git
cd ENTERPRISE-CHALLENGE-2026-GOODWE
```

---

# 17. Criar Ambiente Virtual

## Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

## Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

# 18. Instalar Dependências

```bash
pip install -r requirements.txt
```

---

# 19. Executar o Backend

```bash
uvicorn main:app --reload
```

API local:

```text
http://127.0.0.1:8000
```

Swagger local:

```text
http://127.0.0.1:8000/docs
```

---

# 20. Executar o Frontend

Em outro terminal:

```powershell
cd frontend
python -m http.server 5500
```

Acesse:

```text
http://localhost:5500
```

---

# 21. Health Check

Endpoint:

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "online"
}
```

Produção:

```text
https://enterprise-challenge-2026-goodwe.onrender.com/health
```

---

# 22. Dados de Teste

Para facilitar o desenvolvimento e a demonstração, o projeto utiliza dados de teste para representar sessões e utilização dos carregadores.

Script:

```text
seed_sessoes.py
```

Execução:

```bash
python seed_sessoes.py
```

Esses dados permitem testar consumo, dashboard, sessões, indicadores e módulos de análise.

---

# 23. API

A API foi desenvolvida com **FastAPI**, que disponibiliza documentação interativa pelo Swagger.

Local:

```text
http://127.0.0.1:8000/docs
```

Produção:

```text
https://enterprise-challenge-2026-goodwe.onrender.com/docs
```

### Principais recursos

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
Assistente EV
```

---

# 24. Deploy

O EV ChargeOps possui frontend e backend independentes.

## Backend

Hospedado no **Render**:

```text
https://enterprise-challenge-2026-goodwe.onrender.com
```

## Health Check

```text
https://enterprise-challenge-2026-goodwe.onrender.com/health
```

## Swagger

```text
https://enterprise-challenge-2026-goodwe.onrender.com/docs
```

## Banco de Dados

O ambiente de produção utiliza **PostgreSQL** integrado ao backend.

## Frontend

Hospedado na **Vercel**:

```text
https://chargevision.vercel.app
```

---

# 25. Decisões Técnicas

## FastAPI

Foi escolhido pela facilidade de criação de APIs REST, organização, desempenho e documentação automática via Swagger.

## SQLAlchemy

Utilizado como ORM para simplificar a comunicação entre aplicação e banco de dados.

## PostgreSQL

Utilizado em produção por ser um banco relacional robusto e adequado ao armazenamento dos dados estruturados da aplicação.

## SQLite

Utilizado em desenvolvimento e testes locais.

## JWT

Utilizado para autenticação e proteção de rotas.

## Separação em camadas

A aplicação foi organizada em:

```text
routes/
schemas/
services/
database/
ia/
frontend/
ocpp/
```

Essa divisão promove separação de responsabilidades e facilita manutenção e evolução.

---

# 26. Inteligência Artificial Aplicada

A Inteligência Artificial foi incorporada ao EV ChargeOps como uma camada de análise dos dados relacionados às sessões e ao consumo.

```text
Dados históricos
       │
       ▼
┌─────────────────────────┐
│ Inteligência Artificial │
└────────────┬────────────┘
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
  Previsão Anomalias Indicadores
```

Entre as funcionalidades implementadas estão:

- Previsão de consumo;
- Detecção de anomalias;
- Análise de utilização;
- Assistente EV.

---

# 27. Integração com GoodWe

A arquitetura do EV ChargeOps foi planejada considerando integração com o ecossistema de energia e carregamento da **GoodWe**.

Entre os conceitos considerados estão:

- Integração com sistemas GoodWe;
- Monitoramento energético;
- Dados de carregamento;
- Integração com geração fotovoltaica;
- Protocolos aplicáveis ao ecossistema de recarga;
- OCPP.

A arquitetura modular permite que futuras integrações sejam adicionadas sem necessidade de reconstruir completamente a aplicação.

---

# 28. Segurança

Entre as medidas implementadas estão:

- Autenticação por usuário e senha;
- Senhas armazenadas com hash;
- JWT;
- Controle de acesso;
- Proteção de endpoints;
- Separação de responsabilidades;
- Uso de variáveis de ambiente;
- `.gitignore` para ambientes virtuais, bancos locais e caches;
- Não armazenamento de credenciais diretamente no código.

---

# 29. Desvios em Relação à Sprint 01

Na **Sprint 01**, o projeto estava concentrado principalmente em pesquisa, documentação, definição da arquitetura, levantamento de requisitos e planejamento das funcionalidades.

Ao longo do desenvolvimento, algumas decisões foram adaptadas para permitir a entrega de um protótipo funcional dentro dos recursos disponíveis.

Os desvios não alteraram o objetivo principal do EV ChargeOps. Eles representam adaptações técnicas e evoluções realizadas durante a implementação.

## 29.1 Integração com equipamentos GoodWe

### Planejamento inicial

A proposta considerava uma integração mais direta com equipamentos, APIs e serviços da GoodWe.

### Implementação atual

A arquitetura mantém módulos preparados para integração, porém utiliza dados estruturados e simulados em partes do protótipo.

### Motivo

A equipe não possui acesso à API oficial da GoodWe nem aos equipamentos físicos necessários para executar testes em ambiente real.

### Resultado

Foi possível validar:

- Fluxo da aplicação;
- Cadastro de carregadores;
- Sessões;
- Consumo;
- Status;
- Banco de dados;
- Dashboard;
- Indicadores.

---

## 29.2 OCPP

### Planejamento inicial

A comunicação entre carregadores e sistema seria representada por protocolos aplicáveis à infraestrutura de recarga.

### Implementação atual

Foi criada uma camada experimental utilizando **OCPP**, trabalhando com cenários simulados.

### Motivo

Não houve disponibilidade de carregadores físicos compatíveis para realizar testes reais.

### Resultado

A solução demonstra a arquitetura e o fluxo de comunicação, deixando a aplicação preparada para evolução futura.

---

## 29.3 Evolução do dashboard do usuário

### Planejamento inicial

O foco inicial estava principalmente na estrutura administrativa e no gerenciamento da infraestrutura.

### Implementação atual

Foi desenvolvido um dashboard completo específico para o usuário.

Foram adicionados:

- Consumo;
- Sessões;
- Gastos;
- Média por sessão;
- Histórico;
- Mapa;
- Rotas;
- Google Maps;
- RFID;
- Assistente EV;
- Configurações;
- Alteração de senha;
- Tema claro/escuro.

### Motivo

Durante o desenvolvimento foi identificada a necessidade de separar claramente a experiência administrativa da experiência do usuário comum.

---

## 29.4 Cadastro pela interface

### Planejamento inicial

O gerenciamento de usuários era concentrado principalmente na API e na área administrativa.

### Implementação atual

O sistema passou a permitir criação de conta diretamente pelo frontend.

### Resultado

O usuário consegue realizar o fluxo completo:

```text
Cadastro → Login → Dashboard
```

---

## 29.5 RFID

### Planejamento inicial

O RFID estava previsto como forma de identificação e controle de acesso.

### Implementação atual

O RFID passou a fazer parte do fluxo da aplicação e também pode ser consultado no dashboard do usuário.

### Resultado

A funcionalidade passou a contribuir para:

- Identificação;
- Vínculo com usuário;
- Rastreabilidade;
- Controle de acesso;
- Histórico das sessões.

---

## 29.6 Inteligência Artificial

### Planejamento inicial

A Sprint 01 considerava diferentes possibilidades de uso de IA na análise da infraestrutura.

### Implementação atual

O foco foi direcionado para funcionalidades que pudessem ser demonstradas com os dados disponíveis:

- Previsão de consumo;
- Detecção de anomalias;
- Análise de utilização;
- Assistente EV.

### Motivo

Essa abordagem permitiu demonstrar aplicações práticas de análise inteligente dentro do contexto do projeto.

---

## 29.7 Uso de dados simulados

### Planejamento inicial

Parte das informações seria obtida diretamente da infraestrutura física.

### Implementação atual

Foram utilizados dados simulados e dados de teste.

### Motivo

Ausência de acesso aos carregadores reais e à API oficial da GoodWe.

### Resultado

Foi possível validar:

- Sessões;
- Consumo;
- Status;
- Indicadores;
- Histórico;
- Previsões;
- Anomalias;
- Dashboards.

---

## 29.8 Deploy

### Planejamento inicial

A Sprint 01 estava voltada principalmente à concepção e arquitetura.

### Implementação atual

A aplicação foi publicada em ambiente online:

- Frontend na Vercel;
- Backend no Render;
- PostgreSQL em produção;
- Swagger disponível online.

Isso permitiu transformar a proposta inicial em um protótipo acessível pela internet.

---

# 30. Desvios de Tecnologias em Relação à Sprint 01

Além das mudanças de escopo, algumas tecnologias e abordagens também sofreram adaptações.

| Tecnologia / conceito | Planejamento inicial | Implementação atual | Motivo do desvio |
|---|---|---|---|
| GoodWe / SEMS+ | Integração direta com serviços e equipamentos | Estrutura preparada e dados simulados | Ausência de acesso à API oficial e equipamentos |
| OCPP | Comunicação com carregadores | Camada experimental com simulação | Ausência de carregadores físicos para testes |
| Dados dos carregadores | Dados reais da infraestrutura | Dados simulados e estruturados | Falta de acesso ao ambiente físico |
| Banco de dados | Estrutura voltada ao desenvolvimento | SQLite local e PostgreSQL em produção | Separação entre desenvolvimento e produção |
| Frontend | Interface inicialmente focada no fluxo principal | Dashboard administrativo + dashboard do usuário | Evolução de escopo e usabilidade |
| Autenticação | Controle básico de acesso | JWT, cadastro web e alteração de senha | Evolução de segurança e experiência |
| RFID | Identificação prevista | RFID integrado à conta e dashboard | Expansão da funcionalidade |
| Inteligência Artificial | Análises planejadas | Previsão, anomalias e Assistente EV | Adequação aos dados disponíveis |
| Mapa | Não era foco principal | Leaflet, localização, rota e Google Maps | Evolução do dashboard do usuário |
| Deploy | Ambiente local | Render + Vercel + PostgreSQL | Necessidade de disponibilizar o protótipo |
| Interface visual | Interface funcional inicial | Tema claro/escuro e configurações | Evolução de usabilidade |
| Persistência local | Banco local para desenvolvimento | PostgreSQL para produção | Necessidade de ambiente online persistente |

Essas alterações representam adaptações técnicas necessárias para transformar a proposta inicial em uma aplicação funcional.

A arquitetura foi mantida modular para permitir que tecnologias simuladas atualmente possam ser substituídas por integrações reais futuramente.

---

# 31. Implementação do Protocolo OCPP

O EV ChargeOps possui uma implementação do protocolo **OCPP (Open Charge Point Protocol)** para estruturar a comunicação entre o sistema e carregadores de veículos elétricos.

```text
┌──────────────────────┐
│   Carregador EV      │
│    Charge Point      │
└──────────┬───────────┘
           │
           │ OCPP
           ▼
┌──────────────────────┐
│     EV ChargeOps     │
│   OCPP / Backend     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       FastAPI        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      PostgreSQL      │
└──────────────────────┘
```

## Dados utilizados no protótipo

Durante o desenvolvimento acadêmico, a implementação do OCPP utiliza **dados fictícios e simulados** para representar o comportamento dos carregadores e das sessões.

Essa abordagem foi adotada porque a equipe não possui acesso à API oficial da GoodWe nem aos equipamentos físicos necessários para uma comunicação real.

Portanto, a implementação demonstra a estrutura do protocolo dentro da arquitetura do EV ChargeOps, mas não representa uma integração oficial com a infraestrutura GoodWe.

## Funcionamento

Os dados simulados permitem testar:

- Identificação dos carregadores;
- Status;
- Início e término de sessões;
- Consumo;
- Processamento pelo backend;
- Persistência;
- Visualização no dashboard.

## Evolução futura

Com acesso à API oficial da GoodWe e/ou carregadores compatíveis, a camada poderá ser adaptada para substituir os dados simulados por dados reais.

---

# 32. Evidências de Funcionamento

As evidências podem ser organizadas no repositório:

```text
docs/
└── evidencias/
    ├── login.png
    ├── pagina_inicial.png
    ├── dashboard-admin.png
    ├── dashboard-usuario.png
    ├── carregadores.png
    ├── mapa-carregadores.png
    ├── sessoes.png
    ├── faturas.png
    ├── rfid.png
    ├── assistente-user.png
    ├── assistente-admin.png
    ├── apreseentacao.pptx
    └── video-funcionamento.mp4
```

---

# 33. Fluxo de Demonstração

Para demonstrar o funcionamento do sistema:

### 1. Landing Page

Apresentar a página inicial.

### 2. Cadastro

Criar uma nova conta.

### 3. Login

Realizar a autenticação.

### 4. Dashboard do usuário

Apresentar consumo, sessões, gastos e indicadores.

### 5. Sessões

Mostrar o histórico de recargas.

### 6. Carregadores

Visualizar os carregadores cadastrados.

### 7. Mapa

Mostrar os pontos no mapa.

### 8. Rota

Traçar rota até um carregador.

### 9. Google Maps

Abrir a localização do carregador no Google Maps.

### 10. RFID

Consultar o RFID vinculado.

### 11. Assistente EV

Realizar perguntas relacionadas às recargas.

### 12. Configurações

Mostrar os dados da conta.

### 13. Tema

Alternar entre tema claro e escuro.

### 14. Segurança

Demonstrar a alteração de senha.

### 15. Dashboard administrativo

Apresentar os recursos administrativos.

### 16. Swagger

Apresentar os endpoints da API.

---

# 34. Status do Projeto

O **EV ChargeOps** possui uma versão funcional com os principais módulos implementados.

| Funcionalidade | Status |
|---|---|
| API FastAPI | Concluído |
| Banco de dados | Concluído |
| PostgreSQL em produção | Concluído |
| SQLite para desenvolvimento | Concluído |
| Autenticação | Concluído |
| JWT | Concluído |
| Cadastro pela interface | Concluído |
| Login | Concluído |
| Alteração de senha | Concluído |
| Gerenciamento de usuários | Concluído |
| Gerenciamento de carregadores | Concluído |
| Sessões de recarga | Concluído |
| Dados de consumo | Concluído |
| Dashboard administrativo | Concluído |
| Dashboard do usuário | Concluído |
| Mapa de carregadores | Concluído |
| Traçado de rota | Concluído |
| Google Maps | Concluído |
| Configurações do usuário | Concluído |
| Tema claro/escuro | Concluído |
| Inteligência Artificial | Implementado |
| Detecção de anomalias | Implementado |
| Previsão de consumo | Implementado |
| Assistente EV | Implementado |
| RFID | Implementado |
| Deploy do backend | Concluído |
| Deploy do frontend | Concluído |
| Swagger | Concluído |
| OCPP com dados simulados | Implementado para protótipo |
| Integração oficial com equipamentos GoodWe | Evolução futura |

---

# 35. Próximos Passos

Entre os principais próximos passos estão:

- Integração com equipamentos físicos;
- Integração oficial com sistemas GoodWe;
- Evolução do OCPP para ambiente real;
- Ampliação dos recursos de análise;
- Aprimoramento das previsões;
- Evolução da detecção de anomalias;
- Relatórios gerenciais;
- Novos indicadores;
- Melhorias de acessibilidade;
- Melhorias de responsividade;
- Expansão do Assistente EV;
- Testes automatizados;
- Observabilidade e monitoramento da aplicação.

---

# 36. Organização do Desenvolvimento

O desenvolvimento foi realizado utilizando **Git e GitHub**.

A utilização de branches permitiu organizar diferentes funcionalidades de forma independente.

| Integrante | Responsabilidade |
|---|---|
| Lucas Ribeiro Gesini | FastAPI e integração geral |
| Calebe Gonçalves Garcia de Souza | Integração GoodWe / SEMS+ |
| Filipe Souza Nascimento | PostgreSQL e SQLAlchemy |
| Rafael De Freitas Silva | Sessões de recarga |
| Paulo Henrique Gonçalves Bueno | Consumo e rateio |

---

# 37. Processo de Desenvolvimento

O fluxo utilizado foi:

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

# 38. Considerações Finais

O **EV ChargeOps** transforma o gerenciamento de uma infraestrutura compartilhada de carregamento de veículos elétricos em uma solução digital centralizada.

A plataforma reúne:

- Gestão de carregadores;
- Monitoramento de sessões;
- Análise de consumo;
- Autenticação;
- Controle de acesso;
- RFID;
- Inteligência Artificial;
- API REST;
- Dashboard administrativo;
- Dashboard do usuário;
- Mapa de carregadores;
- Rotas;
- Configurações;
- Deploy em produção.

O protótipo demonstra a viabilidade técnica da solução e estabelece uma base para futuras integrações com carregadores reais, sistemas GoodWe e outros serviços relacionados à mobilidade elétrica.

---

# 39. Repositório

Código-fonte:

```text
https://github.com/lucasgesini45-coder/ENTERPRISE-CHALLENGE-2026-GOODWE
```

---

# 40. Tecnologias

```text
Python
FastAPI
SQLAlchemy
PostgreSQL
SQLite
Pydantic
JWT
Passlib
Uvicorn
Scikit-learn
NumPy
SciPy
HTML
CSS
JavaScript
Leaflet
Render
Vercel
Git
GitHub
OCPP
```

---

# 41. Projeto Acadêmico

**Enterprise Challenge 2026**

**GoodWe × FIAP**

**Projeto:** EV ChargeOps

**Área:** Gestão inteligente de infraestrutura de recarga de veículos elétricos.

O projeto foi desenvolvido como parte do **Enterprise Challenge 2026**, unindo conhecimentos de desenvolvimento de software, bancos de dados, APIs, análise de dados, Inteligência Artificial, autenticação, integração de sistemas e desenvolvimento web.

## Integrantes da Equipe

| Integrante | RM |
|---|---|
| Lucas Ribeiro Gesini | RM569383 |
| Calebe Gonçalves Garcia de Souza | RM568743 |
| Filipe Souza Nascimento | RM573758 |
| Rafael De Freitas Silva | RM570089 |
| Paulo Henrique Gonçalves Bueno | RM570456 |
