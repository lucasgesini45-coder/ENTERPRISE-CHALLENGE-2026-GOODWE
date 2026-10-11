import os
from pathlib import Path
from sqlalchemy import create_engine, event, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import HTTPException
from database.models import Base

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./data/chargeops.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
engine = create_engine(DATABASE_URL, pool_pre_ping=True,
    connect_args={"check_same_thread": False, "timeout": 5} if DATABASE_URL.startswith("sqlite:") else {})
if engine.dialect.name == "sqlite":
    @event.listens_for(engine, "connect")
    def configure_sqlite(connection, _):
        connection.execute("PRAGMA foreign_keys=ON")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def initialize_database():
    if engine.dialect.name == "sqlite" and engine.url.database not in (None, ":memory:"):
        Path(engine.url.database).parent.mkdir(parents=True, exist_ok=True)
    inspector = inspect(engine)
    existing = set(inspector.get_table_names())
    if existing & {"usuarios", "carregadores", "chargers", "sessoes"}:
        for table in Base.metadata.sorted_tables:
            if table.name not in existing:
                raise RuntimeError("Banco existente requer migração: execute python -m scripts.migrate")
            found = {col["name"] for col in inspector.get_columns(table.name)}
            if not {col.name for col in table.columns}.issubset(found):
                raise RuntimeError("Schema incompatível; faça backup e execute python -m scripts.migrate")
    Base.metadata.create_all(engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Registro duplicado ou referência inválida") from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(503, "Banco indisponível; operação não confirmada") from exc
    finally:
        db.close()
