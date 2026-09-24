from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest

CAMINHO_PADRAO = Path(__file__).parent / "detector.joblib"


class DetectorAnomalias:
    """Um IsolationForest por carregador + regra física de potência máxima."""

    FEATURES = ["energia_kwh", "duracao_min", "potencia_media_kw"]
    MIN_SESSOES = 30
    LIMIAR_ALTO = -0.10
    LIMIAR_MEDIO = -0.03

    def __init__(self):
        self.modelos: dict[int, IsolationForest] = {}

    def treinar(self, df: pd.DataFrame) -> dict:
        self.modelos = {}
        ignorados = []
        for charger_id, grupo in df.groupby("charger_id"):
            if len(grupo) < self.MIN_SESSOES:
                ignorados.append(int(charger_id))
                continue
            modelo = IsolationForest(
                n_estimators=200, contamination=0.03, random_state=42
            )
            modelo.fit(grupo[self.FEATURES])
            self.modelos[int(charger_id)] = modelo
        return {"treinados": sorted(self.modelos), "sem_dados_suficientes": ignorados}

    def analisar(
        self,
        charger_id: int,
        energia_kwh: float,
        duracao_min: float,
        potencia_maxima: float | None = None,
    ) -> dict:
        horas = duracao_min / 60
        potencia_media = energia_kwh / horas if horas > 0 else 0.0

        if potencia_maxima and potencia_media > potencia_maxima * 1.1:
            return self._resposta(
                charger_id,
                energia_kwh,
                True,
                "ALTO",
                motivo=f"Potência média ({potencia_media:.1f} kW) acima da máxima "
                f"do carregador ({potencia_maxima:.1f} kW)",
            )

        modelo = self.modelos.get(charger_id)
        if modelo is None:
            return self._resposta(
                charger_id,
                energia_kwh,
                False,
                "SEM_HISTORICO",
                motivo="Histórico insuficiente para este carregador",
            )

        X = pd.DataFrame(
            [[energia_kwh, duracao_min, potencia_media]], columns=self.FEATURES
        )
        anomalia = bool(modelo.predict(X)[0] == -1)
        score = float(modelo.decision_function(X)[0])

        if not anomalia:
            nivel = "NORMAL"
        elif score < self.LIMIAR_ALTO:
            nivel = "ALTO"
        elif score < self.LIMIAR_MEDIO:
            nivel = "MEDIO"
        else:
            nivel = "BAIXO"

        return self._resposta(
            charger_id, energia_kwh, anomalia, nivel, score=round(score, 3)
        )

    @staticmethod
    def _resposta(
        charger_id, energia, anomalia, nivel, motivo=None, score=None
    ) -> dict:
        r = {
            "carregador": charger_id,
            "consumo_kwh": energia,
            "anomalia": anomalia,
            "nivel": nivel,
        }
        if motivo:
            r["motivo"] = motivo
        if score is not None:
            r["score"] = score
        return r

    def salvar(self, caminho=CAMINHO_PADRAO):
        joblib.dump(self.modelos, caminho)

    def carregar(self, caminho=CAMINHO_PADRAO):
        self.modelos = joblib.load(caminho)
