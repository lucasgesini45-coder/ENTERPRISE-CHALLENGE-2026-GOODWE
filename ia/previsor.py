from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

CAMINHO_PADRAO = Path(__file__).parent / "previsor.joblib"


class PrevisorDemanda:

    FEATURES = ["hora", "dia_semana", "fim_de_semana"]
    MIN_HORAS = 48

    def __init__(self):
        self.modelo = RandomForestRegressor(
            n_estimators=200, min_samples_leaf=2, random_state=42
        )
        self.treinado = False

    @staticmethod
    def _agregar_por_hora(df: pd.DataFrame) -> pd.DataFrame:
        serie = df.set_index("inicio")["energia_kwh"].sort_index().resample("h").sum()

        agg = serie.reset_index()
        agg.columns = ["data_hora", "energia_kwh"]
        agg["hora"] = agg["data_hora"].dt.hour
        agg["dia_semana"] = agg["data_hora"].dt.dayofweek
        agg["fim_de_semana"] = (agg["dia_semana"] >= 5).astype(int)
        return agg

    def treinar(self, df: pd.DataFrame) -> dict:
        dados = self._agregar_por_hora(df)
        if len(dados) < self.MIN_HORAS:
            raise ValueError("Histórico insuficiente (mínimo ~2 dias de dados).")

        corte = int(len(dados) * 0.8)
        treino, teste = dados.iloc[:corte], dados.iloc[corte:]

        self.modelo.fit(treino[self.FEATURES], treino["energia_kwh"])
        mae = mean_absolute_error(
            teste["energia_kwh"], self.modelo.predict(teste[self.FEATURES])
        )

        mae_base = mean_absolute_error(
            teste["energia_kwh"], np.full(len(teste), treino["energia_kwh"].mean())
        )

        self.modelo.fit(dados[self.FEATURES], dados["energia_kwh"])
        self.treinado = True
        return {
            "mae_kwh": round(float(mae), 2),
            "mae_baseline_kwh": round(float(mae_base), 2),
            "horas_treino": len(dados),
        }

    def prever_dia(self, dia_semana: int) -> dict:
        if not self.treinado:
            raise RuntimeError("Modelo não treinado.")
        horas = pd.DataFrame(
            {
                "hora": range(24),
                "dia_semana": dia_semana,
                "fim_de_semana": int(dia_semana >= 5),
            }
        )
        prev = np.clip(self.modelo.predict(horas[self.FEATURES]), 0, None)

        centro = int(np.argmax(prev))
        limite = prev[centro] * 0.8
        ini = fim = centro
        while ini > 0 and prev[ini - 1] >= limite:
            ini -= 1
        while fim < 23 and prev[fim + 1] >= limite:
            fim += 1

        return {
            "dia_semana": dia_semana,
            "pico_inicio": f"{ini}h",
            "pico_fim": f"{fim + 1}h",
            "consumo_estimado_kwh": round(float(prev[centro]), 1),
            "consumo_total_dia_kwh": round(float(prev.sum()), 1),
            "previsao_por_hora": {
                f"{h}h": round(float(p), 1) for h, p in enumerate(prev)
            },
        }

    def salvar(self, caminho=CAMINHO_PADRAO):
        joblib.dump(self.modelo, caminho)

    def carregar(self, caminho=CAMINHO_PADRAO):
        self.modelo = joblib.load(caminho)
        self.treinado = True
