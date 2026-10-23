import pandas as pd
from sqlalchemy import text
from database.database import engine

# Fuso em que o banco grava as datas "naive". O projeto usa UTC
# (ex.: datetime.now(timezone.utc).replace(tzinfo=None)). Se o campo
# `inicio` for gravado em horário de Brasília, troque para "America/Sao_Paulo".
FUSO_BANCO = "UTC"
FUSO_LOCAL = "America/Sao_Paulo"


def _para_local(serie: pd.Series) -> pd.Series:
    s = pd.to_datetime(serie)
    if s.dt.tz is None:
        s = s.dt.tz_localize(FUSO_BANCO)
    return s.dt.tz_convert(FUSO_LOCAL)


def carregar_sessoes(somente_confirmadas: bool = True) -> pd.DataFrame:
    filtro_confirmada = "AND s.confirmado = :conf" if somente_confirmadas else ""
    query = text(f"""
        SELECT s.id AS sessao_id, s.carregador_id AS charger_id,
               s.inicio, s.fim, s.consumo_kwh AS energia_kwh,
               s.duracao AS duracao_min, s.status, c.potencia_maxima
        FROM sessoes s
        JOIN carregadores c ON c.id = s.carregador_id
        WHERE UPPER(s.status) = 'CONCLUIDA'
          {filtro_confirmada}
          AND s.consumo_kwh IS NOT NULL AND s.consumo_kwh > 0
          AND s.duracao > 0
    """)
    params = {"conf": True} if somente_confirmadas else {}
    with engine.connect() as db:
        df = pd.read_sql(query, db, params=params)

    df["inicio"] = _para_local(df["inicio"])
    df["fim"] = _para_local(df["fim"])
    if not df.empty:
        df["potencia_media_kw"] = df["energia_kwh"] / (df["duracao_min"] / 60)
    return df.sort_values("inicio").reset_index(drop=True)


def diagnostico_dados() -> dict:
    """Mostra quantas sessões existem e quantas realmente chegam ao modelo."""
    query = text("""
        SELECT COUNT(*) AS total,
               SUM(CASE WHEN UPPER(status) = 'CONCLUIDA' THEN 1 ELSE 0 END) AS concluidas,
               SUM(CASE WHEN UPPER(status) = 'CONCLUIDA' AND confirmado = :conf
                        THEN 1 ELSE 0 END) AS concluidas_confirmadas,
               MAX(inicio) AS ultima_sessao
        FROM sessoes
    """)
    with engine.connect() as db:
        linha = db.execute(query, {"conf": True}).mappings().one()
    usadas = len(carregar_sessoes())
    return {
        "total_sessoes": int(linha["total"] or 0),
        "concluidas": int(linha["concluidas"] or 0),
        "concluidas_confirmadas": int(linha["concluidas_confirmadas"] or 0),
        "usadas_no_treino": usadas,
        "ultima_sessao_no_banco": str(linha["ultima_sessao"]),
    }
