# EV ChargeOps — contingência e recuperação

Aplicação FastAPI para cadastro de usuários, carregadores e cartões RFID, registro de sessões, importação GoodWe/SEMS, rateio, relatórios PDF e análise demonstrativa por IA.

A aplicação integra os módulos de RFID, GoodWe/SEMS, login e área pessoal com a recuperação de recargas. A integração com a `main` preserva as telas e evidências do grupo e mantém a autenticação e a confirmação de medições validadas na branch de contingência. O README do grupo está preservado em [docs/README-grupo.md](docs/README-grupo.md), e a documentação da primeira sprint em [sprint-01/README-sprint01.md](sprint-01/README-sprint01.md).

## Atualização de instalações existentes

Antes de atualizar, pare o servidor com Control+C. Após obter esta versão, com o ambiente virtual ativado, execute:

```bash
python -m scripts.migrate data/chargeops.db
bash iniciar.sh
```

Em um banco de contingência já atualizado, a migração acrescenta apenas os campos de metadata RFID que faltarem, com backup automático. Preserva os IDs, as senhas, as medições, as sessões confirmadas e seus valores. Cartões antigos sem data de cadastro continuam sem uma data inventada. Não execute seed para atualizar. Em banco novo, execute diretamente `bash iniciar.sh`.

As telas de RFID, localização de carregadores e assistente usam a mesma API do painel local. O morador consulta apenas seus próprios dados. A página de recuperação está acessível pelo menu do administrador. O dashboard geral indica todo o histórico; os filtros de período continuam nas telas de rateio e faturas.

Os exemplos em `ocpp/` e `simulator/` foram preservados como material experimental do grupo. Não são iniciados por `iniciar.sh` e ainda precisam de adaptação e homologação antes de usar o banco de cobrança ou um carregador físico.

## Executar localmente

Requer Python 3.11 ou superior. A partir da raiz:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

### Inicialização com um comando (macOS/Linux)

Depois de instalar as dependências, execute na raiz do projeto:

```bash
bash iniciar.sh
```

Na primeira execução, o inicializador guarda uma chave aleatória em `data/config-local.json`, com permissão de leitura/escrita apenas para o proprietário. Se a chave válida já estiver exportada no terminal, preserva essa chave. Nas próximas execuções carrega a mesma chave, inclusive após fechar o VS Code. A pasta `data/` é ignorada pelo Git: não compartilhe esse arquivo de configuração. O inicializador também preserva credenciais Basic já exportadas na primeira configuração, se houver. A senha de login continua armazenada como hash no banco, separada da configuração.

O comando usa `.venv` sem exigir ativação manual, mantém o banco `data/chargeops.db` e serve o painel em `http://127.0.0.1:8000/painel/login.html`. Não executa seed, migração ou redefinição de senha. Pare uma API anterior com Control+C antes de iniciar; mantenha o terminal aberto durante o uso.

Para conferir a configuração sem iniciar a API ou alterar o banco:

```bash
bash iniciar.sh --check
```

### Testes em outro computador do grupo

Cada integrante instala as dependências e cria sua própria conta administrativa no banco local novo:

```bash
bash iniciar.sh --create-admin administrador@example.com
bash iniciar.sh
```

Substitua o e-mail pelo escolhido para os testes. O primeiro comando solicita e confirma a senha sem exibi-la. Se o e-mail já existir, recusa a alteração. Senhas redefinidas e cadastros no Mac de um integrante não são enviados pelo Git. Cada instalação possui sua própria chave e seu próprio banco. `127.0.0.1` permite acesso somente no computador que iniciou a API.

Roteiro de conferência: entrar; cadastrar usuário, carregador e cartão ativo associado; registrar início e encerramento com medição verificada; conferir sessão concluída, consumo e valor no painel; conferir rateio no período e baixar o PDF. Para demonstrar IA, use ao menos três sessões concluídas para previsão e quatro para detecção de anomalias; os resultados com poucos registros são demonstrativos. Na recuperação, conferir a fila e arquivar somente tentativas revisadas, exportando uma cópia antes. Validar hardware requer testes próprios descritos em Limites operacionais.

### Inicialização manual (alternativa)

Configure `EV_CHARGEOPS_ADMIN_PASSWORD` para o acesso administrativo inicial e `EV_CHARGEOPS_JWT_SECRET` com um segredo aleatório persistente de pelo menos 32 caracteres para login. Use variáveis de ambiente; não coloque segredos no Git. A execução direta por Uvicorn não carrega `.env` nem `data/config-local.json` automaticamente; para a configuração persistente acima, use `bash iniciar.sh`.

```bash
export EV_CHARGEOPS_ADMIN_USER=admin
export EV_CHARGEOPS_ADMIN_PASSWORD='SUBSTITUA-POR-UMA-SENHA-FORTE'
export EV_CHARGEOPS_JWT_SECRET='SUBSTITUA-POR-UM-SEGREDO-ALEATORIO-DE-32-OU-MAIS-CARACTERES'
python -m scripts.create_admin administrador@example.com --nome Administrador
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

O comando de provisionamento pede a senha sem exibi-la. Não executa promoção silenciosa de uma conta existente. Para acesso remoto, configure HTTPS no proxy. O acesso Basic é uma alternativa de provisionamento administrativo; remova a variável de senha Basic quando as contas administrativas estiverem prontas.

- Painel: http://127.0.0.1:8000/painel/
- Login: http://127.0.0.1:8000/painel/login.html
- Cadastro pessoal: http://127.0.0.1:8000/painel/cadastro.html
- Cartões: http://127.0.0.1:8000/cartoes/manutencao
- Recuperação: http://127.0.0.1:8000/painel/contingencia.html
- Documentação da API: http://127.0.0.1:8000/docs

## Configuração

| Variável | Finalidade / padrão |
|---|---|
| `DATABASE_URL` | `sqlite:///./data/chargeops.db`; use armazenamento persistente |
| `EV_CHARGEOPS_ADMIN_USER` | Usuário Basic de provisionamento; padrão `admin` |
| `EV_CHARGEOPS_ADMIN_PASSWORD` | Sem padrão; Basic indisponível quando ausente |
| `EV_CHARGEOPS_JWT_SECRET` | Segredo persistente de assinatura; mínimo 32 caracteres |
| `TELEMETRY_MAX_AGE_SECONDS` | Idade máxima da telemetria; padrão `300`, use inteiro positivo |
| `GOODWE_CSV_TIMEZONE` | Fuso das datas sem offset do CSV de sessões; `America/Sao_Paulo` |
| `EV_CHARGEOPS_DEMO` | `1` permite o seed; somente em banco dedicado de demonstração |

O frontend é servido pela API na mesma origem, sem CORS irrestrito. Tokens de login ficam em `sessionStorage`; permissões são verificadas pelo backend. O cadastro público sempre cria `USER`. Usuários consultam apenas suas sessões, cartões e relatórios pessoais em `/me/*`. Administração exige perfil `ADMIN` ou a credencial Basic configurada.

Senhas novas usam PBKDF2-SHA256 com salt aleatório e 600.000 iterações. Hashes bcrypt anteriores podem ser verificados; hashes SHA256 de antigos seeds exigem redefinição. A alteração de senha revoga tokens anteriores. O endpoint público de recuperação não devolve token. Sem serviço de e-mail configurado, responde `503`; um administrador pode emitir um token de uso único com validade de 15 minutos em `/auth/admin/reset-token/{id}` e entregá-lo por um canal aprovado. Não há envio automático de mensagens.

## Sessões e recuperação

`POST /sessoes/` exige usuário, carregador, cartão ativo associado, início com fuso e `chave_operacao`. O servidor persiste o início antes de responder. Repetir a mesma chave/dados devolve a mesma sessão; dados diferentes geram `409`.

```json
{
  "chave_operacao": "pedido-unico-123",
  "usuario_id": 1,
  "carregador_id": 1,
  "cartao_id": 1,
  "inicio": "2026-10-08T08:00:00-03:00",
  "tarifa": 0.95
}
```

`POST /sessoes/{id}/medicoes` recebe consumo acumulado desde o início da sessão, não o contador vitalício do equipamento. O gateway deve calcular esse delta e manter uma fila durável própria.

```json
{
  "chave_evento": "medicao-unica-456",
  "instante": "2026-10-08T09:00:00-03:00",
  "consumo_kwh": 4.5,
  "encerrar": true
}
```

Medições e encerramento são idempotentes. Consumo regressivo ou horário anterior é rejeitado. Sessões sem leitura recente ficam `PENDENTE_CONCILIACAO`, preservando consumo e sem inventar um fim. O monitor verifica isso a cada 30 segundos, inclusive após reinício. O endpoint `PATCH /sessoes/{id}/pendente` permite registrar a perda de confirmação imediatamente.

O encerramento verificado calcula duração e valor com arredondamento decimal. Rateio e relatórios de cobrança excluem sessões não confirmadas, sem usuário ou sem valores. A antiga finalização por consumo na query responde `409` para impedir contornar a conciliação. Os relatórios de fatura têm identificador determinístico para o mesmo conjunto de sessões; não são uma integração de pagamentos.

## Telemetria e GoodWe

`POST /carregadores/{id}/telemetria` recebe `chave_evento`, `instante` com fuso, `status` (`DISPONIVEL`, `EM_USO`, `FALHA`) e `potencia_kw`. Guarda cada evento, rejeita reutilização conflitante da chave e não deixa uma leitura antiga substituir uma mais recente. Sem telemetria recente, a consulta retorna `DESCONHECIDO`, com a última atualização conhecida.

- `/goodwe/importar-csv`: CSV de sessões com colunas `EV Charger SN`, `Start Time`, `End Time`, `Charged Energy`. Importação por linha, com resultados individuais; sessões ficam pendentes para identificação e conferência.
- `/goodwe/importar-relatorio`: relatório agregado SEMS operacional/estatístico. Guarda o documento interpretado e seu hash, evita duplicações e não cria cobrança por morador.
- `/goodwe/relatorios`: consulta os 100 relatórios mais recentes.

Uploads têm limite de 5 MB e usam temporários únicos. Valores inválidos, negativos de consumo e não finitos são rejeitados. Relatórios históricos não indicam a disponibilidade atual do carregador. Confirme a unidade e o significado do indicador no equipamento antes de conciliar consumo.

## IA opcional

```bash
python -m pip install -r requirements-ia.txt
```

O núcleo da API inicia sem scikit-learn. Falta de biblioteca/histórico é retornada como análise indisponível, não como ausência comprovada de anomalias. A IA usa sessões confirmadas e não é necessária para autorização ou recuperação. Os componentes legados de treinamento usam escrita atômica dos arquivos e só substituem o modelo em memória após treinamento bem-sucedido. Nunca carregue arquivos joblib de origem não confiável.

## Banco existente, backup e testes

A aplicação cria um banco novo. Um schema anterior incompatível é recusado com instrução de migração; não é alterado automaticamente durante a inicialização.

```bash
# API parada: converter o banco legado/OPS, preservando um backup.
python -m scripts.migrate caminho/banco.db --legacy-timezone America/Sao_Paulo

# Backup consistente e verificado.
python -m scripts.backup data/chargeops.db backups/chargeops-20261008.db

# Restauração para um caminho livre, antes de trocar DATABASE_URL.
python -m scripts.restore backups/chargeops-20261008.db data/restaurado.db

python -m pip install -r requirements-dev.txt
python -m pytest -q
node --test tests/test_frontend.cjs
```

A migração SQLite preserva IDs, usuários, cartões disponíveis e consumo. Registros anteriores ficam pendentes de conciliação. Ela recusa tabelas não reconhecidas, valida integridade e referências, faz backup e só troca o arquivo após validar a nova cópia. Informe o fuso que os registros antigos realmente usavam. A restauração recusa sobrescrever um destino existente.

PostgreSQL pode ser configurado com um driver SQLAlchemy instalado separadamente. A migração fornecida e os testes de recuperação foram realizados em SQLite; bancos de outro tipo exigem migração e teste próprios antes de uso.

Veja [o procedimento de contingência](docs/contingencia.md) e [o resumo da integração](docs/alteracoes.md).

## Limites operacionais

Não foi validado controle físico, funcionamento offline do firmware, proteção elétrica, fila local do gateway, comunicação com API oficial GoodWe nem failover de infraestrutura. O código oferece registros duráveis e conciliação; continuar ou interromper a energia depende do equipamento. Valide a branch em homologação e teste perda de comunicação com o carregador real antes de substituir uma versão em operação.
