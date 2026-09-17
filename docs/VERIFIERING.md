# Verifiering och leveransstatus

2026-09-17 • Lokal version 1.0.0 • Metodversion lokal-1

## Vad som är byggt

- Webbgränssnitt på svenska med projekt, nuläge, tre åtgärdsalternativ, fyra beräkningshjälper och resultat.
- Lokal SQL-lagring i SQLite med projektkopiering, arkivering, revisionskontroll och oföränderliga resultatkörningar.
- Kostnadsnyttoanalys, diskontering, annuitet, 1 000/10 000 PERT-simuleringar och sparade slumpfrön.
- Klimat- och trafikhjälp med osäkra indata som kan bevaras till huvudberäkningen. Översvämningshjälp och rekonstruerad ARV-hjälp.
- Fem resultatdiagram, kategori- och årstabeller samt utskriftsvy med den valda körningens indata.
- Säkerhetskopiering och återställning som nya projekt, inklusive bevarad historik.
- Startfil, installationsskript och användarguide. Ingen molnpublicering eller OpenShift.

## Genomförda kontroller

**43 automatiska tester godkända.** Testerna omfattar rena kostnadskategorier, investeringar, nollränta, 1/100 års horisont, annuitetens nuvärde, felaktiga indata, PERT-fördelning, percentilmetod, stabila slumpströmmar, hjälpberäkningar, projektseparering, ändringskonflikter, historik, kopiering, arkivering, omstart, avbrutna körningar, säkerhetskopiering och återställning. Inspelade observationer från grundfilen kontrolleras dessutom mot oberoende beräkningar av konstaterade fel.

Testkommandot är `.venv\Scripts\python.exe -m pytest -q`. TypeScript-kompilering och produktionsbygge har lyckats med `npm.cmd run build` i `frontend`. De låsta beroendena finns i `requirements-lock.txt` respektive `frontend/package-lock.json`.

Tre varningar i testkörningen gäller utfasade testbiblioteksanrop i FastAPI/Starlette/httpx, inte misslyckade funktionstester. De påverkar inte testutfallen, men bör följas vid en framtida beroendeuppdatering.

Webbläsarkontroll omfattar öppna syntetiskt typfall, spara/beräkna, svenska decimalkomman, nollränta, äldre resultat och meddelande om ändrade indata, klimattypfall samt visuell kontroll av formulär och resultat. Slutkontrollen genomfördes även mot installationen under `D:\kod`: 43 tester godkända, start/stopp fungerade och sparat typfall med resultat 1 323 kr NNV fanns kvar efter omstart. Testerna kördes med en ny isolerad --basetemp-katalog eftersom Windows temporära pytest-katalog hade olika åtkomsträttigheter mellan körmiljöerna.

## Jämförelse med grundfilen

**21 typfallskörningar** har gjorts med samma indata i programmet och på kopior av grundfilen, omräknade i **LibreOffice 26.2.4.2**. 230 resultatposter har jämförts. 187 överensstämmer inom vald tolerans. 43 är dokumenterade metod-/felavvikelser. Inga oförklarade skillnader finns i detta jämförda urval.

Se [det fullständiga jämförelseprotokollet](JAMFORELSE_TYPFALL.md). Det innehåller värden, skillnader och förklaringar. Gemensamma indata, sparade programresultat och råobservationer ligger i `tests/fixtures/`. Omräknade ODS-testkopior ligger lokalt i `analysis/lo-results/` och är inte incheckade. Originalets kontrollsumma har bevarats.

Exempel: typfall T02 ger omkring 6 126 kr NNV i grundfilen och 1 323 kr i programmet. Skillnaden är inte avrundning. Grundfilens formel räknar nyttor till år 100 trots vald tioårig horisont. Programmet räknar till 2040 och börjar efter färdigställandet. Grundfilens annuitet är dessutom negativ trots positivt NNV, på grund av felaktig parentesstruktur.

Grundfilens klimathjälp (160 kr), trafikhjälp (1 000 kr) och översvämningshjälp (0,3 händelser/år) stämmer med programmets rena typfall.

## Vad som återstår före slutligt verifierat beslutsstöd

1. **Microsoft Excel-körning:** Excel saknas i den kontrollerade miljön, både i sandlådan och Windows-användarkontot. LibreOffice-körningarna ersätter inte denna kontroll. `scripts/run_excel_cases.ps1` är förberett och syntaxkontrollerat men inte exekverat med Excel. Det kör samma manifest på kopior utan att ändra grundfilens formler.
2. **ARV-modell:** gränssnitt och beräkning är implementerade, men metodändringen till analytisk P50 och överföring som fast värde behöver verksamhetsmässig granskning. Originalets slumpmässiga histogramtypvärde är inte samma statistiska mått. Dessa resultat är därför inte numeriskt kompatibilitetsgodkända.
3. **Metodbeslut:** tidsplacering, årliga övriga kostnader och översvämningsmodellens svansantagande är dokumenterade arbetsbeslut. De bör gås igenom innan verkliga investeringsbeslut baseras på appen.
4. **Rapportutskrift:** utskriftsfunktionen och CSS finns. Webbläsarens slutliga skrivardialog och en exporterad PDF har inte visuellt verifierats i denna körning.

Statusen är därför **byggd och lokalt testad första version**, med kvarvarande slutverifiering. Projektplanens utvecklingsdelar är genomförda; hela den ursprungliga acceptansgrinden är inte uppfylld. Ingen publik driftsättning har gjorts och ingen full Excel-likvärdighet hävdas.

## Beslut och frågor

Alla arbetsbeslut och sparade frågor finns i [Beslut och frågor](BESLUT_OCH_FRAGOR.md). Användaren har inte behövt ta ställning till dem under arbetet.

## Kontroll av integrerat UI-stöd 2026-09-17

TypeScript-kontroll och produktionsbygge godkända. Verifierat i separat webbläsarflik med syntetiskt projekt: fyra huvudflikar, fältförklaringar, klimattypfall 10 m × 2 kg/m = 20 kg (80 kr), överföring till rätt åtgärd, återanvändning av längd i trafikstöd, uppmaning när längden ändras, åtgärd 2 opåverkad, översvämningsstöd vid nulägesfält, SQL-sparning och återöppning av underlag efter omladdning samt markering av manuellt ändrat värde. Layouten har inspekterats visuellt. Testprojektet arkiverades; befintliga användarprojekt ändrades inte. Beräkningsmotorn är oförändrad; tidigare 43 motortester har inte körts om för denna UI-ändring.

## Fältkopplade valideringsfel

API:t returnerar läsbara fel och stabila fältsökvägar, även för alternativ med samma namn. Två nya tester verifierar koppling till nuläge, aktiva åtgärder, analysår, ränta och flödesandelar. Befintliga 43 tester samt de två nya testerna passerade fördelat på två slutliga testurval (38 befintliga motor/källtester och 7 API/fältkopplingstester). TypeScript och produktionsbygge godkända. Webbläsarkontroll med tomt syntetiskt projekt gav 28 markerade fält, korrekt flikmarkering, synlig feltext, title och aria-invalid. Separat kontroll av negativ ränta och efterföljande rättning genomförd. Felmarkeringar gäller senaste beräkningsförsöket tills ny kontroll görs. Befintliga användarprojekt har inte ändrats.

## Inte aktuellt – verifiering

49 automatiska tester godkända. Fyra nya tester kontrollerar att bortval med saknade värden kan beräknas, originalvärden och input_hash bevaras, återaktivering återställer krav på indata, bortvald kostnad motsvarar explicit noll utan att radera inmatningen och obligatorisk volym inte kan väljas bort. TypeScript och produktionsbygge godkända. Webbläsarkontroll: källaröversvämningsområdet fälls ihop, värdet 12345 återkommer vid aktivering, motsvarande åtgärdseffekt blir bortvald, tom trafikpost kan uttryckligen väljas bort, beräkning lyckas med NNV 1323 kr, bortval redovisas i resultatet och finns kvar efter omladdning. Syntetiskt testprojekt arkiverat. Befintliga användarprojekt ändrades inte.

## Startvärden, inställningar och enhetlig information

51 tester godkända, inklusive två nya tester för startvärden, ursprungsmarkering, separata projektdata och oförändrat syntetiskt referensfall. TypeScript och produktionsbygge godkända. Kontrollerat i webbläsare: nytt projekt har koldioxidvärde 1; reningskostnaden har 0,63/0,95/4,7; slumpfrö är dolt tills Beräkningsinställningar öppnas; informationsrutan visar bakgrund, exempelvärden och källrad; ändrat värde ger avvikelseinformation; byggnadsandelarnas fält finns i Källaröversvämningar och försvinner när området väljs bort. Testet gjordes i ett osparat nytt projekt. Inga befintliga projektdata ändrades.

## Självständiga hjälptexter

Numrerade punkthänvisningar har tagits bort från de 27 fältens hjälptexter. Förklaringarna har kompletterats från tidigare extraherad Vägledning i TSV KNA.xlsb, särskilt för ARV, klimat, trafik, översvämningar och bräddning. Metodbegränsningar och historisk karaktär är bevarade. TypeScript-kontroll och produktionsbygge godkända. Kontroll av hjälptextkällan visar inga kvarvarande hänvisningar till numrerade punkter. Ingen beräkningskod eller projektdata ändrad.

## Klimatfaktorer från grundfilen

Kompletterat klimatstödets nya underlag med Göteborgsexemplets osäkerhetsintervall: schaktfritt 1/10/217 och schakt 33/104/855 kg CO₂e/m (min/trolig/max). Källa verifierad i extraherade originalceller Beräkningshjälp!H48:J49, med förklaring i Vägledning!B42. Tidigare sparade stödvärden ersätts inte. En utfällbar informationsruta visar värden, källceller, tolkning och historisk karaktär. TypeScript och produktionsbygge godkända; webbläsarkontroll bekräftade samtliga sex startvärden och förvalt osäkerhetsintervall. Beräkningsmotorn är oförändrad.

## Kompakta stödknappar

Beräkningsstöd ligger nu som en liten knapp intill berört fältnamn. Stängd vy har ingen separat panel eller statusrad. Underlag och status visas först när knappen öppnas; meddelande om ändrade ledningslängder signaleras fortsatt med Uppdatera stöd. TypeScript och produktionsbygge godkända. Öppning/stängning av klimatstöd och kompakt placering vid klimat- och trafikfält visuellt kontrollerade i webbläsaren. Beräkningskod och sparade projekt är oförändrade.

## Automatisk fördelning av borttaget tillskottsvatten

TypeScript och produktionsbygge godkända. Kontrollerat i osparat syntetiskt projekt i webbläsaren: 80 + 60 ger låst snabb regnpåverkan -40, röda fält och röd feltext som anger 140 % (högst 100 %). 80 + 10 ger rest 10 och felmarkeringen försvinner. Tömning med tangentbord ger saknad summa och uppmaning att ange båda andelarna. Readonly och aria-invalid kontrollerade. Ingen befintlig projektdata sparades eller ändrades av testet. Beräkningsmotorn oförändrad.
