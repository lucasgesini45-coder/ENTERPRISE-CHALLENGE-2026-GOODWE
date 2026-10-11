from datetime import datetime, timezone

from services.fatura_pdf_service import horario_sao_paulo


def test_naive_database_utc_is_displayed_in_sao_paulo():
    local = horario_sao_paulo(datetime(2026, 10, 10, 23, 40))
    assert local.strftime('%d/%m/%Y %H:%M') == '10/10/2026 20:40'


def test_utc_date_rollover_is_converted_without_changing_the_instant():
    utc = datetime(2026, 10, 11, 1, 30, tzinfo=timezone.utc)
    local = horario_sao_paulo(utc)
    assert local.strftime('%d/%m/%Y %H:%M') == '10/10/2026 22:30'
    assert local.astimezone(timezone.utc) == utc
