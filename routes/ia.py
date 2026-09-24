from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database.models import db, Charger
from ia.dados import carregar_sessoes
from ia.previsor import PrevisorDemanda, CAMINHO_PADRAO as CAM_PREV
from ia.detector import DetectorAnomalias, CAMINHO_PADRAO as CAM_DET

router = APIRouter(prefix="/ia", tags=["IA"])

previsor = PrevisorDemanda()
detector = DetectorAnomalias()

# carrega os modelos salvos (se existirem) quando o servidor sobe
if CAM_PREV.exists():
    previsor.carregar()
if CAM_DET.exists():
    detector.carregar()


@router.post("/treinar")
def treinar():
    df = carregar_sessoes()
    if df.empty:
        raise HTTPException(400, "Sem sessões concluídas no banco.")
    try:
        res_prev = previsor.treinar(df)
    except ValueError as e:
        raise HTTPException(400, str(e))
    res_det = detector.treinar(df)
    previsor.salvar()
    detector.salvar()
    return {"previsor": res_prev, "detector": res_det}


@router.get("/previsao")  # 0 = segunda ... 6 = domingo; sem parâmetro = hoje
def previsao(dia_semana: int | None = None):
    if dia_semana is None:
        dia_semana = datetime.now().weekday()
    if not 0 <= dia_semana <= 6:
        raise HTTPException(400, "dia_semana deve ser de 0 a 6")
    try:
        return previsor.prever_dia(dia_semana)
    except RuntimeError:
        raise HTTPException(409, "Modelo ainda não treinado. Chame POST /ia/treinar.")


@router.get("/anomalia")
def anomalia(charger_id: int, energia_kwh: float, duracao_min: float):
    with Session(db) as s:
        charger = s.get(Charger, charger_id)
        if charger is None:
            raise HTTPException(404, "Carregador não encontrado.")
        return detector.analisar(
            charger_id, energia_kwh, duracao_min, charger.potencia_maxima
        )


@router.get("/anomalias/recentes")
def anomalias_recentes(limite: int = 50):
    """Varre as últimas sessões concluídas e devolve só as anômalas (para o dashboard)."""
    df = carregar_sessoes().tail(limite)
    with Session(db) as s:
        potencias = {c.id: c.potencia_maxima for c in s.query(Charger).all()}
    alertas = []
    for r in df.itertuples():
        res = detector.analisar(
            int(r.charger_id),
            r.energia_kwh,
            r.duracao_min,
            potencias.get(int(r.charger_id)),
        )
        if res["anomalia"]:
            res["sessao_id"] = int(r.sessao_id)
            res["inicio"] = r.inicio.isoformat()
            alertas.append(res)
    return {"analisadas": len(df), "anomalias": alertas}
