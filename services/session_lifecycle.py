import json
from datetime import timezone
from fastapi import HTTPException
from sqlalchemy import text
from database.models import Sessao, Usuario, Carregador, CartaoRFID, EventoSessao
from services.consumo_service import calcular_valor_recarga


def utc(value):
    return value.astimezone(timezone.utc).replace(tzinfo=None)


def serialize(model):
    return json.dumps(model.model_dump(mode="json"), sort_keys=True, allow_nan=False)


def lock(db):
    if db.bind.dialect.name == "sqlite":
        db.execute(text("BEGIN IMMEDIATE"))


def criar(db, entrada):
    lock(db)
    payload = serialize(entrada)
    previous = db.query(Sessao).filter_by(chave_operacao=entrada.chave_operacao).first()
    if previous:
        if previous.solicitacao != payload:
            raise HTTPException(409, "Chave já usada com outros dados")
        return previous
    if not db.get(Usuario, entrada.usuario_id):
        raise HTTPException(404, "Usuário não encontrado")
    charger = db.query(Carregador).filter_by(id=entrada.carregador_id).with_for_update().first()
    if not charger:
        raise HTTPException(404, "Carregador não encontrado")
    card = db.query(CartaoRFID).filter_by(id=entrada.cartao_id).with_for_update().first()
    if not card or card.status != "ATIVO" or card.usuario_id != entrada.usuario_id:
        raise HTTPException(403, "Cartão não autorizado para este usuário")
    if db.query(Sessao).filter(Sessao.carregador_id == charger.id, Sessao.status.in_(("EM_ANDAMENTO", "PENDENTE_CONCILIACAO", "AGUARDANDO"))).first():
        raise HTTPException(409, "Carregador tem sessão ativa ou pendente")
    sessao = Sessao(usuario_id=entrada.usuario_id, carregador_id=charger.id,
        inicio=utc(entrada.inicio), tarifa=entrada.tarifa, consumo_kwh=0,
        valor_total=None, status="EM_ANDAMENTO", ultima_medicao=utc(entrada.inicio),
        chave_operacao=entrada.chave_operacao, solicitacao=payload, confirmado=False)
    db.add(sessao)
    db.commit()
    db.refresh(sessao)
    return sessao


def medir(db, sessao_id, entrada):
    lock(db)
    sessao = db.query(Sessao).filter_by(id=sessao_id).with_for_update().first()
    if not sessao:
        raise HTTPException(404, "Sessão não encontrada")
    payload = serialize(entrada)
    previous = db.query(EventoSessao).filter_by(sessao_id=sessao_id, chave_evento=entrada.chave_evento).first()
    if previous:
        if previous.dados != payload:
            raise HTTPException(409, "Chave de evento já usada com outros dados")
        return sessao
    if sessao.status == "CONCLUIDA":
        raise HTTPException(409, "Sessão já encerrada")
    instante = utc(entrada.instante)
    if instante < (sessao.ultima_medicao or sessao.inicio) or entrada.consumo_kwh < (sessao.consumo_kwh or 0):
        raise HTTPException(409, "Medição anterior ou consumo regressivo")
    sessao.consumo_kwh = entrada.consumo_kwh
    sessao.ultima_medicao = instante
    sessao.status = "EM_ANDAMENTO"
    if entrada.encerrar:
        if sessao.usuario_id is None or db.get(Usuario, sessao.usuario_id) is None:
            raise HTTPException(409, "Associe um usuário antes de confirmar a sessão")
        sessao.fim = instante
        sessao.duracao = (instante - sessao.inicio).total_seconds() / 60
        sessao.confirmado = True
        sessao.status = "CONCLUIDA"
        sessao.valor_total = calcular_valor_recarga(entrada.consumo_kwh, sessao.tarifa)
    db.add(EventoSessao(sessao_id=sessao_id, chave_evento=entrada.chave_evento, dados=payload))
    db.commit()
    db.refresh(sessao)
    return sessao


def pendente(db, sessao_id):
    lock(db)
    sessao = db.query(Sessao).filter_by(id=sessao_id).with_for_update().first()
    if not sessao:
        raise HTTPException(404, "Sessão não encontrada")
    if sessao.status != "CONCLUIDA":
        sessao.status = "PENDENTE_CONCILIACAO"
        sessao.valor_total = None
        sessao.confirmado = False
        db.commit()
        db.refresh(sessao)
    return sessao
