import pandas as pd
from sqlalchemy import text
from database.database import engine


def carregar_sessoes() -> pd.DataFrame:
    query = text("""SELECT s.id AS sessao_id, s.carregador_id AS charger_id,
        s.inicio, s.fim, s.consumo_kwh AS energia_kwh, s.duracao AS duracao_min,
        s.status, c.potencia_maxima FROM sessoes s
        JOIN carregadores c ON c.id = s.carregador_id
        WHERE s.status = 'CONCLUIDA' AND s.confirmado = true
        AND s.consumo_kwh IS NOT NULL AND s.duracao > 0""")
    with engine.connect() as db:
        df = pd.read_sql(query, db)
    if not df.empty:
        df["inicio"] = pd.to_datetime(df["inicio"])
        df["fim"] = pd.to_datetime(df["fim"])
        df["potencia_media_kw"] = df["energia_kwh"] / (df["duracao_min"] / 60)
    return df.sort_values("inicio").reset_index(drop=True)
