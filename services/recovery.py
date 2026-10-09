import os
from datetime import datetime, timedelta, timezone
from database.database import SessionLocal
from database.models import Sessao


def reconcile_stale_sessions(maker=SessionLocal):
    """Sem leitura recente, mantém o consumo e exige conciliação; não encerra carga."""
    cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(seconds=int(os.environ.get('TELEMETRY_MAX_AGE_SECONDS', '300')))
    with maker() as db:
        count = db.query(Sessao).filter(Sessao.status == 'EM_ANDAMENTO', Sessao.ultima_medicao < cutoff).update(
            {Sessao.status:'PENDENTE_CONCILIACAO', Sessao.confirmado:False, Sessao.valor_total:None}, synchronize_session=False)
        db.commit()
        return count
