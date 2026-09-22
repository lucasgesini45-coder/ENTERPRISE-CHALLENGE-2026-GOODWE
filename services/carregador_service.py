carregadores = []


def listar_todos_carregadores():
    return carregadores


def criar_novo_carregador(carregador):
    novo_carregador = {
        "id": len(carregadores) + 1,
        **carregador.model_dump()
    }

    carregadores.append(novo_carregador)

    return novo_carregador