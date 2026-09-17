# Beslut och kvarstående frågor

2026-09-17. Besluten nedan togs under genomförandet enligt uppdraget att fortsätta utan löpande frågor. De är synliga arbetsbeslut, inte ett påstående om att användaren har godkänt varje metodändring.

## Genomförda beslut

| ID | Beslut | Skäl och konsekvens |
|---|---|---|
| B01 | Lokal React/TypeScript-app, Python/FastAPI och SQLite | Följer valt upplägg. Appen lyssnar bara på 127.0.0.1 och behöver ingen serverdrift eller OpenShift. |
| B02 | Analysens startår är år 0. Slutåret ingår. Löpande effekter börjar året efter färdigställandet. | Tydlig, testbar tidsmodell. Grundfilens vissa formler använder byggtidens mittpunkt och fortsätter till år 100 även vid kortare analys. Dessa beteenden kopieras inte. |
| B03 | Byggkostnader delas lika mellan byggstart och byggslut, båda inkluderade. Samma start/slutår ger en engångskostnad det året. | Undviker division med noll och gör båda angivna byggåren till faktiska byggår. |
| B04 | Annuitet använder r/(1−(1+r)^−n). Vid nollränta används 1/n. | Rättar den felaktiga parentesstrukturen i grundfilens resultatblad. n=slutår−startår. |
| B05 | Åtgärdens övriga kostnader behandlas som årliga efter färdigställandet och jämförs med nulägets övriga kostnader. | Följer fältrubrikerna. Kostnad och nytta hålls separata. Grundfilens felkoppling från kostnad till nyttor återskapas inte. |
| B06 | Klimat från byggnation anges i kg CO₂e och omräknas till kronor exakt en gång. | Grundfilen blandar hjälpresultat i kronor och indatafält i kg. Även kopplingen mellan alternativ 2 och 3 rättas. |
| B07 | P50 benämns median. PERT har formparametrar med vikt 4. Gemensamt nuläge samplas lika för alla alternativ. | Bevarar avsedd osäkerhetsmodell. Slumpfrö och stabila delströmmar gör en körning reproducerbar även om andra alternativ aktiveras. |
| B08 | Oberoende fördelningar, men maximal minskning får inte överstiga nulägets minsta värde. | Förhindrar fysiskt omöjliga negativa volymer utan att tyst klippa utfall. En korrelationsmodell kan införas senare. |
| B09 | Alla relevanta värden måste anges, även nollor. Ofullständiga utkast får sparas. | Skiljer saknade uppgifter från faktisk nollkostnad. Inaktiva alternativ blockerar inte beräkning. |
| B10 | Klimat- och trafikhjälpen stödjer fasta värden och osäkra indata. Kopplade indatafördelningar samplas direkt i huvudmotorn. | Undviker att felaktigt behandla percentiler som verkliga min/max eller anpassa en ny PERT-fördelning till ett hjälpresultat. Redigering av överfört min/troligt/max bryter kopplingen. |
| B11 | ARV-hjälpen använder originalets källkonstanter och gammafördelningar, men analytiska P05/P50/P95 i stället för slumpmässigt minimum/histogramtypvärde/maximum. Överföring använder fast P50. | Ger stabila stödvärden och korrekt statistikbenämning. Detta är en uttrycklig metodändring. ARV-osäkerheten förs ännu inte vidare från gamma-modellen till huvudmotorn. Egen min/trolig/max kan anges manuellt. |
| B12 | ARV:s investeringar och reinvesteringar begränsas till vald analysperiod. Modellen ska bara användas för marginalförändringar. | Samma årgränser som resten av appen. Undviker oavsiktlig extrapolation till borttagning av hela flödet. |
| B13 | Årsrisk för översvämning följer grundfilens styckvisa formel. | Skadeantal antas vara konstant efter den längsta återkomsttiden. Antal anges som förväntat antal per år, även decimaltal. |
| B14 | SQLite lagrar projekt, oföränderliga projektrevisioner och körningar i relationella tabeller. Versionsmärkta JSON-fält innehåller indatastruktur och resultat. | Färre migrationsrisker i första versionen än ett stort antal parametertabeller. Transaktioner, främmande nycklar och versionskontroll används. Full normalisering är inte nödvändig för lokal användning. |
| B15 | Återställning importerar säkerhetskopians projekt och historik som nya projekt. Befintlig data ersätts inte. | Ger reversibel återställning och bevarar gamla körningars exakta indata. |
| B16 | Två fördelningsdiagram visar diskonterade kategoribelopp med P50. Årliga odiskonterade värden finns i detaljtabellerna. | Samma enhet i respektive diagram. Avviker från originalets årliga fördelningsdiagram och är uttryckligen märkt i gränssnittet. |
| B17 | Ingen aktuell rekommendation om kalkylränta eller koldioxidpris införs. | Startvärden är redigerbara. Historiska Excel-schabloner betraktas inte som uppdaterade ekonomiska riktlinjer. |
| B18 | Originalet bevaras och grundfilstester körs på kopior. LibreOffice används som kompletterande motor när Microsoft Excel saknas. | Resultaten betecknas aldrig som Microsoft Excel-körningar. Separat Excel-körskript med samma indatamanifest ingår. |

## Frågor som sparats för senare genomgång

Ingen fråga nedan kräver ett svar för att öppna och prova den lokala appen.

1. Är tidsregeln i B02–B03 rätt för verksamheten, eller behövs gradvis nyttoinförande under byggtiden? Nu gäller full effekt först efter färdigställandet.
2. Ska ARV-hjälpen även bevara gammafördelningen genom hela huvudanalysen? Nu förs P50 över som ett fast värde, tydligt märkt.
3. Finns en metodrapport eller en kvalitetssäkrad referenskalkyl som kan fastställa ARV-schablonernas giltighet och tillåten marginalförändring? Originalets parametrar är bevarade, men verksamhetsgiltigheten är inte bevisad av ett kodtest.
4. Vilka lokalt beslutade värden ska användas för ränta, koldioxidvärdering och övriga schabloner? Appen kräver användarens egna värden i verkliga projekt.
5. Är antagandet om konstant skadeantal bortom längsta återkomsttiden lämpligt? Nu används grundfilens angreppssätt.
6. Behövs fler än tre alternativ eller gemensam användning? Nu är användarens beslut om en egen dator och originalets tre alternativ styrande.
7. Microsoft Excel-körningen återstår för slutlig kompatibilitetsverifiering. Excel saknas i kontrollerad miljö. Det förberedda körskriptet kan köras på en dator med Excel med samma typfallsindata.

## Förtydliganden av förstudien

- Den misstänkta referensen `Inv ARV!T30` till XFV:XFW var ett avkodningsproblem i den första XLSB-läsaren. LibreOffice läser originalformeln som `SUM(R30:S30)/(1+$Q$13)^O30`. Det ska inte behandlas som ett bekräftat fel i arbetsboken.
- Hjälpresultaten för klimat och trafik använder `Ber!CA18=0,01` och `CA22=0,99`, inte de allmänna P95/P05-cellerna i kolumn A. Förstudiens misstanke om omvänd percentilordning i dessa hjälpresultat återtas. Däremot är P01/P99 inte absoluta min/max.
- I ARV-underlaget använder vissa rader 18 och 22 verkliga MIN/MAX. Radrubrikerna ensamma räcker inte för att avgöra statistikens betydelse.
