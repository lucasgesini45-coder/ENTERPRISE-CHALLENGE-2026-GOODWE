"""Cópia consistente de SQLite, inclusive quando há gravações concorrentes."""
import argparse
import os
import sqlite3
from pathlib import Path


def validate(path):
    with sqlite3.connect(f"{Path(path).resolve().as_uri()}?mode=ro", uri=True) as db:
        if db.execute('PRAGMA integrity_check').fetchone()[0] != 'ok':
            raise ValueError('Banco inconsistente')
        if db.execute('PRAGMA foreign_key_check').fetchone() is not None:
            raise ValueError('Banco contém referências inválidas')


def backup(source, destination):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    if source == destination or destination.exists():
        raise ValueError('Destino já existe ou coincide com a origem')
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        with sqlite3.connect(f'{source.as_uri()}?mode=ro', uri=True) as src:
            with sqlite3.connect(destination) as dst:
                src.backup(dst)
        validate(destination)
        with open(destination, 'rb') as handle:
            os.fsync(handle.fileno())
    except BaseException:
        destination.unlink(missing_ok=True)
        raise
    return destination


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source')
    parser.add_argument('destination')
    args = parser.parse_args()
    backup(args.source, args.destination)
    print('Backup validado:', args.destination)
