from models import base, db

# criar ou recriar db
if __name__ == "__main__":
    base.metadata.create_all(db)
    print("Tabelas criadas com sucesso!")
