# Version 0.2

2026-09-18. Git-tagg: `v0.2`. Programversion 0.2, frontendpaket 0.2.0.

## Ny arbetsgång

1. **Projekt:** namn, område, analysperiod och gemensamma analysförutsättningar.
2. **Nuläge:** en sammanhängande grupp uppgifter i taget. Delmenyn visar saknade uppgifter, ifyllt underlag eller Inte aktuellt.
3. **Åtgärder:** välj alternativ och arbeta med Om åtgärden, Byggnation, Efter åtgärd och Effekter.
4. **Granska:** kontrollera underlaget utan att spara eller beräkna. Fel länkar till rätt steg, alternativ och grupp. Kontrollreglerna är samma som vid beräkningen.
5. **Resultat:** nettonuvärde och osäkerhetsintervall först. Jämförelsetabell, diagram och detaljer öppnas vid behov. Val av äldre körning och markering av ändrade indata finns kvar.

Projektlistan, typfallet, arkivet och säkerhetskopiorna finns under **Mina projekt**. Det går att hoppa direkt mellan steg och spara ofärdiga utkast.

## Bevarat innehåll

- Beräkningsmotorn är oförändrad, version 1.1.0. SQL-schemat är fortfarande 1. Ingen datamigrering krävs.
- Befintliga min/max visas automatiskt. Att dölja ett tomt intervall tar inte bort några värden. För att byta från osäkert till fast värde tömmer användaren båda gränserna själv.
- Fältförklaringar, källor, exempelvärden, beräkningsstöd och kopplade osäkerhetsmodeller behålls. Manuell ändring bryter fortfarande stödkopplingen på samma sätt som i 0.1.
- Bortval, automatisk snabb regnpåverkan, beloppsformatering och direktkontroll av minskning mot nuläget behålls.
- Utskriften expanderar sparade detaljer och återställer skärmvisningen efteråt. Sparade resultat och indata hämtas från den valda körningen.

`POST /api/validate` återanvänder motorns validering utan att skriva projekt, revisioner eller körningar. `/api/health` kompletteras med `application_version`; befintliga `version` avser fortsatt beräkningsmotorn.

## Verifiering

- 54 Python-tester godkända, inklusive tre nya granskningsfall: giltigt underlag, ogiltig minskning samt bortval/inaktivt alternativ. Kontrollerar också att granskning inte ändrar sparat projekt eller historik.
- TypeScript och Vites produktionsbygge godkända.
- Automatiserat Edge-test mot isolerad testdatabas: steg/grupper, bevarade intervall, direktfel och felhänvisning, granskning, beräkning, historik, ändringsmarkering, sparat projekt efter omladdning, utskrift, bortval och 390 px skärmbredd. Inga JavaScript-fel.
- Skärmbilder och PDF från syntetiska testdata granskas som del av leveranskontrollen. Dessa är lokala testartefakter och läggs inte i Git.

### Upprepa kontrollerna

Kör `.venv\Scripts\python.exe -m pytest -q` i projektmappen och `npm.cmd run build` i `frontend`.

Webbläsartestet kräver Playwright för Node.js samt Microsoft Edge. Starta en separat server i projektmappen med **en egen testdatabas**:

```powershell
$env:TSV_DATABASE = "$PWD\analysis\ui02-test.sqlite3"
.venv\Scripts\python.exe -m uvicorn backend.app:create_app --factory --host 127.0.0.1 --port 8766
```

Kör `node scripts/check_ui.cjs` i en annan terminal med Playwright tillgängligt via Node.js modulsökväg. Testet använder bara port 8766 och skapar syntetiska projekt. Testartefakter hamnar i `analysis/ui02`. Testservern ska stoppas efteråt. Använd aldrig den ordinarie projektdatabasen för testet.

## Kvarstående metodfrågor

Microsoft Excel-verifiering och slutlig verksamhetsgranskning av ARV återstår, precis som i 0.1. UI-ändringen innebär inte att dessa metodfrågor är lösta. Testbiblioteken lämnar fortsatt tre befintliga utfasningsvarningar.
