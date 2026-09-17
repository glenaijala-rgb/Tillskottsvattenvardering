$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
if (Test-Path -LiteralPath $bundledPython) {
    $pythonExecutable = $bundledPython
} else {
    $pythonExecutable = (Get-Command python -ErrorAction Stop).Source
}
& $pythonExecutable -m venv .venv
if ($LASTEXITCODE -ne 0) { throw 'Python 3.12 eller nyare behövs för installationen.' }
& '.venv/Scripts/python.exe' -m pip install -r requirements-lock.txt
if ($LASTEXITCODE -ne 0) { throw 'Python-beroenden kunde inte installeras.' }
Push-Location frontend
try {
    & npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw 'Webbberoenden kunde inte installeras.' }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Webbgränssnittet kunde inte byggas.' }
} finally { Pop-Location }
Write-Host 'Installationen är klar. Dubbelklicka på Starta.cmd.'
