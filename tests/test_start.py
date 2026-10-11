import json
import os
import stat

import pytest

from scripts.start import KEYS, configure


@pytest.fixture(autouse=True)
def isolated_environment(monkeypatch):
    monkeypatch.setattr(os, 'environ', os.environ.copy())


def test_secret_survives_new_terminal_and_old_export(tmp_path, monkeypatch):
    for key in KEYS:
        monkeypatch.delenv(key, raising=False)
    path = tmp_path / 'config.json'
    configure(path)
    secret = os.environ['EV_CHARGEOPS_JWT_SECRET']
    original = path.read_bytes()
    monkeypatch.setenv('EV_CHARGEOPS_JWT_SECRET', 'old-terminal-secret' * 3)
    configure(path)
    assert os.environ['EV_CHARGEOPS_JWT_SECRET'] == secret
    assert path.read_bytes() == original
    assert stat.S_IMODE(path.stat().st_mode) == 0o600


def test_existing_secret_is_preserved_on_first_setup(tmp_path, monkeypatch):
    monkeypatch.setenv('EV_CHARGEOPS_JWT_SECRET', 'current-valid-secret' * 3)
    path = tmp_path / 'config.json'
    configure(path)
    assert json.loads(path.read_text())['EV_CHARGEOPS_JWT_SECRET'] == 'current-valid-secret' * 3


def test_invalid_file_is_not_replaced(tmp_path):
    path = tmp_path / 'config.json'
    path.write_text('{broken')
    with pytest.raises(ValueError):
        configure(path)
    assert path.read_text() == '{broken'
