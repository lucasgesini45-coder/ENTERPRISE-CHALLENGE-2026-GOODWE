from fastapi import HTTPException
from database.database import SessionLocal
from database.models import CartaoRFID, Usuario


def _buscar(db, cartao_id):
    cartao = db.get(CartaoRFID, cartao_id)
    if cartao is None:
        raise HTTPException(404, "Cartão RFID não encontrado")
    return cartao


def _usuario(db, usuario_id):
    if usuario_id is not None and db.get(Usuario, usuario_id) is None:
        raise HTTPException(404, "Usuário não encontrado")


def listar_todos_cartoes(db):
    return db.query(CartaoRFID).order_by(CartaoRFID.id).all()


def buscar_cartao_por_id(db, cartao_id):
    return _buscar(db, cartao_id)


def criar_novo_cartao(db, cartao):
    _usuario(db, cartao.usuario_id)
    novo = CartaoRFID(**cartao.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


def associar_cartao_usuario(db, cartao_id, usuario_id):
    cartao = _buscar(db, cartao_id)
    _usuario(db, usuario_id)
    cartao.usuario_id = usuario_id
    db.commit()
    db.refresh(cartao)
    return cartao


def alterar_status_cartao(db, cartao_id, status):
    cartao = _buscar(db, cartao_id)
    if cartao.status == "CANCELADO" and status != "CANCELADO":
        raise HTTPException(409, "Cartão cancelado não pode ser reativado")
    cartao.status = status
    db.commit()
    db.refresh(cartao)
    return cartao


def desassociar_cartao(db, cartao_id):
    cartao = _buscar(db, cartao_id)
    cartao.usuario_id = None
    db.commit()
    db.refresh(cartao)
    return cartao
