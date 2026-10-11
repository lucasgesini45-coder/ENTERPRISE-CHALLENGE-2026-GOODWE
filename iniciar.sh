#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -x .venv/bin/python ]; then
  echo 'Ambiente ausente. Crie .venv e instale requirements.txt conforme o README.' >&2
  exit 1
fi
exec .venv/bin/python -m scripts.start "$@"
