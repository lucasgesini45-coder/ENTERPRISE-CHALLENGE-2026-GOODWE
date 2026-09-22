sessoes = []


def listar_todas_sessoes():
    return sessoes


def criar_nova_sessao(sessao):
    nova_sessao = {
        "id": len(sessoes) + 1,
        **sessao.model_dump()
    }

    sessoes.append(nova_sessao)

    return nova_sessao