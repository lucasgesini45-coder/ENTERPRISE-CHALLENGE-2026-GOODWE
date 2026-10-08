from database.models import Usuario


def listar_todos_usuarios(db):
    return db.query(Usuario).all()


def criar_novo_usuario(db, usuario):
    from services.auth_service import gerar_hash_senha
    data = usuario.model_dump()
    data["senha"] = gerar_hash_senha(data["senha"]) if data.get("senha") else None
    novo = Usuario(**data)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo
