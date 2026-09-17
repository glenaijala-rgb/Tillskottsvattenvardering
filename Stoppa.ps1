$ErrorActionPreference = 'Stop'
$pidFile = Join-Path $PSScriptRoot 'data/server.pid'
if (!(Test-Path -LiteralPath $pidFile)) { Write-Host 'Ingen startad server registrerad.'; exit }
$serverProcessId = [int](Get-Content -LiteralPath $pidFile)
$serverProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $serverProcessId"
$expectedPython = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
if ($serverProcess -and $serverProcess.CommandLine -like '*backend.app:create_app*' -and $serverProcess.ExecutablePath -eq $expectedPython) {
    & taskkill.exe /PID $serverProcessId /T /F
    if ($LASTEXITCODE -ne 0) { throw 'Servern kunde inte stoppas.' }
    Write-Host 'Servern är stoppad. Sparade projekt finns kvar.'
} else { Write-Host 'Den registrerade processen är inte denna apps server. Ingen process stoppades.' }
