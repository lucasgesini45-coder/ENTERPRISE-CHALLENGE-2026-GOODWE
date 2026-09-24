from sqlalchemy import Column, String, Integer, ForeignKey, Float, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    senha = Column(String)
    telefone = Column(String)


class Carregador(Base):
    __tablename__ = "carregadores"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    serial_number = Column(String, unique=True, index=True)
    localizacao = Column(String)
    potencia_maxima = Column(Float)
    status = Column(String)
    modelo = Column(String)
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
    valor_total = Column(Float, default=0.0)

    status = Column(String)