# Levanta la Agenda en un servidor estatico local (http://localhost:8000)
# Uso:  ./scripts/run.ps1

$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

$puerto = 8000
Write-Host "Carpeta:  $raiz"
Write-Host "Abriendo: http://localhost:$puerto"
Write-Host "Detener:  Ctrl + C"
Write-Host ""

function Test-Comando($nombre) {
  $null -ne (Get-Command $nombre -ErrorAction SilentlyContinue)
}

Start-Process "http://localhost:$puerto"

if (Test-Comando "python") {
  python -m http.server $puerto
}
elseif (Test-Comando "py") {
  py -m http.server $puerto
}
elseif (Test-Comando "npx") {
  npx --yes serve -l $puerto
}
else {
  Write-Host "No se encontro Python ni Node."
  Write-Host "Alternativa: abre index.html con doble clic, o usa Live Server en VS Code."
  exit 1
}
