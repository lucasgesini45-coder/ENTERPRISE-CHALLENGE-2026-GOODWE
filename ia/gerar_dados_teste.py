import sys
from datetime import datetime, timedelta

import numpy as np
from sqlalchemy.orm import Session

from database.models import db, User, Charger, Sessoes

rng = np.random.default_rng(42)
DIAS = 60

# probabilidade de iniciar sessão por hora (pico entre 18h e 20h)
PESO_HORA = np.array(
    [
        0.2,
        0.1,
        0.1,
        0.1,
        0.2,
        0.5,
        1,
        2,
        2.5,
        2,
        1.5,
        1.5,
        2,
        1.5,
        1.5,
        2,
        3,
        5,
        8,
        8,
        6,
        3,
        1.5,
        0.5,
    ]
)
PESO_HORA = PESO_HORA / PESO_HORA.sum()


def main(forcar=False):
    with Session(db) as s:
        if s.query(Sessoes).count() > 0 and not forcar:
            print("Já existem sessões no banco. Use --forcar para inserir mesmo assim.")
            return

        user = User(nome="Demo", senha="x", email="demo@teste.com", telefone="0")
        s.add(user)
        s.flush()
        chargers = [
            Charger(
                user_id=user.id,
                localizacao=f"Vaga {i}",
                potencia_maxima=p,
                status="disponivel",
                modelo="GW-EV",
            )
            for i, p in enumerate([7.4, 11, 22], 1)
        ]
        s.add_all(chargers)
        s.flush()

        inicio_base = (datetime.now() - timedelta(days=DIAS)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        for d in range(DIAS):
            dia = inicio_base + timedelta(days=d)
            fator = 0.6 if dia.weekday() >= 5 else 1.0
            for c in chargers:
                for _ in range(rng.poisson(6 * fator)):
                    hora = rng.choice(24, p=PESO_HORA)
                    ini = dia + timedelta(
                        hours=int(hora), minutes=int(rng.integers(0, 60))
                    )
                    energia = max(2.0, rng.normal(10, 2.5))
                    potencia = c.potencia_maxima * rng.uniform(0.7, 0.95)
                    dur = energia / potencia * 60
                    s.add(
                        Sessoes(
                            user_id=user.id,
                            charger_id=c.id,
                            inicio=ini,
                            fim=ini + timedelta(minutes=dur),
                            energia_kwh=round(energia, 2),
                            duracao_min=round(dur, 1),
                            status="concluida",
                        )
                    )
        s.commit()
        print(
            f"Dados sintéticos inseridos ({DIAS} dias, {len(chargers)} carregadores)."
        )


if __name__ == "__main__":
    main(forcar="--forcar" in sys.argv)
