# Specifikation – Tillskottsvattenvärdering

Version 0.1 • 2026-09-17

Status: användarens ramar är krav, inklusive bekräftad användning av en person på den egna datorn. Detaljer om teknik, datamodell och tillkommande funktioner nedan är förslag. Osäkra beräkningsregler är uttryckligen markerade och ska beslutas i projektplanens steg 1.

## 1. Programmets uppgift

Programmet ger ett samhällsekonomiskt beslutsunderlag för att minska tillskottsvatten. Ett värderingsprojekt innehåller ett gemensamt nuläge, analysförutsättningar och ett till tre aktiva åtgärdsalternativ. Alternativ kan representera enskilda åtgärder eller kombinationer. Varje alternativ jämförs med nuläget, inte automatiskt med det föregående alternativet.

Interna kostnader för VA-huvudmannen och externa samhällseffekter ska kunna redovisas. Belopp anges enligt arbetsbokens vägledning utan moms, inflation, låneränta eller bokföringsmässiga avskrivningar. Diskonteringsräntan används separat i den samhällsekonomiska beräkningen.

## 2. Arbetsflöde i webbläsaren

1. **Mina projekt:** skapa eller öppna ett projekt. Visa namn, område, senaste ändring och senaste beräkning.
2. **Projekt:** ange namn, beskrivning, utredningsområde och anteckningar.
3. **Nuläge:** ange år, ränta, koldioxidvärdering, volymer och kostnader i grupper som följer Excel-filen.
4. **Åtgärder:** namnge och aktivera alternativ, ange genomförandetid, investeringar och förväntade effekter.
5. **Beräkningshjälp:** räkna fram stödvärden och välj uttryckligen ”Använd i nuläge” eller ”Använd i åtgärd”. Ursprung och hjälpkalkyl sparas tillsammans med värdet.
6. **Resultat:** välj ”Beräkna”. Se jämförelse och detaljer, spara körningen och skriv ut rapporten.

Det ska gå att spara ett ofullständigt utkast. Resultat kräver däremot giltiga indata. Vid ändring visas ”Indata ändrade sedan senaste beräkningen”. Att öppna en sida får inte dra nya slumptal eller ändra ett sparat resultat.

Gränssnittet ska vara svenskt, ha synliga enheter och stödja svenska decimalkomman. Hjälptext ska ligga vid fältet. ”Min”, ”Mest troligt” och ”Max” ska vara skilda kolumner. Projektet ska visa tydlig sparstatus och varna innan osparade ändringar lämnas. Tangentbordsnavigering och textmeddelanden ska fungera utan att förlita sig på färg.

## 3. Funktionella krav

| ID | Krav | Verifiering |
|---|---|---|
| F01 | Skapa, namnge, spara och återöppna projekt | Samma värden finns kvar efter omstart. |
| F02 | Kopiera projekt till ett självständigt projekt och arkivera/återställa | Originalets indata och historik ändras inte. |
| F03 | Hantera nulägets samtliga parametrar | Fältkatalogens nulägesposter finns med rätt enhet. |
| F04 | Hantera tre separata alternativ med aktiveringsval | Ändring av alternativ 2 påverkar inte 1 eller 3:s indata. Inaktiva utkast blockerar inte aktiva alternativ. |
| F05 | Ange fast värde eller min/trolig/max | Ofullständig eller felordnad fördelning avvisas. |
| F06 | De fyra beräkningshjälperna motsvarar originalets avsedda funktion | Separata referensfall verifierar varje hjälp. |
| F07 | Beräkna nuvärden, annuitet och kategorier | Manuella räknefall och dokumenterade tidsregler stämmer. |
| F08 | Kör Monte Carlo med sparat slumpfrö | Identiska indata, frö och motorversion ger identiskt resultat. |
| F09 | Visa P05/P25/P50/P75/P95 där relevant | Percentilberäkning verifieras med en känd talserie. |
| F10 | Spara körningar med frysta indata | Gammalt resultat kan visas efter en senare indataändring. |
| F11 | Rapport med indata, metodversion, antaganden och resultat | Rapportvärden stämmer med den valda körningen. |
| F12 | Säkerhetskopiera och återställa | Återställning i en separat testdatabas återskapar projekten. |

## 4. Indata och validering

Detaljerad cellkoppling finns i `FALTKATALOG.md`.

- **Analys:** startår, slutår, diskonteringsränta och samhällskostnad för koldioxid.
- **Nuläge:** tillskottsvattenvolym, reningskostnad och klimatpåverkan, ARV-marginalkostnader för tre flödeskomponenter, pumpenergi och elpris, elens klimatpåverkan, antal översvämningar, byggnadsandelar, skadekostnader och övriga konsekvenser, bräddvolym och interna/externa kostnader samt övriga årliga kostnader.
- **Alternativ:** namn, aktivt val, byggstart och byggslut, investering, klimatpåverkan, trafikkostnad, förnyelsenytta, övriga årliga kostnader/nyttor, minskade volymer/översvämningar och fördelning mellan grundvattenpåverkan, trög regnpåverkan och snabb regnpåverkan.
- **Spårbarhet:** kommentar och källuppgift för antaganden, inklusive om ett värde hämtats från schablon eller hjälpkalkyl.

Valideringsregler:

1. Start- och slutår är heltal. Analysens längd ska vara större än noll och högst 100 år. Exakt inklusiv/exklusiv årsdefinition fastställs före implementation.
2. Genomförandeår ligger inom analysen. Samma start- och slutår behöver en uttrycklig engångsinvesteringsregel, inte division med noll.
3. Ränta 0 % ska fungera. Första versionens föreslagna räntedomän är minst 0 %. Detta är en indatagräns, ingen rekommendation om räntesats.
4. Fast värde: endast trolig anges. Osäkert värde: alla tre anges och `min ≤ trolig ≤ max`. Om alla är lika används ett fast värde.
5. Tomt värde skiljs från noll. En uttryckligen ej tillämplig kostnad kan sättas till noll. Relevanta saknade uppgifter får inte döljas med nollor.
6. Fysiska volymer, energier, längder och antal är icke-negativa. Förväntat årligt antal översvämningar får vara ett decimaltal.
7. Andelar ligger mellan 0 och 100 %. Byggnadsandelar summerar till 100 %. De tre flödesandelarna summerar till 100 % när minskad tillskottsvattenvolym är större än noll.
8. Minskning får inte skapa negativa återstående volymer eller antal. Vid osäkra indata ska beroendet mellan grundnivå och minskning modelleras eller indatan avvisas. Ingen tyst klippning av simuleringar till noll.
9. Livslängd och arbetshastighet är större än noll när de används som nämnare. Återkomsttider är positiva och stigande, skadeantal icke minskande.
10. Klimatdata lagras i kg CO₂e och klimatvärdering i kr/kg CO₂e. Belopp i kronor hålls åtskilda från utsläppsmängder.

## 5. Beräkningsmodell

Nedan är avsedda huvudregler. Tidsplacering och identifierade avvikelser i Excel behöver fastställas i steg 1.

För ett år och ett simulerat utfall:

| Post | Regel |
|---|---|
| Rening, internt | Tillskottsvattenvolym × kr/m³ |
| Rening, klimat | Volym × kg CO₂e/m³ × kr/kg CO₂e |
| Pumpning, internt | Volym × kWh/m³ × kr/kWh |
| Pumpning, klimat | Volym × kWh/m³ × kg CO₂e/kWh × kr/kg CO₂e |
| Källaröversvämning | Förväntat antal × andelsviktad kostnad för mindre/större byggnader, separat fysisk skada och övrig konsekvens |
| Bräddning | Bräddvolym × kr/m³, separat intern och extern kostnad |
| Minskad ARV-investering | Borttagen tillskottsvattenvolym × andelsviktad marginalnytta för de tre flödeskomponenterna |
| Klimat från byggnation | Utsläpp i kg CO₂e × koldioxidvärdering, exakt en gång |
| Nettovärde per år | Undvikna nulägeskostnader + andra nyttor − tillkommande kostnader |

Nettonuvärde: `NNV = Σ nettovärde(t) / (1+r)^t`, med investeringar och driftposter placerade i rätt år. Redovisa nyttornas och kostnadernas nuvärden separat så att `NNV = NV(nyttor) − NV(kostnader)` kan kontrolleras.

Föreslagen annuitetsregel: `A = NNV × r / (1 − (1+r)^(-n))`. Vid `r = 0` används `A = NNV/n`. Definitionen av `n` ska följa den beslutade tidsmodellen. Originalets resultatblad har en annan parentesstruktur, se granskningen.

Osäkerhetsmodell:

- Beta-PERT med `a=min`, `m=trolig`, `b=max`, `α=1+4(m−a)/(b−a)` och `β=1+4(b−m)/(b−a)` när `b>a`.
- Basomfattning 1 000 simuleringar, motsvarande de aktiva simuleringsraderna i arbetsboken.
- Gemensamma nulägesparametrar samplas en gång per iteration och återanvänds mellan alternativen. Specifika beroenden och korrelationer måste dokumenteras. Oberoende får inte antas om det leder till fysiskt omöjliga värden.
- Percentilmetod ska specificeras och verifieras mot Excels `PERCENTILE.EXC` där kompatibilitet avses.
- P50 är median, inte generellt typvärde. Presentera måtten korrekt och beskriv intervall som modellens osäkerhetsintervall under valda antaganden.
- Slumpgenerator, frö, antal iterationer, motorversion och beroendemodell sparas. Visa även den deterministiska beräkningen med troliga indata separat om den ingår, aldrig under samma etikett som medianen.

Beräkningshjälp:

- **ARV:** andel tillskottsvatten, nästa investering, andelar bygg/installation, livslängder och reinvestering. Originalet interpolerar mellan 30, 50 och 70 % tillskottsvatten och använder modellvärden från `Inv ARV`. Hela denna kedja kräver separat verifiering. Marginalnytta får inte utan kontroll extrapoleras till borttagning av allt tillskottsvatten.
- **Översvämningar:** omvandla återkomsttider 1, 2, 5, 10, 20 och 100 år till sannolikheter och integrera skadeantal enligt den verifierade styckvisa modellen. Svansantaganden ska dokumenteras.
- **Klimat:** längd schaktfritt × utsläppsfaktor + längd med schakt × utsläppsfaktor. Visa kg CO₂e och klimatkostnad separat.
- **Trafik:** `(längd schaktfritt/hastighet + längd schakt/hastighet) × försening i sekunder × ÅDT × kr/timme/fordon / 3600`.

## 6. Resultat

Visa alla aktiva alternativ sida vid sida: nettonuvärde med P05/P50/P95, annuitet och nuvärden för nyttor respektive kostnader. Återskapa originalets fem resultatdiagram som funktioner: nettonuvärden, osäkerhet i nyttor, osäkerhet i kostnader, fördelning av nyttor och fördelning av kostnader. Resultattabellen ska inkludera nuläget och samtliga alternativ med kategorier och percentiler.

Årliga värden, engångsbelopp och diskonterade värden ska ha olika tydliga etiketter. ”Kostnad efter åtgärd” får inte blandas ihop med ”besparing jämfört med nuläget”. Inaktiva alternativ utelämnas från jämförelsen. Ett saknat resultat visas som saknat med orsak, aldrig som ett ekonomiskt nollresultat.

## 7. Föreslagen teknik och drift

**React med TypeScript** för formulär och diagram, **Python med FastAPI** för validering och beräkningar samt **SQLite** för den första lokala versionens SQL-databas. Beräkningslogiken hålls fristående från webbgränssnittet. Detta gör att ekonomin kan testas utan webbläsare och att gränssnittet kan ändras utan att formlerna skrivs om.

Detta är ett arkitekturförslag, inte ett låst användarkrav. React erbjuder komponenter för gränssnitt, FastAPI stödjer validering och API-beskrivning och SQLite passar lokal datalagring. SQLite medger en skrivare åt gången. För gemensam serverdrift med många samtidiga skrivningar bör PostgreSQL väljas före implementation. Källor: [React](https://react.dev/learn), [FastAPI](https://fastapi.tiangolo.com/), [SQLite användningsområden](https://www.sqlite.org/whentouse.html), lästa 2026-09-17.

Lokal drift: servern binds till datorns loopback-adress och öppnas i webbläsaren. Inga molntjänster krävs. Databasen ska ligga på lokal disk, exempelvis i projektets ignorerade `data/`-mapp, och säkerhetskopieras via databasens backupfunktion. Vid gemensam drift tillkommer användarinloggning, projektbehörigheter, HTTPS och serverbackup. Ingen OpenShift-konfiguration planeras.

## 8. Föreslagen SQL-datamodell

| Tabell | Innehåll och relation |
|---|---|
| `projects` | ID, namn, område, beskrivning, skapad/ändrad, arkiverad, aktuell revision. |
| `project_revisions` | Projekt-ID, revisionsnummer, analysår, ränta, koldioxidvärdering, schema- och metodversion. Unik revision per projekt. |
| `alternatives` | Revisions-ID, stabil alternativnyckel, namn, aktivt val, ordning och genomförandeår. |
| `parameter_values` | Revisions-ID, valfritt alternativ-ID, parameterkod, enhet, fast/PERT, min/trolig/max, källa och kommentar. Unik parameter per tillämpningsområde. |
| `helper_calculations` | Revision, hjälptyp, tillhörande alternativ, versionsmärkt indata och utdata samt koppling till använda parametervärden. |
| `calculation_runs` | Revision, status, start/sluttid, motorversion, slumpgenerator, frö, iterationer, indatahash och felmeddelande. |
| `result_metrics` | Körning, alternativ, resultatkod, enhet och P05/P25/P50/P75/P95 samt eventuellt separat deterministiskt värde. |
| `annual_results` | Körning, alternativ, kalenderår och kategori med odiskonterat/diskonterat resultat enligt definierad statistik. |

Primärnycklar och främmande nycklar ska hindra projektblandning. En sparad körning pekar på en oföränderlig revision. Nya ändringar skapar en ny revision eller utkast före nästa körning. Spara relaterade poster i en transaktion. Historiska resultat räknas inte om automatiskt när motorn uppdateras. Databasändringar ska göras med versionsstyrda migreringar och föregås av backup.

Normaliserade SQL-tabeller används för projekt, parametrar och resultat. Versionsmärkta JSON-fält kan användas för hjälpverktygens varierande underlag, men ersätter inte projektens relationer och validering. Känslighetsresultat eller fullständiga simuleringar kan läggas till senare om lagringsbehovet motiverar det.

## 9. Acceptanstester

Användarkrav: rena typfall ska köras både i Excel-grundfilen och i programmet med identiska indata. [Testplanen](TESTPLAN.md) anger isolerade typfall, jämförelseprotokoll och hantering av skillnader. Jämför både delposter och slutresultat. Enbart handräkning eller läsning av tidigare sparade Excel-värden ersätter inte dessa körningar.

- Två projekt med olika namn och data kan sparas, återöppnas efter omstart och kopieras utan påverkan på varandra.
- Ett fast syntetiskt räknefall matchar handberäknade kategoriresultat och nettonuvärde. Föreslagen numerisk tolerans är `max(0,01 kr, |referens| × 10⁻⁸)` före visningsavrundning.
- Ränta 0 %, horisont 1 och 100 år, samma byggstart/byggslut och ingen åtgärdseffekt hanteras enligt beslutade regler.
- Annuitetens nuvärde återger NNV enligt samma tidskonvention.
- Min=trolig=max ger samma resultat som fast värde. Felordnade och halvt ifyllda fördelningar avvisas.
- Samma indata och frö ger samma simulering. P05 ≤ P50 ≤ P95 och alla utfall respekterar beslutade fysiska gränser.
- Alternativ 2:s klimatindata och alternativ 1:s övriga kostnader testas särskilt mot korskopplingar i originalet.
- Klimatberäkningar verifieras med enheter så att kg aldrig adderas till kr.
- Varje hjälpkalkyl har ett separat kontrollfall. ARV testas vid 30/50/70 %, mellan brytpunkterna, för reinvestering och nollränta.
- Tabell, diagram och rapport använder samma sparade körning och samma statistik.
- Avbruten beräkning blir inte ett färdigt resultat. Backup kan återställas i separat databas och ge samma projekt och körningar.

Slumpmässiga körningar i originalfilen kan inte förväntas bli identiska utan gemensamma slumptal. Excel-jämförelsen ska därför använda fasta indata eller kontrollerade slumpserier och separata statistiska kontroller. Ingen numerisk likvärdighet med Excel är verifierad i denna förstudie.


## 10. Implementerat utförande 2026-09-17

Version 1.0.0 följer specifikationens huvudfunktioner. Arbetsbeslut i BESLUT_OCH_FRAGOR.md preciserar tidigare öppna regler och har företräde vid avvikelser från förstudieförslaget. SQL använder tre relationella huvudtabeller med versionsmärkta JSON-snapshots. Fördelningsdiagrammen visar diskonterade P50-kategorier; odiskonterade årliga värden finns i tabeller. ARV-hjälpen använder analytiska gamma-percentiler och överför fast P50. Klimat-/trafikhjälpens osäkerhet kan däremot följa med till huvudmotorn utan ny PERT-anpassning.

Tester och kända begränsningar redovisas i VERIFIERING.md. Excel-jämförelsen är inte fullständigt godkänd. Förstudiens uppgift om att ingen omräkning gjorts är historisk: efterföljande omräkning har gjorts i LibreOffice, inte i Microsoft Excel.
