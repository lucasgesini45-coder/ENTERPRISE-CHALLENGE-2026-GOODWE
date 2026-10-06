from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import (
    CartaoRFID,
    Usuario
)

from schemas.rfid import (
    RFIDCreate,
    RFIDResponse,
    RFIDStatusUpdate
)

from services.auth_service import (
    obter_usuario_admin,
    obter_usuario_atual
)


router = APIRouter(
    prefix="/rfid",
    tags=["RFID"]
)


# =========================================
# LISTAR CARTÕES
# =========================================

@router.get("/")
def listar_cartoes(
    db: Session = Depends(get_db),
    usuario_admin: Usuario = Depends(
        obter_usuario_admin
    )
):

    cartoes = (
        db.query(
            CartaoRFID,
            Usuario
        )
        .join(
            Usuario,
            CartaoRFID.usuario_id == Usuario.id
        )
        .order_by(
            CartaoRFID.id.desc()
        )
        .all()
    )


    resultado = []


    for cartao, usuario in cartoes:

        resultado.append({
            "id": cartao.id,
            "uid": cartao.uid,
            "usuario_id": usuario.id,
            "usuario": usuario.nome,
            "email": usuario.email,
            "perfil": usuario.perfil,
            "status": cartao.status,
            "data_cadastro": cartao.data_cadastro
        })


    return {
        "cartoes": resultado
    }

# =========================================
# MEU CARTÃO RFID
# =========================================

@router.get("/meu")
def meu_cartao(
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(
        obter_usuario_atual
    )
):

    cartao = (
        db.query(CartaoRFID)
        .filter(
            CartaoRFID.usuario_id ==
            usuario_atual.id
        )
        .order_by(
            CartaoRFID.id.desc()
        )
        .first()
    )


    if cartao is None:

        return {
            "cartao": None
        }


    return {
        "cartao": {
            "id":
                cartao.id,

            "uid":
                cartao.uid,

            "usuario_id":
                cartao.usuario_id,

            "status":
                cartao.status,

            "data_cadastro":
                cartao.data_cadastro
        }
    }

# =========================================
# CRIAR CARTÃO
# =========================================

@router.post(
    "/",
    response_model=RFIDResponse,
    status_code=status.HTTP_201_CREATED
)
def criar_cartao(
    dados: RFIDCreate,
    db: Session = Depends(get_db),
    usuario_admin: Usuario = Depends(
        obter_usuario_admin
    )
):

    usuario = (
        db.query(Usuario)
        .filter(
            Usuario.id ==
            dados.usuario_id
        )
        .first()
    )


    if usuario is None:

        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado."
        )


    uid = dados.uid.strip()


    if not uid:

        raise HTTPException(
            status_code=400,
            detail="UID RFID é obrigatório."
        )


    status_cartao = (
        dados.status
        .strip()
        .upper()
    )


    if status_cartao not in [
        "ATIVO",
        "BLOQUEADO"
    ]:

        raise HTTPException(
            status_code=400,
            detail="Status RFID inválido."
        )


    novo_cartao = CartaoRFID(
        uid=uid,
        usuario_id=dados.usuario_id,
        status=status_cartao,
        data_cadastro=datetime.now()
    )


    try:

        db.add(
            novo_cartao
        )

        db.commit()

        db.refresh(
            novo_cartao
        )


        return novo_cartao


    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Este UID RFID já está cadastrado."
        )


# =========================================
# ALTERAR STATUS
# =========================================

@router.put(
    "/{cartao_id}/status"
)
def alterar_status_cartao(
    cartao_id: int,
    dados: RFIDStatusUpdate,
    db: Session = Depends(get_db),
    usuario_admin: Usuario = Depends(
        obter_usuario_admin
    )
):

    cartao = (
        db.query(CartaoRFID)
        .filter(
            CartaoRFID.id ==
            cartao_id
        )
        .first()
    )


    if cartao is None:

        raise HTTPException(
            status_code=404,
            detail="Cartão RFID não encontrado."
        )


    novo_status = (
        dados.status
        .strip()
        .upper()
    )


    if novo_status not in [
        "ATIVO",
        "BLOQUEADO"
    ]:

        raise HTTPException(
            status_code=400,
            detail="Status RFID inválido."
        )


    cartao.status = novo_status


    db.commit()

    db.refresh(
        cartao
    )


    return {
        "mensagem":
            "Status do cartão atualizado com sucesso.",

        "cartao": {
            "id":
                cartao.id,

            "uid":
                cartao.uid,

            "usuario_id":
                cartao.usuario_id,

            "status":
                cartao.status,

            "data_cadastro":
                cartao.data_cadastro
        }
    }