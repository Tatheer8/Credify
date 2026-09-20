# CrediWise AI — Start Backend
# Run from the project root: Credify/
Set-Location $PSScriptRoot
$env:PYTHONPATH = $PSScriptRoot
Write-Host "Starting CrediWise AI FastAPI backend on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Swagger UI: http://localhost:8000/docs" -ForegroundColor Green
uvicorn backend.main:app --reload --port 8000
