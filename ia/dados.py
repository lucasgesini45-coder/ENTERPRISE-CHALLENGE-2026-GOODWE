import pandas as pd
from database.models import db


def carregar_sessoes() -> pd.DataFrame:
    query = """
        SELECT s.sessao_id, s.charger_id, s.inicio, s.fim,
               s.energia_kwh, s.duracao_min, s.status,
               c.potencia_maxima
        FROM sessoes s
        JOIN chargers c ON c.id_charger = s.charger_id
        WHERE s.status = 'concluida'
          AND s.energia_kwh IS NOT NULL
          AND s.duracao_min IS NOT NULL
          AND s.duracao_min > 0
          AND s.inicio IS NOT NULL
    """
    df = pd.read_sql(query, db)
    if df.empty:
        return df
    df["inicio"] = pd.to_datetime(df["inicio"])
    df["fim"] = pd.to_datetime(df["fim"])
    df["potencia_media_kw"] = df["energia_kwh"] / (df["duracao_min"] / 60)
    return df.sort_values("inicio").reset_index(drop=True)
