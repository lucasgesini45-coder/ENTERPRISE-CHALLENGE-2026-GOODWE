# Alterações gerais da branch

Base: `tarefa-rfid-raphael` (`cf30f57`). Módulos integrados por arquivo, com adaptação dos contratos:

- `OPS-VERSAO-1.0` (`5b6f264`): frontend administrativo, serviços de banco, relatórios PDF, assistente e IA.
- `feature/goodwe` (`9caa782`): parser e exemplos de relatórios SEMS agregados, separados do CSV de sessões.
- `feature/login-dashboard-usuario` (`735b2fb`): páginas de login, cadastro e área pessoal. A autenticação foi revisada para remover segredo fixo, limitar permissões e impedir divulgação pública de tokens de recuperação.

A integração não copia bancos reais, caches compilados nem um servidor OCPP sem validação de equipamento. O conjunto de branches enviadas tinha modelos diferentes; esta versão usa `Usuario`, `Carregador`, `Sessao` e `CartaoRFID` no mesmo schema.

Correções principais:

- Persistência de cadastros e cartões; montagem da rota antes ausente.
- Validação de UID, associação existente, estados de cartão e cancelamento irreversível pela API.
- Autenticação administrativa e pessoal, cadastro público sem promoção a administrador e revogação de tokens após trocar senha.
- Início, medições e encerramento idempotentes; eventos duráveis e rejeição de consumo regressivo.
- Detecção de sessão sem medição recente e conciliação antes de faturar.
- Telemetria durável com data explícita; estado desconhecido quando desatualizada.
- CSV agregado separado de sessões individuais; temporários únicos, limite de upload e validação numérica.
- IA opcional e treinamento com substituição segura do modelo.
- Consultas parciais no painel, timeout em requisições, aviso de conexão e valores pendentes explícitos.
- Tela de recuperação com fila local de medições e reenvio manual.
- Backup consistente, restauração sem sobrescrita e migração SQLite preservando a origem em backup.

Incompatibilidades intencionais para impedir operações ambíguas:

- Criação de sessão exige `chave_operacao`, cartão ativo e início com fuso.
- Finalização antiga por query é recusada; use medições com `chave_evento` e `encerrar=true`.
- `/cartoes` é o cadastro administrativo único. A área pessoal consulta `/me/cartoes`.
- Sessões antigas/importadas não são faturadas automaticamente; precisam de identificação e confirmação.
- Um banco anterior incompatível deve ser migrado explicitamente com a API parada.

Sem validação nesta entrega: comunicação física/OCPP, uso offline do firmware, email de recuperação, failover de servidor, restauração de PostgreSQL e operação de cobrança/pagamentos. Não houve implantação em produção.

## Validação

- 42 testes Python de contratos, autorização, migração, backup, restauração, telemetria e reinício.
- 3 testes JavaScript da fila local e preservação de identificadores após falha de resposta/recarregamento.
- Verificação de sintaxe dos scripts JavaScript, inclusive o script HTML de cartões.
- Inicialização em banco novo, acesso às rotas e persistência após reinício em outro processo.

A execução visual em navegador não foi concluída: o navegador de testes não estava instalado e o download não ficou disponível nesta sessão. Os testes JavaScript da fila usam um DOM simulado; a revisão visual e o teste com hardware permanecem para homologação.
