import importlib
import sqlite3
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from database.models import Base, Usuario, Carregador, CartaoRFID, Sessao, EventoSessao
from database.database import get_db
from main import app
from scripts.backup import backup
from scripts.migrate import migrate_sqlite


@pytest.fixture
def api(tmp_path, monkeypatch):
    monkeypatch.setenv('EV_CHARGEOPS_ADMIN_PASSWORD', 'test-password')
    monkeypatch.setenv('EV_CHARGEOPS_JWT_SECRET', 'x'*64)
    path = tmp_path/'api.db'
    engine = create_engine(f'sqlite:///{path}', connect_args={'check_same_thread': False, 'timeout': 5})
    @event.listens_for(engine, 'connect')
    def configure(db, _):
        db.execute('PRAGMA foreign_keys=ON')
    Base.metadata.create_all(engine)
    maker = sessionmaker(bind=engine)
    import database.database as storage
    monkeypatch.setattr(storage, "SessionLocal", maker)
    def dependency():
        from sqlalchemy.exc import IntegrityError, SQLAlchemyError
        from fastapi import HTTPException
        with maker() as db:
            try:
                yield db
            except IntegrityError:
                db.rollback()
                raise HTTPException(409, 'Duplicado')
            except SQLAlchemyError:
                db.rollback()
                raise HTTPException(503, 'Indisponível')
    app.dependency_overrides[get_db] = dependency
    with maker() as db:
        db.add(Usuario(id=1, nome='Teste', email='teste@example.com'))
        db.add(Carregador(id=1, nome='GW', serial_number='GW1'))
        db.commit()
        db.add(CartaoRFID(id=1, uid='RFID-1', usuario_id=1, status='ATIVO'))
        db.commit()
    client = TestClient(app)
    client.auth = ('admin', 'test-password')
    client.path, client.maker = path, maker
    yield client
    app.dependency_overrides.clear()
    engine.dispose()


def start(api, **changes):
    data = {'chave_operacao':'start-1','usuario_id':1,'carregador_id':1,'cartao_id':1,
        'inicio':'2026-10-08T10:00:00Z','tarifa':0.95}
    return api.post('/sessoes/', json={**data, **changes})


def measure(api, **changes):
    data = {'chave_evento':'read-1','instante':'2026-10-08T10:30:00Z','consumo_kwh':3.5}
    return api.post('/sessoes/1/medicoes', json={**data, **changes})


def test_card_persists_across_connections_and_duplicate(api):
    r=api.post('/cartoes/', json={'uid':'NEW','usuario_id':1})
    assert r.status_code==200
    with api.maker() as db:
        assert db.get(CartaoRFID, r.json()['id']).uid=='NEW'
    assert api.post('/cartoes/', json={'uid':'NEW'}).status_code==409
    assert api.patch('/cartoes/1/associar',json={'usuario_id':99}).status_code==404


def test_card_validation_and_cancelled_stays_cancelled(api):
    assert api.post('/cartoes/',json={'uid':'   '}).status_code==422
    assert api.patch('/cartoes/1/status',json={'status':'CANCELADO'}).status_code==200
    assert api.patch('/cartoes/1/status',json={'status':'ATIVO'}).status_code==409
    assert start(api).status_code==403


def test_auth_is_required_and_unconfigured_is_closed(api,monkeypatch):
    api.auth=None
    assert api.get('/cartoes/').status_code==401
    assert api.get('/sessoes/').status_code==401
    monkeypatch.delenv('EV_CHARGEOPS_ADMIN_PASSWORD')
    assert api.get('/usuarios/').status_code==503


def test_session_replay_restart_and_final_measurement(api):
    first=start(api)
    assert first.status_code==200
    assert start(api).json()['id']==first.json()['id']
    assert start(api,tarifa=1).status_code==409
    assert start(api,chave_operacao='second').status_code==409
    assert measure(api).status_code==200
    assert measure(api).status_code==200
    assert measure(api,consumo_kwh=4).status_code==409
    api.maker.kw['bind'].dispose()  # simulate reconnection after process loss
    data=api.get('/sessoes/').json()['sessoes'][0]
    assert data['consumo_kwh']==3.5
    assert data['valor_total'] is None
    assert api.patch('/sessoes/1/pendente').json()['status']=='PENDENTE_CONCILIACAO'
    r=measure(api,chave_evento='final',instante='2026-10-08T11:00:00Z',consumo_kwh=4.5,encerrar=True)
    assert r.json()['valor_total']==4.28
    assert r.json()['duracao']==60
    assert r.json()['confirmado'] is True
    assert measure(api,chave_evento='final',instante='2026-10-08T11:00:00Z',consumo_kwh=4.5,encerrar=True).status_code==200
    assert measure(api,chave_evento='after').status_code==409
    with api.maker() as db:
        assert db.query(Sessao).count()==1
        assert db.query(EventoSessao).count()==2


def test_regressive_measurement_and_naive_time_rejected(api):
    assert start(api,inicio='2026-10-08T10:00:00').status_code==422
    assert start(api).status_code==200
    assert measure(api).status_code==200
    assert measure(api,chave_evento='back',consumo_kwh=2).status_code==409
    assert measure(api,chave_evento='backtime',instante='2026-10-08T09:00:00Z',consumo_kwh=4).status_code==409
    assert measure(api,chave_evento='negative',consumo_kwh=-1).status_code==422


def test_concurrent_replays_do_not_duplicate(api):
    from schemas.sessao import SessaoCreate
    from services.session_lifecycle import criar
    payload=SessaoCreate(chave_operacao='parallel',usuario_id=1,carregador_id=1,cartao_id=1,inicio='2026-10-08T10:00:00Z')
    def call(_):
        with api.maker() as db:
            return criar(db,payload).id
    with ThreadPoolExecutor(max_workers=4) as executor:
        assert len(set(executor.map(call,range(8))))==1


def test_pending_not_billed_and_invoice_id_reproducible(api):
    start(api)
    assert api.get('/consumo/rateio').json()['valor_total']==0
    measure(api,encerrar=True)
    one=api.get('/consumo/fatura-usuario/1').json()
    two=api.get('/consumo/fatura-usuario/1').json()
    assert one['numero_fatura']==two['numero_fatura']
    assert one['valor_total']==3.33
    assert api.get('/consumo/fatura-usuario/1/pdf').content.startswith(b'%PDF')


def test_backup_restore_preserves_cards_events_and_sessions(api,tmp_path):
    start(api);measure(api)
    saved=backup(api.path,tmp_path/'saved.db')
    restored=backup(saved,tmp_path/'restored.db')
    with sqlite3.connect(restored) as db:
        assert db.execute('SELECT consumo_kwh FROM sessoes').fetchone()[0]==3.5
        assert db.execute('SELECT count(*) FROM eventos_sessao').fetchone()[0]==1
        assert db.execute('SELECT uid FROM cartoes_rfid').fetchone()[0]=='RFID-1'
    with pytest.raises(ValueError):backup(api.path,saved)


def test_health_detects_database_failure(api):
    assert api.get('/health').status_code==200
    with api.maker() as db:
        from sqlalchemy import text
        db.execute(text('DROP TABLE eventos_sessao'));db.commit()
    assert api.get('/health').status_code==503
    assert api.get('/live').status_code==200


def test_aggregate_report_deduplicated_never_billed(api):
    raw=Path('dados/sems_exemplo/relatorio_estatistico_exemplo.csv').read_bytes()
    one=api.post('/goodwe/importar-relatorio',files={'arquivo':('report.csv',raw,'text/csv')})
    assert one.status_code==200,one.text
    assert one.json()['faturavel'] is False
    assert one.json()['status_atual']=='DESCONHECIDO'
    two=api.post('/goodwe/importar-relatorio',files={'arquivo':('other.csv',raw,'text/csv')})
    assert two.json()['duplicado'] is True
    assert api.get('/sessoes/').json()['sessoes']==[]


def test_session_csv_deduplicated_pending_and_nan_rejected(api):
    raw='EV Charger SN,Start Time,End Time,Charged Energy\nGW1,10/08/2026 08:00,10/08/2026 09:00,4.5\n'
    one=api.post('/goodwe/importar-csv',files={'arquivo':('../../report.csv',raw,'text/csv')})
    assert one.status_code==200,one.text
    assert one.json()['importadas']==1
    assert api.get('/sessoes/').json()['sessoes'][0]['status']=='PENDENTE_CONCILIACAO'
    assert api.get('/consumo/rateio').json()['valor_total']==0
    assert api.post('/goodwe/importar-csv',files={'arquivo':('report.csv',raw,'text/csv')}).json()['duplicadas']==1
    invalid=raw.replace(',4.5',',NaN')
    assert api.post('/goodwe/importar-csv',files={'arquivo':('bad.csv',invalid,'text/csv')}).json()['erros']==1


def test_sems_numeric_validation_and_unknown():
    from services.sems_service import obter_status,carregar_relatorio_sems
    from services.sems_csv_service import _numero
    assert obter_status({})=='DESCONHECIDO'
    for value in ('NaN','inf','abc'):
        with pytest.raises(ValueError):_numero(value)
    assert carregar_relatorio_sems('dados/sems_exemplo/relatorio_operacional_exemplo.csv')['data_relatorio']


def test_migration_old_schema_preserves_original_backup(tmp_path):
    path=tmp_path/'legacy.db'
    with sqlite3.connect(path) as db:
        db.executescript("CREATE TABLE usuarios(id INTEGER PRIMARY KEY,nome TEXT,email TEXT,senha TEXT,telefone TEXT); CREATE TABLE chargers(id_charger INTEGER PRIMARY KEY,localizacao TEXT); CREATE TABLE sessoes(sessao_id INTEGER PRIMARY KEY,user_id INTEGER,charger_id INTEGER,inicio TEXT,fim TEXT,energia_kwh REAL,duracao_min REAL,status TEXT);")
        db.execute("INSERT INTO usuarios VALUES(1,'Teste','test@example.com',NULL,NULL)")
        db.execute("INSERT INTO chargers VALUES(1,'L1')")
        db.execute("INSERT INTO sessoes VALUES(1,1,1,'2026-10-08 10:00:00','2026-10-08 11:00:00',4.5,60,'concluida')")
    saved=migrate_sqlite(path)
    assert saved.exists()
    with sqlite3.connect(path) as db:
        assert db.execute('SELECT consumo_kwh,confirmado,status FROM sessoes').fetchone()==(4.5,0,'PENDENTE_CONCILIACAO')
    assert migrate_sqlite(path) is None


def test_migration_failure_keeps_source(tmp_path):
    path=tmp_path/'unknown.db'
    with sqlite3.connect(path) as db:db.execute('CREATE TABLE alien(id INTEGER)')
    before=path.read_bytes()
    with pytest.raises(ValueError):migrate_sqlite(path)
    assert path.read_bytes()==before


def test_optional_ml_failure_does_not_break_sessions(api,monkeypatch):
    import builtins
    original=builtins.__import__
    def unavailable(name,*args,**kwargs):
        if name.startswith('sklearn'):raise ImportError('missing')
        return original(name,*args,**kwargs)
    monkeypatch.setattr(builtins,'__import__',unavailable)
    assert api.get('/ia/previsao-consumo').json()['estado']=='INDISPONIVEL'
    assert api.get('/sessoes/').status_code==200


def test_upload_limit(api):
    assert api.post('/goodwe/importar-csv',files={'arquivo':('large.csv',b'x'*(5*1024*1024+1),'text/csv')}).status_code==413


def test_telemetry_fresh_stale_reordered_and_deduplicated(api):
    assert api.get('/carregadores/').json()['carregadores'][0]['status']=='DESCONHECIDO'
    now=datetime.now(timezone.utc)
    body={'chave_evento':'telemetry1','instante':now.isoformat(),'status':'DISPONIVEL','potencia_kw':0}
    assert api.post('/carregadores/1/telemetria',json=body).json()['telemetria_recente'] is True
    assert api.post('/carregadores/1/telemetria',json=body).status_code==200
    assert api.post('/carregadores/1/telemetria',json={**body,'status':'FALHA'}).status_code==409
    from datetime import timedelta
    older={**body,'chave_evento':'old','instante':(now-timedelta(hours=1)).isoformat(),'status':'FALHA'}
    assert api.post('/carregadores/1/telemetria',json=older).json()['status']=='DISPONIVEL'
    with api.maker() as db:
        charger=db.get(Carregador,1)
        charger.atualizado_em=now.replace(tzinfo=None)-timedelta(hours=1)
        db.commit()
    assert api.get('/carregadores/').json()['carregadores'][0]['status']=='DESCONHECIDO'


def test_stale_sessions_preserve_consumption_and_require_reconciliation(api):
    from services.recovery import reconcile_stale_sessions
    start(api);measure(api)
    with api.maker() as db:
        sessao=db.get(Sessao,1)
        sessao.ultima_medicao=datetime(2000,1,1)
        db.commit()
    assert reconcile_stale_sessions(api.maker)==1
    row=api.get('/sessoes/').json()['sessoes'][0]
    assert row['status']=='PENDENTE_CONCILIACAO'
    assert row['consumo_kwh']==3.5
    assert row['fim'] is None
    assert row['valor_total'] is None


def test_actual_process_restart_reads_same_records(api):
    import os, subprocess, json
    start(api);measure(api)
    env={**os.environ,'DATABASE_URL':f'sqlite:///{api.path}','EV_CHARGEOPS_ADMIN_PASSWORD':'restart-test'}
    code='''from main import app
from fastapi.testclient import TestClient
import json
with TestClient(app) as client:
    client.auth=('admin','restart-test')
    print(json.dumps({'health':client.get('/health').status_code,'cards':len(client.get('/cartoes/').json()['cartoes']),'kwh':client.get('/sessoes/').json()['sessoes'][0]['consumo_kwh']}))
'''
    result=subprocess.run(['python','-c',code],env=env,capture_output=True,text=True,check=True)
    assert json.loads(result.stdout)=={'health':200,'cards':1,'kwh':3.5}


def test_legacy_finalize_cannot_bypass_confirmation(api):
    start(api)
    assert api.put('/sessoes/1/finalizar?consumo_kwh=10').status_code==409
    assert api.get('/consumo/rateio').json()['valor_total']==0


def test_new_database_initializes_with_all_routes(tmp_path):
    import os,subprocess,json
    env={**os.environ,'DATABASE_URL':f'sqlite:///{tmp_path}/new.db','EV_CHARGEOPS_ADMIN_PASSWORD':'startup-test'}
    code='''from main import app
from fastapi.testclient import TestClient
import json
with TestClient(app) as client:
    client.auth=('admin','startup-test')
    paths=['/health','/sessoes/','/usuarios/','/carregadores/','/cartoes/','/dashboard/resumo','/consumo/rateio','/goodwe/relatorios','/ia/indicadores','/painel/','/painel/contingencia.html']
    print(json.dumps({p:client.get(p).status_code for p in paths}))
'''
    result=subprocess.run(['python','-c',code],env=env,capture_output=True,text=True,check=True)
    assert set(json.loads(result.stdout).values())=={200}


def login_token(api,user_id=1,perfil='USER'):
    from services.auth_service import gerar_hash_senha
    from routes.auth import attempts
    attempts.clear()
    with api.maker() as db:
        user=db.get(Usuario,user_id)
        user.senha=gerar_hash_senha('test-password')
        user.perfil=perfil
        email=user.email
        db.commit()
    result=api.post('/auth/login',json={'email':email,'senha':'test-password'})
    assert result.status_code==200,result.text
    return result.json()['access_token']


def test_resident_scope_and_admin_authorization(api):
    token=login_token(api)
    start(api)
    with api.maker() as db:
        db.add(Usuario(id=2,nome='Other',email='other@example.com'))
        db.commit()
        db.add(Sessao(usuario_id=2,carregador_id=1,inicio=datetime(2026,1,1),status='PENDENTE_CONCILIACAO'))
        db.commit()
    api.auth=None
    api.headers['Authorization']='Bearer '+token
    assert api.get('/auth/me').json()['id']==1
    assert len(api.get('/me/sessoes').json()['sessoes'])==1
    assert len(api.get('/me/cartoes').json()['cartoes'])==1
    assert api.get('/sessoes/').status_code==403
    assert api.post('/auth/admin/reset-token/2').status_code==403
    assert api.post('/me/assistente',json={'pergunta':'Qual foi meu consumo?','usuario_id':2}).status_code==200


def test_password_reset_token_private_and_single_use(api):
    from routes.auth import attempts
    token=login_token(api)
    request=api.post('/auth/esqueci-senha',json={'email':'teste@example.com'})
    assert request.status_code==503
    assert 'token_reset' not in request.json()
    reset=api.post('/auth/admin/reset-token/1').json()['token_reset']
    response=api.post('/auth/redefinir-senha',json={'token':reset,'nova_senha':'new-password'})
    assert response.status_code==200,response.text
    assert api.post('/auth/redefinir-senha',json={'token':reset,'nova_senha':'another-password'}).status_code==401
    api.auth=None
    api.headers['Authorization']='Bearer '+token
    assert api.get('/auth/me').status_code==401
    attempts.clear()


def test_bearer_admin_and_token_tampering(api):
    token=login_token(api,perfil='ADMIN')
    api.auth=None
    api.headers['Authorization']='Bearer '+token
    assert api.get('/sessoes/').status_code==200
    api.headers['Authorization']='Bearer '+token[:-5]+'xxxxx'
    assert api.get('/auth/me').status_code==401


def test_login_rate_limit_and_password_not_in_response(api):
    from routes.auth import attempts
    attempts.clear()
    for _ in range(10):
        assert api.post('/auth/login',json={'email':'none@example.com','senha':'incorrect'}).status_code==401
    assert api.post('/auth/login',json={'email':'none@example.com','senha':'incorrect'}).status_code==429
    assert 'senha' not in api.get('/usuarios/').json()['usuarios'][0]
    attempts.clear()


def test_public_signup_cannot_promote_to_admin(api):
    from routes.auth import attempts
    attempts.clear()
    api.auth=None
    response=api.post('/auth/cadastro',json={'nome':'Novo','email':'novo@example.com','senha':'new-password','perfil':'ADMIN'})
    assert response.status_code==201,response.text
    assert response.json()['perfil']=='USER'
    assert 'senha' not in response.json()
    token=api.post('/auth/login',json={'email':'novo@example.com','senha':'new-password'}).json()['access_token']
    api.headers['Authorization']='Bearer '+token
    assert api.get('/sessoes/').status_code==403
    attempts.clear()
