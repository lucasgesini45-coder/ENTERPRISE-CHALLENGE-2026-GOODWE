from sqlalchemy import text
from database.database import engine
from database.models import Base


def migrar():
    print("Iniciando migração PostgreSQL...")

    with engine.begin() as conn:

        # =====================================================
        # SESSOES - CAMPOS NOVOS
        # =====================================================

        conn.execute(text("""
            ALTER TABLE sessoes
            ADD COLUMN IF NOT EXISTS chave_operacao VARCHAR(128)
        """))

        conn.execute(text("""
            ALTER TABLE sessoes
            ADD COLUMN IF NOT EXISTS solicitacao TEXT
        """))

        conn.execute(text("""
            ALTER TABLE sessoes
            ADD COLUMN IF NOT EXISTS ultima_medicao TIMESTAMP
        """))

        conn.execute(text("""
            ALTER TABLE sessoes
            ADD COLUMN IF NOT EXISTS confirmado BOOLEAN DEFAULT FALSE
        """))

        conn.execute(text("""
            ALTER TABLE sessoes
            ADD COLUMN IF NOT EXISTS origem VARCHAR DEFAULT 'RFID'
        """))

        # Preenche registros antigos
        conn.execute(text("""
            UPDATE sessoes
            SET confirmado = FALSE
            WHERE confirmado IS NULL
        """))

        conn.execute(text("""
            UPDATE sessoes
            SET origem = 'RFID'
            WHERE origem IS NULL
        """))

        conn.execute(text("""
            UPDATE sessoes
            SET ultima_medicao = COALESCE(fim, inicio)
            WHERE ultima_medicao IS NULL
        """))

        # Índice único da chave de operação
        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS
            ux_sessoes_chave_operacao
            ON sessoes(chave_operacao)
        """))

        # =====================================================
        # CARTAO RFID
        # =====================================================

        conn.execute(text("""
            ALTER TABLE cartoes_rfid
            ADD COLUMN IF NOT EXISTS data_cadastro TIMESTAMP
        """))

        conn.execute(text("""
            ALTER TABLE cartoes_rfid
            ADD COLUMN IF NOT EXISTS codigo VARCHAR
        """))

        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS
            ux_cartoes_rfid_codigo
            ON cartoes_rfid(codigo)
        """))

    # =========================================================
    # CRIA TABELAS NOVAS QUE AINDA NÃO EXISTEM
    # =========================================================

    tabelas_novas = [
        "eventos_sessao",
        "relatorios_sems",
        "telemetria_carregador",
    ]

    for nome in tabelas_novas:

        tabela = Base.metadata.tables.get(nome)

        if tabela is not None:
            tabela.create(
                bind=engine,
                checkfirst=True
            )

            print(
                f"Tabela verificada/criada: {nome}"
            )

    print("Migração PostgreSQL concluída com sucesso.")


if __name__ == "__main__":
    migrar()
