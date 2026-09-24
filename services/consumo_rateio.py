
###Módulo responsável por:
### - Cálculo de energia consumida (kWh)
### - Rateio do consumo entre usuários
### - Cálculo do valor individual
### - Cálculo de cobrança por usuário


from dataclasses import dataclass, field


@dataclass
class SessaoConsumo:
    ## Representa uma sessão de recarga com o consumo em kWh.
    usuario: str
    consumo_kwh: float


@dataclass
class RelatorioRateio:
    ## Resultado do rateio: valor individual e cobrança por usuário.
    consumo_total_kwh: float
    tarifa_kwh: float
    valor_total: float
    detalhes: dict = field(default_factory=dict)


def calcular_consumo_kwh(leitura_inicial: float, leitura_final: float) -> float:
 
    ## Calcula o consumo em kWh a partir de duas leituras do medidor.
  
    if leitura_final < leitura_inicial:
        raise ValueError("Leitura final não pode ser menor que a leitura inicial.")
    return round(leitura_final - leitura_inicial, 3)


def consumo_total(sessoes: list[SessaoConsumo]) -> float:
    ## Soma o consumo (kWh) de uma lista de sessões.
    return round(sum(s.consumo_kwh for s in sessoes), 3)


def ratear_por_usuario(sessoes: list[SessaoConsumo]) -> dict[str, float]:
   
    ## Agrupa e soma o consumo (kWh) de cada usuário a partir das sessões.
    ## Retorna um dicionário {usuario: consumo_kwh}.
   
    rateio: dict[str, float] = {}
    for sessao in sessoes:
        rateio[sessao.usuario] = round(
            rateio.get(sessao.usuario, 0) + sessao.consumo_kwh, 3
        )
    return rateio


def calcular_valor_individual(consumo_kwh: float, tarifa_kwh: float) -> float:
    ## Calcula o valor a pagar por um usuário, dado seu consumo e a tarifa.
    return round(consumo_kwh * tarifa_kwh, 2)


def calcular_cobranca(sessoes: list[SessaoConsumo], tarifa_kwh: float) -> RelatorioRateio:

    ##Gera o relatório completo de cobrança: consumo total, valor total
    ## e o detalhamento (consumo e valor) por usuário.

    rateio = ratear_por_usuario(sessoes)
    total_kwh = consumo_total(sessoes)

    detalhes = {
        usuario: {
            "consumo_kwh": kwh,
            "valor": calcular_valor_individual(kwh, tarifa_kwh),
        }
        for usuario, kwh in rateio.items()
    }

    return RelatorioRateio(
        consumo_total_kwh=total_kwh,
        tarifa_kwh=tarifa_kwh,
        valor_total=round(total_kwh * tarifa_kwh, 2),
        detalhes=detalhes,
    )


if __name__ == "__main__":
    ## Exemplo de uso
    sessoes = [
        SessaoConsumo(usuario="Ana", consumo_kwh=calcular_consumo_kwh(100.0, 112.5)),
        SessaoConsumo(usuario="Bruno", consumo_kwh=calcular_consumo_kwh(0.0, 8.2)),
        SessaoConsumo(usuario="Ana", consumo_kwh=calcular_consumo_kwh(112.5, 120.0)),
    ]

    tarifa = 0.85  # R$ por kWh

    relatorio = calcular_cobranca(sessoes, tarifa)

    print(f"Consumo total: {relatorio.consumo_total_kwh} kWh")
    print(f"Tarifa: R$ {relatorio.tarifa_kwh}/kWh")
    print(f"Valor total: R$ {relatorio.valor_total}\n")

    print("Rateio por usuário:")
    for usuario, dados in relatorio.detalhes.items():
        print(f"  {usuario}: {dados['consumo_kwh']} kWh -> R$ {dados['valor']}")