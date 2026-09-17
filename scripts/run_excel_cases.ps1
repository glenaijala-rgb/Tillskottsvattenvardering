param(
    [string]$Source = (Join-Path $PSScriptRoot '../reference/TSV KNA.xlsb'),
    [string]$Manifest = (Join-Path $PSScriptRoot '../tests/fixtures/typical_cases.json'),
    [string]$Output = (Join-Path $PSScriptRoot '../analysis/excel-results')
)
$ErrorActionPreference = 'Stop'
if (-not [type]::GetTypeFromProgID('Excel.Application')) {
    throw 'Microsoft Excel är inte installerat/tillgängligt via COM. Ingen Excel-körning har gjorts.'
}
$sourceFile = (Resolve-Path -LiteralPath $Source).Path
$sourceHash = (Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash
New-Item -ItemType Directory -Path $Output -Force | Out-Null
$outputDirectory = (Resolve-Path -LiteralPath $Output).Path
$cases = Get-Content -LiteralPath $Manifest -Raw -Encoding utf8 | ConvertFrom-Json
$addresses = @{
    'Resultat' = @('D4','E4','F4','D5','E5','F5','D109','G109','D110','G110','D111','G111','D112','G112','D113','G113','D115','G115','D116','G116','D117','G117','G122','G125','G126','J126','M126')
    'Beräkningshjälp' = @('D35','D53','E53','F53','D73','E73','F73','D19','E19','F19','D20','E20','F20','D21','E21','F21')
    'Inv ARV' = @('T30','B10')
    'MC' = @('AU6','BG6')
    'Ber' = @('BD23','BG23','BJ23','DZ21')
}
$excelApp = New-Object -ComObject Excel.Application
$excelApp.Visible = $false
$excelApp.DisplayAlerts = $false
$excelApp.AutomationSecurity = 3
$excelApp.AskToUpdateLinks = $false
$results = @()
try {
    foreach ($case in $cases) {
        $copyPath = Join-Path $outputDirectory ($case.id + '.xlsb')
        if (Test-Path -LiteralPath $copyPath) { throw "Testkopian finns redan: $copyPath. Använd en ny utdatamapp för nästa körning." }
        Copy-Item -LiteralPath $sourceFile -Destination $copyPath
        $workbook = $excelApp.Workbooks.Open($copyPath,0,$false)
        try {
            $excelApp.Calculation = -4135
            foreach ($sheetEntry in $case.cells.PSObject.Properties) {
                $sheet = $workbook.Worksheets.Item($sheetEntry.Name)
                foreach ($entry in $sheetEntry.Value.PSObject.Properties) {
                    $cell = $sheet.Range($entry.Name)
                    if ($null -eq $entry.Value) { $cell.ClearContents() | Out-Null }
                    else { $cell.Value2 = $entry.Value }
                    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($cell)
                }
                [void][Runtime.InteropServices.Marshal]::ReleaseComObject($sheet)
            }
            $excelApp.CalculateFullRebuild()
            $values = @{}
            foreach ($sheetName in $addresses.Keys) {
                $sheet = $workbook.Worksheets.Item($sheetName)
                foreach ($address in $addresses[$sheetName]) {
                    $cell = $sheet.Range($address)
                    $values[$sheetName+'!'+$address] = @{value=$cell.Value2;text=$cell.Text;formula=$cell.Formula;error=($cell.Text -match '^#')}
                    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($cell)
                }
                [void][Runtime.InteropServices.Marshal]::ReleaseComObject($sheet)
            }
            $workbook.Save()
            $results += @{id=$case.id;engine=('Microsoft Excel '+$excelApp.Version);source_sha256=$sourceHash;created=(Get-Date).ToString('o');outputs=$values}
            $results | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $outputDirectory 'results.json') -Encoding utf8
            Write-Host ($case.id+' klart')
        } finally {
            $workbook.Close($false)
            [void][Runtime.InteropServices.Marshal]::ReleaseComObject($workbook)
        }
    }
} finally {
    $excelApp.Quit()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($excelApp)
}
if ((Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash -ne $sourceHash) { throw 'Grundfilens kontrollsumma ändrades oväntat.' }
