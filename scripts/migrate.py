"""Reconstrói SQLite legado/OPS com backup e troca atômica; API deve estar parada."""
import argparse
import os
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session
from database.models import Base, Usuario, Carregador, Sessao, CartaoRFID, EventoSessao, RelatorioSEMS, TelemetriaCarregador
from scripts.backup import backup, validate


def migrate_sqlite(path, legacy_timezone='UTC'):
    path = Path(path).resolve()
    validate(path)
    source_engine = create_engine(f'sqlite:///{path}')
    inspector = inspect(source_engine)
    tables = set(inspector.get_table_names())
    expected = {table.name: {c.name for c in table.columns} for table in Base.metadata.sorted_tables}
    if all(name in tables and columns.issubset({c['name'] for c in inspector.get_columns(name)}) for name, columns in expected.items()):
        source_engine.dispose()
        return None
    source_engine.dispose()
    if not {'usuarios', 'sessoes'}.issubset(tables) or not ({'carregadores', 'chargers'} & tables):
        raise ValueError('Schema desconhecido; origem não foi alterada')
    permitted = set(expected) | {'chargers', 'sqlite_sequence'}
    if tables - permitted:
        raise ValueError('Há tabelas não reconhecidas; migração automática recusada')
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f')
    saved = backup(path, path.parent / 'backups' / f'{path.name}.{stamp}.bak')
    fd, temp_path = tempfile.mkstemp(dir=path.parent, suffix='.migrating.db')
    os.close(fd)
    target = create_engine(f'sqlite:///{temp_path}')
    try:
        Base.metadata.create_all(target)
        with sqlite3.connect(f'{saved.as_uri()}?mode=ro', uri=True) as src, Session(target) as dst:
            src.row_factory = sqlite3.Row
            def rows(table):
                return [dict(row) for row in src.execute(f'SELECT * FROM {table}')]
            def dt(value):
                if value is None:
                    return None
                result = datetime.fromisoformat(value)
                if result.tzinfo is None:
                    result = result.replace(tzinfo=ZoneInfo(legacy_timezone))
                return result.astimezone(timezone.utc).replace(tzinfo=None)
            users = rows('usuarios')
            for row in users:
                dst.add(Usuario(perfil=row.get('perfil') or 'USER', **{key: row.get(key) for key in ('id','nome','email','senha','telefone')}))
            dst.flush()
            charger_table = 'carregadores' if 'carregadores' in tables else 'chargers'
            for row in rows(charger_table):
                charger_id = row.get('id', row.get('id_charger'))
                dst.add(Carregador(id=charger_id, nome=row.get('nome') or f'Carregador {charger_id}',
                    serial_number=row.get('serial_number'), localizacao=row.get('localizacao'),
                    potencia_maxima=row.get('potencia_maxima'), status='DESCONHECIDO',
                    modelo=row.get('modelo'), latitude=row.get('latitude'), longitude=row.get('longitude'), atualizado_em=dt(row.get('atualizado_em'))))
            dst.flush()
            for row in rows('sessoes'):
                # Existing data remains pending until a final measurement is reconciled.
                dst.add(Sessao(id=row.get('id',row.get('sessao_id')),
                    usuario_id=row.get('usuario_id',row.get('user_id')),
                    carregador_id=row.get('carregador_id',row.get('charger_id')),
                    inicio=dt(row['inicio']), fim=dt(row.get('fim')),
                    consumo_kwh=row.get('consumo_kwh',row.get('energia_kwh')),
                    duracao=row.get('duracao',row.get('duracao_min')),
                    tarifa=row.get('tarifa') or 0, valor_total=row.get('valor_total'),
                    status='PENDENTE_CONCILIACAO', confirmado=False,
                    origem='MIGRACAO', ultima_medicao=dt(row.get('fim') or row['inicio']),
                    chave_operacao=row.get('chave_operacao'), solicitacao=row.get('solicitacao')))
            dst.flush()
            for model, table in ((CartaoRFID,'cartoes_rfid'),(EventoSessao,'eventos_sessao'),(RelatorioSEMS,'relatorios_sems'),(TelemetriaCarregador,'telemetria_carregador')):
                if table in tables:
                    for row in rows(table):
                        if table == 'relatorios_sems':
                            row['recebido_em'] = dt(row['recebido_em'])
                        dst.add(model(**{key:value for key,value in row.items() if key in model.__table__.columns.keys()}))
            dst.commit()
        target.dispose()
        validate(temp_path)
        with open(temp_path, 'rb') as handle:
            os.fsync(handle.fileno())
        # Refuse replacement if WAL exists: another connection may still be writing.
        if Path(str(path)+'-wal').exists():
            raise ValueError('WAL presente; pare a API e feche conexões antes da migração')
        os.replace(temp_path, path)
        return saved
    finally:
        target.dispose()
        Path(temp_path).unlink(missing_ok=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('database')
    parser.add_argument('--legacy-timezone', default='UTC')
    args = parser.parse_args()
    saved = migrate_sqlite(args.database, args.legacy_timezone)
    print('Migração concluída. Backup:', saved or 'schema já atualizado')
