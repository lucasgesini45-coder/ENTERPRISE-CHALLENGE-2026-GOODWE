from database.models import Carregador


def listar_todos_carregadores(db):
    return db.query(Carregador).all()


def criar_novo_carregador(db, carregador):
    novo = Carregador(**carregador.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo
