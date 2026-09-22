from sqlalchemy import create_engine, Column, String, Integer, ForeignKey, Float
from sqlalchemy.orm import declarative_base

# escolhi usar sqlalchemy ao inves do sqlite porque assim fica mais facil de fazer futuras manutenções
# vou usar tipagem de dados para o codigo ficar mais rapido

db = create_engine("sqlite:///banco.db")  # fazer conexao com o fastapi
base = declarative_base()


class User(base):
    __tablename__ = "usuarios"
    # todos os users criados devem seguir os seguintes parametros
    id = Column("id", Integer, primary_key=True)  # todo user vai ter seu id sendo unico
    nome = Column("nome", String)
    senha = Column("senha", String)
    email = Column(
        "email", String, nullable=False
    )  # email é obrigatório e não pode ser um valor nulo
    telefone = Column("telefone", String)


class Charger(base):
    __tablename__ = "chargers"

    id = Column(
        "id_charger", Integer, primary_key=True
    )  # todo charger vai ter seu id sendo unico
    user_id = Column("user_id", Integer, ForeignKey("usuarios.id"))
    localizacao = Column(
        "localizacao", String
    )  # onde o carregador esta (ex: estacionamento L1)
    potencia_maxima = Column(
        "potencia_maxima", Float
    )  # potencia maxima do carregador me kw
    status = Column("status", String)  # oculpado, disponivel, etc
    modelo = Column("modelo", String)  # modelo do carregador
    atualizado_em = Column(
        "atualizado_em", String
    )  # último momento em que o status foi sincronizado com a API SEMS


class Sessoes(base):
    __tablename__ = "sessoes"

    sessao_id = Column("sessao_id", Integer, primary_key=True)
    user_id = Column("user_id", Integer, ForeignKey("usuarios.id"))
    charger_id = Column("charger_id", Integer, ForeignKey("chargers.id"))
    inicio = Column("inicio", String)
    fim = Column("fim", String)
    energia_kwh = Column("energia_kwh", Float)  # corresponde ao "eChargeToday" da api
    duracao = Column("duracao", Float)  # calculo de inicio - fim
    status = Column("status", String)  # usando, concluida, interrompida
