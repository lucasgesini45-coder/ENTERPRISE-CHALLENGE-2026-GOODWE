import io
from datetime import datetime, timezone

import joblib
from sqlalchemy import (
    Column,
    DateTime,
    LargeBinary,
    MetaData,
    String,
    Table,
    delete,
    insert,
    select,
)
from database.database import engine

# MetaData separado de propósito: o initialize_database() exige migração
# quando uma tabela do Base não existe no banco.
_meta = MetaData()
modelos_ia = Table(
    "modelos_ia",
    _meta,
    Column("nome", String(100), primary_key=True),
    Column("conteudo", LargeBinary, nullable=False),
    Column("atualizado_em", DateTime(timezone=True), nullable=False),
)


def salvar_modelo(objeto, nome="previsor_demanda"):
    _meta.create_all(engine)
    buffer = io.BytesIO()
    joblib.dump(objeto, buffer)
    with engine.begin() as db:
        db.execute(delete(modelos_ia).where(modelos_ia.c.nome == nome))
        db.execute(
            insert(modelos_ia).values(
                nome=nome,
                conteudo=buffer.getvalue(),
                atualizado_em=datetime.now(timezone.utc),
            )
        )


def carregar_modelo(nome="previsor_demanda"):
    _meta.create_all(engine)
    with engine.connect() as db:
        linha = db.execute(
            select(modelos_ia.c.conteudo).where(modelos_ia.c.nome == nome)
        ).fetchone()
    if linha is None:
        return None
    return joblib.load(io.BytesIO(bytes(linha[0])))
