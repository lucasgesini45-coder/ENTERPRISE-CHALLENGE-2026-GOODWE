# Procedimento de contingência

## Antes de operar

1. Configure banco em armazenamento persistente, credenciais externas ao Git e HTTPS.
2. Registre a frequência de backup, o tempo de recuperação aceitável e a perda máxima aceitável de dados. Ainda não foram definidos RTO/RPO para este projeto.
3. Mantenha cópias fora do servidor. O backup local fornece uma cópia consistente, mas não protege contra perda de toda a máquina.
4. Faça um teste de restauração em um caminho separado e confirme sessões, eventos, cartões e relatórios antes de usar essa cópia.
5. Integre o equipamento/gateway com chaves estáveis por sessão e medição. O gateway precisa de armazenamento durável durante a indisponibilidade da API.

## Durante uma pane

| Ocorrência | Ação |
|---|---|
| API ou banco inacessível | Não considere uma operação confirmada sem resposta bem-sucedida. Preserve os pedidos para reenvio com a mesma chave. |
| Perda de telemetria | Marque a sessão pendente. O monitor também detecta leituras antigas; não inventa consumo nem encerramento. |
| Queda de energia | Preserve a última leitura, identifique o equipamento após a volta e confirme o contador físico antes de encerrar a sessão. |
| Cartão bloqueado | Não abra nova autorização. Bloquear um cartão não envia comando físico para parar uma carga em andamento. |
| IA indisponível | Continue o registro normal; análise indisponível não significa equipamento seguro. |
| Relatório agregado disponível | Use para conferência da estação. Não associe energia de toda a estação a um morador. |

`/live` confirma que o processo responde. `/health` verifica consultas ao banco e informa sessões pendentes/sem telemetria recente. Nenhum desses endpoints comprova disponibilidade física do carregador, capacidade de escrita em disco ou saúde de toda a infraestrutura.

## Depois da recuperação

1. Verifique banco e telemetria; consulte a última leitura e o horário real.
2. Reenvie medições armazenadas, em ordem de horário, com os mesmos identificadores originais.
3. Resolva usuário e consumo antes de confirmar o fim. Sem evidência, mantenha a sessão pendente.
4. Compare o consumo medido com os registros do equipamento e com relatórios aplicáveis ao mesmo período.
5. Gere rateio somente depois da conciliação. Os registros pendentes são excluídos dos valores faturáveis.
6. Registre causa, início/fim da pane, sessões afetadas e providências em um registro de incidentes operacional.

A página `/painel/contingencia.html` preserva medições antes de enviá-las e permite reenvio manual. A fila pertence ao navegador/origem e não ao servidor; apagar dados do navegador a remove. Não troque de origem/servidor com uma fila pendente sem exportar e verificar os itens. Ela não recebe medições automaticamente do carregador.

## Exercícios de homologação

- Interrompa a API após uma medição e reinicie: a sessão, o cartão e o evento devem permanecer.
- Repita início e encerramento com as mesmas chaves: não deve haver registros duplicados.
- Envie as mesmas chaves com conteúdo diferente: deve responder `409`.
- Bloqueie o cartão e tente nova autorização: deve responder `403`.
- Interrompa a telemetria: carregador deve ficar desconhecido e sessão pendente, sem cobrança.
- Force indisponibilidade do banco: operações devem falhar explicitamente e `/health` deve responder `503`.
- Restaure o backup e reconcilie registros posteriores à cópia, usando as mesmas chaves.
- Retire scikit-learn: cadastros e sessões devem funcionar e a IA indicar indisponibilidade.
- Entre com usuário comum e tente rotas administrativas ou informações de outro morador: acesso deve ser negado pelo servidor.

Os testes automatizados cobrem os contratos de software; o exercício com equipamento físico ainda é necessário.
