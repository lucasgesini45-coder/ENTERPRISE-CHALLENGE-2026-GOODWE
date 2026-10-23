import threading
from datetime import datetime, timedelta, timezone

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

from ia.storage import carregar_modelo, salvar_modelo

FUSO_LOCAL = "America/Sao_Paulo"


def _novo_modelo():
    return RandomForestRegressor(n_estimators=200, min_samples_leaf=2, random_state=42)


class PrevisorDemanda:

    FEATURES = ["hora", "dia_semana", "fim_de_semana"]
    MIN_HORAS = 48
    MIN_SESSOES = 10
    MAX_SEGUNDOS_SESSAO = (
        24 * 3600
    )  # sessões mais longas são tratadas como dado suspeito

    def __init__(self):
        self.modelo = _novo_modelo()
        self.treinado = False
        self.treinado_em = None
        self.n_sessoes = 0
        self._lock = threading.RLock()

    # ------------------------------------------------------------------ dados
    @classmethod
    def _distribuir_por_hora(cls, df: pd.DataFrame) -> pd.Series:
        """Reparte o consumo de cada sessão pelas horas em que ela ocorreu."""
        registros = []
        for inicio, fim, kwh in zip(df["inicio"], df["fim"], df["energia_kwh"]):
            total = (fim - inicio).total_seconds() if pd.notna(fim) else 0
            if total <= 0 or total > cls.MAX_SEGUNDOS_SESSAO:
                registros.append((inicio.floor("h"), kwh))
                continue
            t = inicio
            while t < fim:
                prox = min(t.floor("h") + pd.Timedelta(hours=1), fim)
                registros.append(
                    (t.floor("h"), kwh * (prox - t).total_seconds() / total)
                )
                t = prox
        serie = (
            pd.DataFrame(registros, columns=["hora", "kwh"])
            .groupby("hora")["kwh"]
            .sum()
        )
        return serie.resample("h").sum()

    @classmethod
    def _agregar_por_hora(cls, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        # Aceita DataFrames com datas naive/aware, em texto, ou sem a coluna "fim".
        for col in ("inicio", "fim"):
            s = (
                pd.to_datetime(df[col])
                if col in df.columns
                else pd.Series(pd.NaT, index=df.index)
            )
            s = (
                s.dt.tz_localize(FUSO_LOCAL)
                if s.dt.tz is None
                else s.dt.tz_convert(FUSO_LOCAL)
            )
            df[col] = s
        serie = cls._distribuir_por_hora(df)
        agg = serie.reset_index()
        agg.columns = ["data_hora", "energia_kwh"]
        agg["hora"] = agg["data_hora"].dt.hour
        agg["dia_semana"] = agg["data_hora"].dt.dayofweek  # segunda = 0 ... domingo = 6
        agg["fim_de_semana"] = (agg["dia_semana"] >= 5).astype(int)
        return agg

    # ----------------------------------------------------------------- treino
    def treinar(self, df: pd.DataFrame) -> dict:
        if df.empty or len(df) < self.MIN_SESSOES:
            raise ValueError(
                f"Histórico insuficiente (mínimo {self.MIN_SESSOES} sessões)."
            )
        dados = self._agregar_por_hora(df)
        if len(dados) < self.MIN_HORAS:
            raise ValueError("Histórico insuficiente (mínimo ~2 dias de dados).")

        corte = int(len(dados) * 0.8)
        treino, teste = dados.iloc[:corte], dados.iloc[corte:]

        candidato = _novo_modelo()
        candidato.fit(treino[self.FEATURES], treino["energia_kwh"])
        mae = mean_absolute_error(
            teste["energia_kwh"], candidato.predict(teste[self.FEATURES])
        )

        # Baseline mais honesto: média histórica de cada hora do dia.
        media_hora = treino.groupby("hora")["energia_kwh"].mean()
        base = teste["hora"].map(media_hora).fillna(treino["energia_kwh"].mean())
        mae_base = mean_absolute_error(teste["energia_kwh"], base)

        candidato.fit(dados[self.FEATURES], dados["energia_kwh"])
        with self._lock:
            self.modelo = candidato
            self.treinado = True
            self.treinado_em = datetime.now(timezone.utc)
            self.n_sessoes = len(df)
        return {
            "mae_kwh": round(float(mae), 2),
            "mae_baseline_kwh": round(float(mae_base), 2),
            "horas_treino": len(dados),
            "sessoes_usadas": len(df),
        }

    def precisa_atualizar(self, max_idade: timedelta) -> bool:
        if not self.treinado or self.treinado_em is None:
            return True
        return datetime.now(timezone.utc) - self.treinado_em > max_idade

    def atualizar_se_necessario(
        self,
        carregar_dados,
        max_idade: timedelta = timedelta(hours=1),
        forcar: bool = False,
    ):
        """Retreina com os dados atuais do banco se o modelo estiver velho.

        Retorna as métricas se retreinou, ou None se manteve o modelo atual.
        """
        with self._lock:
            if not forcar and not self.precisa_atualizar(max_idade):
                return None
            try:
                metricas = self.treinar(carregar_dados())
            except ValueError:
                if self.treinado:  # dados insuficientes agora: mantém o modelo anterior
                    return None
                raise
            self.salvar()
            return metricas

    # --------------------------------------------------------------- previsão
    def prever_dia(self, dia_semana: int) -> dict:
        if not self.treinado:
            raise RuntimeError("Modelo não treinado.")
        if not 0 <= dia_semana <= 6:
            raise ValueError("dia_semana deve estar entre 0 (segunda) e 6 (domingo).")
        horas = pd.DataFrame(
            {
                "hora": range(24),
                "dia_semana": dia_semana,
                "fim_de_semana": int(dia_semana >= 5),
            }
        )
        prev = np.clip(self.modelo.predict(horas[self.FEATURES]), 0, None)

        centro = int(np.argmax(prev))
        if prev[centro] <= 0:
            pico_inicio = pico_fim = None
        else:
            limite = prev[centro] * 0.8
            ini = fim = centro
            while ini > 0 and prev[ini - 1] >= limite:
                ini -= 1
            while fim < 23 and prev[fim + 1] >= limite:
                fim += 1
            pico_inicio, pico_fim = f"{ini}h", f"{fim + 1}h"

        return {
            "dia_semana": dia_semana,
            "pico_inicio": pico_inicio,
            "pico_fim": pico_fim,
            "consumo_estimado_kwh": round(float(prev[centro]), 1),
            "consumo_total_dia_kwh": round(float(prev.sum()), 1),
            "previsao_por_hora": {
                f"{h}h": round(float(p), 1) for h, p in enumerate(prev)
            },
            "treinado_em": self.treinado_em.isoformat() if self.treinado_em else None,
            "sessoes_usadas": self.n_sessoes,
        }

    # ------------------------------------------------------------ persistência
    def salvar(self, caminho=None):  # `caminho` ignorado: mantido por compatibilidade
        salvar_modelo(
            {
                "modelo": self.modelo,
                "treinado_em": self.treinado_em,
                "n_sessoes": self.n_sessoes,
            }
        )

    def carregar(
        self, caminho=None
    ) -> bool:  # `caminho` ignorado: mantido por compatibilidade
        obj = carregar_modelo()
        if obj is None:
            return False
        with self._lock:
            if isinstance(obj, dict):
                self.modelo = obj["modelo"]
                self.treinado_em = obj.get("treinado_em")
                self.n_sessoes = obj.get("n_sessoes", 0)
            else:  # formato antigo: só o estimador, sem data -> retreina na próxima checagem
                self.modelo = obj
                self.treinado_em = None
            self.treinado = True
        return True
