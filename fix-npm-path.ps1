# Script para agregar Node.js al PATH y refrescar la sesion actual
Write-Host "Verificando instalacion de Node.js..." -ForegroundColor Cyan

$nodePath = "C:\Program Files\nodejs"
$nodeExe = "$nodePath\node.exe"
$npmExe = "$nodePath\npm.cmd"

if (-not (Test-Path $nodeExe)) {
    Write-Host "ERROR: Node.js no esta instalado en $nodePath" -ForegroundColor Red
    Write-Host "Por favor, instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK Node.js encontrado en: $nodePath" -ForegroundColor Green

# Agregar al PATH del sistema si no esta
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($machinePath -notlike "*$nodePath*") {
    Write-Host "Agregando Node.js al PATH del sistema..." -ForegroundColor Yellow
    $newMachinePath = $machinePath + ";" + $nodePath
    [Environment]::SetEnvironmentVariable("Path", $newMachinePath, "Machine")
    Write-Host "OK Agregado al PATH del sistema" -ForegroundColor Green
} else {
    Write-Host "OK Node.js ya esta en el PATH del sistema" -ForegroundColor Green
}

# Agregar al PATH de usuario si no esta
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$nodePath*") {
    Write-Host "Agregando Node.js al PATH de usuario..." -ForegroundColor Yellow
    $newUserPath = $userPath + ";" + $nodePath
    [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
    Write-Host "OK Agregado al PATH de usuario" -ForegroundColor Green
} else {
    Write-Host "OK Node.js ya esta en el PATH de usuario" -ForegroundColor Green
}

# Refrescar PATH en esta sesion
Write-Host "Refrescando PATH en esta sesion..." -ForegroundColor Yellow
$machinePathNew = [System.Environment]::GetEnvironmentVariable("Path","Machine")
$userPathNew = [System.Environment]::GetEnvironmentVariable("Path","User")
$env:PATH = $machinePathNew + ";" + $userPathNew

# Verificar que funciona
Write-Host ""
Write-Host "Verificando instalacion..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "OK Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "OK npm version: $npmVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "Todo listo! Node.js y npm estan funcionando." -ForegroundColor Green
    Write-Host ""
    Write-Host "NOTA: Si abres una nueva terminal, el PATH se cargara automaticamente." -ForegroundColor Yellow
    Write-Host "Si aun no funciona en una nueva terminal, reinicia Windows." -ForegroundColor Yellow
} catch {
    Write-Host "ERROR: No se pudo verificar Node.js/npm" -ForegroundColor Red
    Write-Host "Intenta ejecutar manualmente:" -ForegroundColor Yellow
    Write-Host "  $nodeExe --version" -ForegroundColor White
    Write-Host "  $npmExe --version" -ForegroundColor White
}
