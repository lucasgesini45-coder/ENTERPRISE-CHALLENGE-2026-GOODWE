from datetime import datetime

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sqlalchemy.orm import Session
from sklearn.ensemble import IsolationForest

from database.models import Sessao


from datetime import datetime, timedelta

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sqlalchemy.orm import Session

from database.models import Sessao


def prever_consumo(
    db: Session,
    dias_previsao: int = 7
):
    sessoes = (
        db.query(Sessao)
        .filter(
            Sessao.status == "CONCLUIDA",
            Sessao.consumo_kwh.isnot(None)
        )
        .order_by(Sessao.inicio.asc())
        .all()
    )

    if len(sessoes) < 3:
        return {
            "sucesso": False,
            "erro": "Dados insuficientes para gerar previsao"
        }

    X = []
    y = []

    for sessao in sessoes:
        if sessao.inicio is None:
            continue

        X.append([
            sessao.inicio.weekday(),
            sessao.inicio.hour
        ])

        y.append(
            sessao.consumo_kwh or 0
        )

    if len(X) < 3:
        return {
            "sucesso": False,
            "erro": "Dados insuficientes para treinamento"
        }

    X = np.array(X)
    y = np.array(y)

    modelo = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    modelo.fit(X, y)

    agora = datetime.now()

    previsoes = []

    horarios_teste = [
        8,
        10,
        12,
        14,
        16,
        18,
        20,
        22
    ]

    melhor_previsao = None

    for dia in range(1, dias_previsao + 1):
        data_base = agora + timedelta(days=dia)

        melhor_consumo_dia = -1
        melhor_horario_dia = None

        for hora in horarios_teste:
            entrada = np.array([[
                data_base.weekday(),
                hora
            ]])

            consumo_previsto = modelo.predict(
                entrada
            )[0]

            if consumo_previsto > melhor_consumo_dia:
                melhor_consumo_dia = consumo_previsto
                melhor_horario_dia = hora

        data_previsao = data_base.replace(
            hour=melhor_horario_dia,
            minute=0,
            second=0,
            microsecond=0
        )

        previsao_dia = {
            "data": data_previsao,
            "horario_pico": f"{melhor_horario_dia:02d}:00",
            "consumo_previsto_kwh": round(
                float(melhor_consumo_dia),
                2
            )
        }

        previsoes.append(previsao_dia)

        if (
            melhor_previsao is None
            or melhor_consumo_dia
            > melhor_previsao["consumo"]
        ):
            melhor_previsao = {
                "data": data_previsao,
                "hora": melhor_horario_dia,
                "consumo": melhor_consumo_dia
            }

    consumo_total_previsto = round(
        sum(
            item["consumo_previsto_kwh"]
            for item in previsoes
        ),
        2
    )

    media_consumo_sessao = round(
        float(np.mean(y)),
        2
    )

    if consumo_total_previsto < 30:
        nivel_demanda = "BAIXA"

    elif consumo_total_previsto < 70:
        nivel_demanda = "MODERADA"

    else:
        nivel_demanda = "ALTA"

    return {
        "sucesso": True,
        "modelo": "RandomForestRegressor",
        "dados_treinamento": len(X),
        "dias_previsao": dias_previsao,
        "consumo_total_previsto_kwh":
            consumo_total_previsto,
        "media_consumo_sessao_kwh":
            media_consumo_sessao,
        "horario_pico_previsto":
            f"{melhor_previsao['hora']:02d}:00",
        "maior_consumo_previsto_kwh": round(
            float(melhor_previsao["consumo"]),
            2
        ),
        "nivel_demanda": nivel_demanda,
        "previsoes": previsoes
    }



def detectar_anomalias(db: Session):
    sessoes = (
        db.query(Sessao)
        .filter(
            Sessao.status == "CONCLUIDA",
            Sessao.consumo_kwh.isnot(None)
        )
        .order_by(Sessao.inicio.asc())
        .all()
    )

    if len(sessoes) < 4:
        return {
            "sucesso": False,
            "erro": "Dados insuficientes para detectar anomalias"
        }

    X = []
    sessoes_validas = []

    for sessao in sessoes:
        if sessao.inicio is None:
            continue

        consumo = sessao.consumo_kwh or 0
        duracao = sessao.duracao or 0

        X.append([
            consumo,
            duracao
        ])

        sessoes_validas.append(sessao)

    if len(X) < 4:
        return {
            "sucesso": False,
            "erro": "Dados insuficientes para analise"
        }

    X = np.array(X)

    media_consumo = float(
        np.mean(X[:, 0])
    )

    media_duracao = float(
        np.mean(X[:, 1])
    )

    modelo = IsolationForest(
        contamination="auto",
        random_state=42
    )

    resultados = modelo.fit_predict(X)

    scores = modelo.decision_function(X)

    anomalias = []

    for sessao, resultado, score in zip(
        sessoes_validas,
        resultados,
        scores
    ):
        if resultado == -1:

            motivos = []

            consumo = sessao.consumo_kwh or 0
            duracao = sessao.duracao or 0

            if consumo < media_consumo:
                motivos.append(
                    "Consumo abaixo da media historica"
                )

            elif consumo > media_consumo:
                motivos.append(
                    "Consumo acima da media historica"
                )

            if duracao < media_duracao:
                motivos.append(
                    "Duracao abaixo da media historica"
                )

            elif duracao > media_duracao:
                motivos.append(
                    "Duracao acima da media historica"
                )

            anomalias.append({
                "sessao_id": sessao.id,
                "usuario_id": sessao.usuario_id,
                "carregador_id": sessao.carregador_id,
                "inicio": sessao.inicio,
                "consumo_kwh": sessao.consumo_kwh,
                "duracao_minutos": sessao.duracao,
                "status_analise": "ANOMALIA",
                "nivel": "ATENCAO",
                "score_anomalia": round(
                    float(score),
                    4
                ),
                "motivos": motivos
            })

    return {
        "sucesso": True,
        "modelo": "IsolationForest",
        "total_sessoes_analisadas": len(
            sessoes_validas
        ),
        "media_consumo_kwh": round(
            media_consumo,
            2
        ),
        "media_duracao_minutos": round(
            media_duracao,
            2
        ),
        "total_anomalias": len(anomalias),
        "anomalias": anomalias
    }