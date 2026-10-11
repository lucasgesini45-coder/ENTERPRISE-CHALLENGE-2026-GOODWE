"""Inicialização local com segredo persistente fora do Git."""
import argparse
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / 'data' / 'config-local.json'
KEYS = ('EV_CHARGEOPS_JWT_SECRET', 'EV_CHARGEOPS_ADMIN_USER',
        'EV_CHARGEOPS_ADMIN_PASSWORD')


def configure(path=CONFIG):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        values = {key: os.environ[key] for key in KEYS if os.environ.get(key)}
        if len(values.get('EV_CHARGEOPS_JWT_SECRET', '')) < 32:
            values['EV_CHARGEOPS_JWT_SECRET'] = secrets.token_urlsafe(48)
        try:
            fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        except FileExistsError:
            pass
        else:
            with os.fdopen(fd, 'w', encoding='utf-8') as output:
                json.dump(values, output)
                output.write('\n')
    os.chmod(path, 0o600)
    values = json.loads(path.read_text(encoding='utf-8'))
    if not isinstance(values, dict) or any(
        key not in KEYS or not isinstance(value, str)
        for key, value in values.items()
    ):
        raise ValueError('Configuração local inválida; arquivo preservado.')
    # O arquivo mantém a chave estável mesmo em terminais com exports antigos.
    if len(values.get('EV_CHARGEOPS_JWT_SECRET', '')) < 32:
        raise ValueError('Chave local inválida; arquivo preservado.')
    os.environ.update(values)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Confere configuração sem iniciar API')
    parser.add_argument('--create-admin', metavar='EMAIL', help='Cria uma nova conta administrativa')
    args = parser.parse_args()
    os.chdir(ROOT)
    try:
        configure()
    except (OSError, ValueError) as exc:
        # Não imprimir conteúdo do arquivo nem valores de credenciais.
        raise SystemExit('Não foi possível carregar a configuração local. '
                         'Confira data/config-local.json e suas permissões.') from exc
    if args.check:
        print('Configuração local pronta. Chave persistente carregada; banco não alterado.')
        return
    if args.create_admin:
        result = subprocess.run([sys.executable, '-m', 'scripts.create_admin', args.create_admin])
        raise SystemExit(result.returncode)
    print('Login: http://127.0.0.1:8000/painel/login.html', flush=True)
    import uvicorn
    uvicorn.run('main:app', host='127.0.0.1', port=8000)


if __name__ == '__main__':
    main()
