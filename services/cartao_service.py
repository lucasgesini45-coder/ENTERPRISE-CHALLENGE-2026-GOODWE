from fastapi import HTTPException

cartoes = []


def listar_todos_cartoes():
    return cartoes


def buscar_cartao_por_id(cartao_id: int):
    for cartao in cartoes:
        if cartao["id"] == cartao_id:
            return cartao
    raise HTTPException(status_code=404, detail="Cartão RFID não encontrado")


def criar_novo_cartao(cartao):
    if any(c["uid"] == cartao.uid for c in cartoes):
        raise HTTPException(status_code=409, detail="UID do cartão RFID já cadastrado")

    novo_cartao = {
        "id": len(cartoes) + 1,
        **cartao.model_dump()
    }
    cartoes.append(novo_cartao)
    return novo_cartao


def associar_cartao_usuario(cartao_id: int, usuario_id: int):
    cartao = buscar_cartao_por_id(cartao_id)
    cartao["usuario_id"] = usuario_id
    return cartao


def alterar_status_cartao(cartao_id: int, status: str):
    cartao = buscar_cartao_por_id(cartao_id)
    cartao["status"] = status
    return cartao


def desassociar_cartao(cartao_id: int):
    cartao = buscar_cartao_por_id(cartao_id)
    cartao["usuario_id"] = None
    return cartao
