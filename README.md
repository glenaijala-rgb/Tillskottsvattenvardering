# Tillskottsvattenvärdering 0.2

En lokal webbapp för samhällsekonomisk värdering av tillskottsvattenåtgärder, med sparade projekt i SQLite.

## Starta programmet

Dubbelklicka på **Starta.cmd** i `D:\kod\Tillskottsvattenvardering`.

Programmet öppnas på `http://127.0.0.1:8765`. Välj **Mina projekt → Öppna syntetiskt typfall** för att prova eller **Mina projekt → Nytt projekt** för egna uppgifter. Välj **Spara projekt** regelbundet. **Beräkna** sparar också projektet och en separat resultatkörning.

## Läs detta

- [Nyheter och verifiering i version 0.2](docs/VERSION_0.2.md)

- [Användarguide](docs/ANVANDARGUIDE.md)
- [Verifiering och kvarstående begränsningar](docs/VERIFIERING.md)
- [Beslut och sparade frågor](docs/BESLUT_OCH_FRAGOR.md)
- [Jämförelseprotokoll för rena typfall](docs/JAMFORELSE_TYPFALL.md)
- [Projektplan](docs/PROJEKTPLAN.md), [specifikation](docs/SPECIFIKATION.md), [fältkatalog](docs/FALTKATALOG.md) och [grundfilsgranskning](docs/EXCELGRANSKNING.md)

Detta är en byggd och lokalt testad första version. Microsoft Excel-kontrollen och ARV-modellens slutliga metodgranskning återstår. Läs verifieringen innan appens resultat används som beslutsunderlag.

## Data och säkerhetskopior

Projekt och historik ligger i `data/projects.sqlite3`. Skapa säkerhetskopior med appens knapp. De ligger i `backups/`. Återställning skapar nya projekt och skriver inte över befintliga. Databas, säkerhetskopior, originalarbetsbok och stora analysfiler är undantagna från Git.

## Installation på nytt

Miljön är installerad lokalt på den aktuella datorn. För en ny installation behövs Python 3.12 och Node.js 20.19 eller nyare. `Installera.ps1` använder Codex medföljande Python om den finns, annars Python på sökvägen, och installerar låsta beroenden samt bygger webbgränssnittet. Därefter används `Starta.cmd`.

## För utveckling

- `backend/engine.py`: fristående beräkningsmotor.
- `backend/helpers.py`: stödberäkningar och ARV-underlag.
- `backend/storage.py`: SQLite, revisioner och körningar.
- `backend/app.py`: lokalt API.
- `frontend/src/`: React/TypeScript och layout.
- `tests/`: automatiska tester samt gemensamma typfallsindata och källobservationer.
- `scripts/`: typfall, kalkylbladskörningar och jämförelserapport.

Kör tester från projektmappen med `.venv\Scripts\python.exe -m pytest -q`. Bygg gränssnittet med `npm.cmd run build` i `frontend`. För start utan att öppna en ny webbläsarflik används `.venv\Scripts\python.exe launcher.py --no-browser`.

SQL-schemaversion är 1. Versionsmärkta JSON-snapshots lagras i relationella projektrevisioner för att bevara exakta indata och resultat. Alla framtida schemaändringar ska göras med migrering och föregående backup.
