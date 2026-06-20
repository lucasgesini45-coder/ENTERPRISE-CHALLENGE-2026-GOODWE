# Funcionamento de uma Sessão de Recarga

## 1. Conexão do Veículo

O usuário conecta o veículo ao carregador.

## 2. Autenticação

O sistema identifica o usuário por RFID, aplicativo ou QR Code.

## 3. Início da Recarga

O carregador libera energia para o veículo.

## 4. Monitoramento

São registrados:

* Potência;
* Energia consumida;
* Duração;
* Status da sessão.

## 5. Encerramento

A sessão termina quando:

* O veículo é desconectado;
* A bateria atinge o nível desejado;
* O usuário encerra a operação.

# Dados Gerados

| Dado                                                                                                                         | Finalidade              |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Usuário                                                                                                                      | Identificação           |
| Horário de início                                                                                                            | Registro da sessão      |
| Horário de fim                                                                                                               | Encerramento            |
| Duração                                                                                                                      | Estatísticas e cobrança |
| Energia (kWh)                                                                                                                | Rateio                  |
| Potência (kW)                                                                                                                | Monitoramento           |
|                                                                                                                              |                         |
| Esses dados serão utilizados pelo EV ChargeOps para faturamento, análise de consumo e aplicações de Inteligência Artificial. |                         |
