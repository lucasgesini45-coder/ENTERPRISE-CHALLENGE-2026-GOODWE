from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import CartaoRFID, Usuario
from schemas.rfid import RFIDCreate, RFIDStatusUpdate
from services.auth_service import obter_usuario_admin, obter_usuario_atual
from services.cartao_service import criar_novo_cartao, alterar_status_cartao

router = APIRouter(prefix="/rfid", tags=["RFID"])


def card_data(card):
    return {"id": card.id, "codigo": card.codigo or f"RFID-{card.id:04d}",
            "uid": card.uid, "usuario_id": card.usuario_id, "status": card.status,
            "data_cadastro": card.data_cadastro}


@router.get("/")
def list_cards(db: Session = Depends(get_db), admin=Depends(obter_usuario_admin)):
    rows = db.query(CartaoRFID, Usuario).outerjoin(Usuario, CartaoRFID.usuario_id == Usuario.id).order_by(CartaoRFID.id.desc()).all()
    return {"cartoes": [{**card_data(card), "usuario": user.nome if user else "Não associado",
                         "email": user.email if user else None, "perfil": user.perfil if user else None}
                        for card, user in rows]}


@router.get("/meu")
def my_card(db: Session = Depends(get_db), user=Depends(obter_usuario_atual)):
    card = db.query(CartaoRFID).filter_by(usuario_id=user.id).order_by(CartaoRFID.id.desc()).first()
    return {"cartao": card_data(card) if card else None}


@router.post("/", status_code=201)
def create_card(body: RFIDCreate, db: Session = Depends(get_db), admin=Depends(obter_usuario_admin)):
    return card_data(criar_novo_cartao(db, body))


@router.put("/{card_id}/status")
def update_status(card_id: int, body: RFIDStatusUpdate, db: Session = Depends(get_db), admin=Depends(obter_usuario_admin)):
    card = alterar_status_cartao(db, card_id, body.status)
    return {"mensagem": "Status do cartão atualizado", "cartao": card_data(card)}
