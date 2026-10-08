from sqlalchemy import Column, String, Integer, ForeignKey, Float, DateTime, Boolean, Text, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    senha = Column(String)
    perfil = Column(String, nullable=False, default="USER")
    telefone = Column(String)


class Carregador(Base):
    __tablename__ = "carregadores"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    serial_number = Column(String, unique=True, index=True)
    localizacao = Column(String)
    potencia_maxima = Column(Float)
    status = Column(String, default="DESCONHECIDO")
    modelo = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    atualizado_em = Column(DateTime)


class Sessao(Base):
    __tablename__ = "sessoes"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id")
    )

    carregador_id = Column(
        Integer,
        ForeignKey("carregadores.id")
    )

    inicio = Column(DateTime, nullable=False)
    fim = Column(DateTime)

    consumo_kwh = Column(Float, default=0.0)
    duracao = Column(Float)

    tarifa = Column(Float, default=0.0)
    valor_total = Column(Float)

    status = Column(String)

    chave_operacao = Column(String(128), unique=True)
    solicitacao = Column(Text)
    ultima_medicao = Column(DateTime)
    confirmado = Column(Boolean, nullable=False, default=False)
    origem = Column(String, default="RFID")


class CartaoRFID(Base):
    __tablename__ = "cartoes_rfid"
    __table_args__ = (CheckConstraint("status IN ('ATIVO','BLOQUEADO','CANCELADO')"),)
    id = Column(Integer, primary_key=True)
    uid = Column(String(128), nullable=False, unique=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    status = Column(String, nullable=False, default="ATIVO")


class EventoSessao(Base):
    __tablename__ = "eventos_sessao"
    __table_args__ = (UniqueConstraint("sessao_id", "chave_evento"),)
    id = Column(Integer, primary_key=True)
    sessao_id = Column(Integer, ForeignKey("sessoes.id"), nullable=False)
    chave_evento = Column(String(128), nullable=False)
    dados = Column(Text, nullable=False)


class RelatorioSEMS(Base):
    __tablename__ = "relatorios_sems"
    id = Column(Integer, primary_key=True)
    sha256 = Column(String(64), nullable=False, unique=True)
    recebido_em = Column(DateTime, nullable=False)
    dados = Column(Text, nullable=False)


class TelemetriaCarregador(Base):
    __tablename__ = "telemetria_carregador"
    __table_args__ = (UniqueConstraint("carregador_id", "chave_evento"),)
    id = Column(Integer, primary_key=True)
    carregador_id = Column(Integer, ForeignKey("carregadores.id"), nullable=False)
    chave_evento = Column(String(128), nullable=False)
    dados = Column(Text, nullable=False)
