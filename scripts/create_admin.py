"""Provisionamento local do administrador; não expõe cadastro público privilegiado."""
import argparse
import getpass
from database.database import initialize_database,SessionLocal
from database.models import Usuario
from services.auth_service import gerar_hash_senha

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('email')
    parser.add_argument('--nome',default='Administrador')
    args=parser.parse_args()
    password=getpass.getpass('Senha do novo administrador (mínimo 8 caracteres): ')
    if len(password)<8 or len(password)>128:
        raise SystemExit('Senha deve ter entre 8 e 128 caracteres')
    if password != getpass.getpass('Confirme a senha: '):
        raise SystemExit('Senhas diferentes')
    initialize_database()
    with SessionLocal() as db:
        if db.query(Usuario).filter_by(email=args.email).first():
            raise SystemExit('E-mail já existe; não foi alterado')
        db.add(Usuario(nome=args.nome,email=args.email,senha=gerar_hash_senha(password),perfil='ADMIN'))
        db.commit()
    print('Administrador criado.')
