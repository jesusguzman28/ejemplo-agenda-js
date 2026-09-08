#!/usr/bin/env bash
# Levanta la Agenda en un servidor estatico local (http://localhost:8000)
# Uso:  ./scripts/run.sh

set -e
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RAIZ"

PUERTO=8000
echo "Carpeta:  $RAIZ"
echo "Abriendo: http://localhost:$PUERTO"
echo "Detener:  Ctrl + C"
echo ""

if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PUERTO"
elif command -v python >/dev/null 2>&1; then
  python -m http.server "$PUERTO"
elif command -v npx >/dev/null 2>&1; then
  npx --yes serve -l "$PUERTO"
else
  echo "No se encontro Python ni Node."
  echo "Alternativa: abre index.html con doble clic, o usa Live Server en VS Code."
  exit 1
fi
