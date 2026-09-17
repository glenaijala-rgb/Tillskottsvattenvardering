# Testplan – jämförelse med Excel-grundfilen

2026-09-17. Krav från användaren: vissa tester ska vara rena typfall som körs både i grundfilen och i programmet för att jämföra resultaten.

Status 2026-09-17: 21 varianter av typfallen har körts i programmet och mot grundfilen i LibreOffice 26.2.4.2. Microsoft Excel-körningen återstår. Se JAMFORELSE_TYPFALL.md och VERIFIERING.md. Nedan beskrivs den ursprungliga testplanen; Excel-körskriptet är förberett.

## Gemensamt arbetssätt

Varje typfall ska ha samma dokumenterade indata i båda systemen. Använd en separat testkopia av den oförändrade grundfilen för varje fall. Originalet bevaras. Ändra endast indata i denna jämförelse, inte formler. Räkna om testkopian i Excel och spara utfallen. Enbart läsning av filens tidigare sparade resultat räknas inte som en körning.

De första fallen är deterministiska: fasta värden utan osäkerhetsintervall. Varje fall isolerar en effekt. Ovidkommande kostnader och effekter sätts uttryckligen till noll. Nödvändiga nämnare, livslängder och årtal får giltiga värden även när deras effekt inte används. Registrera hela indatauppsättningen, inte bara de värden som skiljer fallen åt.

Grundinställning för planerade huvudfall: analys 2030–2040, ränta 3 %, åtgärdsstart 2031 och slut 2032, ett aktivt alternativ, 1 000 m³ tillskottsvatten per år och minskning 100 m³/år. Flödesandelar anges giltigt, exempelvis 100 % grundvattenpåverkan. ARV-marginalnyttor sätts till noll utom i ARV-testet. Exakta tidsregler och fördelningen av byggkostnader fastställs före godkännande av förväntat NNV.

## Typfall

| ID | Isolerad funktion och indata | Kontroll och jämförelse |
|---|---|---|
| T01 | Ingen effekt: minskning 0, inga investeringar eller andra skillnader | NNV och annuitet ska vara 0. Nuläge och åtgärd har samma löpande kostnader. |
| T02 | Endast rening: 2 kr/m³, minskning 100 m³/år | 2 000 kr/år i nuläget, 1 800 efter åtgärd och 200 kr/år i besparing. Jämför även diskonterad nytta och NNV. |
| T03 | Endast pumpning: 0,1 kWh/m³ och 2 kr/kWh | 200 kr/år i nuläget, 180 efter åtgärd och 20 kr/år i besparing. |
| T04 | Endast klimat från rening: 0,2 kg CO₂e/m³ och 4 kr/kg CO₂e | 800 kr/år i nuläget, 720 efter åtgärd och 80 kr/år i besparing. |
| T05 | Endast översvämning: 2 händelser/år, minskning 1, 100 % småhus, fysisk skada 10 000 kr/st | 20 000 kr/år i nuläget, 10 000 efter åtgärd. Övrig skadekostnad är 0. |
| T06 | Endast bräddning: 100 m³/år, minskning 10, intern 3 och extern 5 kr/m³ | Intern besparing 30 och extern besparing 50 kr/år. Jämför båda kategorierna och summan 80. |
| T07 | Endast investering: 1 000 kr, inga nyttor | NNV ska vara negativt. Jämför byggårens belopp, diskonterad kostnad och annuitet mot handräkning med beslutade tidsregler. |
| T08 | Övriga kostnader och nyttor i två separata körningar: först endast 100 kr/år i åtgärdens kostnadsfält, sedan endast 100 kr/år i nyttofältet | Upptäck sammanblandning av fält, felaktigt tecken och fel tidsplacering. |
| T09 | Tre alternativ med samma övriga indata men klimatpåverkan 100, 200 och 300 kg CO₂e. Koldioxidvärde 4 kr/kg | Klimatkostnad före diskontering 400, 800 och 1 200 kr. Upptäck korskoppling mellan alternativ och enhetsfel. |
| T10 | T02 med ränta 0 %, därefter kort respektive lång tidshorisont | Jämför antal år med nytta, NNV och annuitet. Gränsfallen 1 och 100 år får egna giltiga genomförandeår, dokumenterade före körning. |
| T11 | Klimathjälp: 10 m schaktfritt × 2 kg/m och 5 m schakt × 4 kg/m, koldioxidvärde 4 kr/kg | 40 kg CO₂e och 160 kr. Kontrollera både hjälputdata och överföringen till åtgärden. |
| T12 | Trafikhjälp: 100 m schaktfritt, hastighet 100 m/dygn, 36 s försening, ÅDT 1 000 och tidskostnad 100 kr/timme/fordon. Ingen schaktlängd | 1 000 kr total trafikkostnad. Schakthastigheten ges ett giltigt positivt värde trots längd 0. |
| T13 | Översvämningshjälp: återkomsttider 1/2/5/10/20/100 år, skadeantal 0/0/0/0/0/10 | 0,3 förväntade översvämningar/år enligt grundfilens avlästa styckvisa formel. Kontrollera svansantagandet separat innan regeln godkänns. |
| T14 | ARV-hjälp: separata fall vid 30/40/50/60/70 % tillskottsvatten, därefter reinvestering | Lås först fullständiga ARV-indata. Jämför marginalnytta för varje flödeskomponent och interpolationen. Förväntade belopp tas fram i modellgranskningen, inte genom antagande att Excel alltid är rätt. |

Beloppen i tabellen är handberäknade förväntningar för isolerade delposter, inte uppmätta Excel-resultat. NNV och annuitet kräver dessutom fastställd tidsmodell. Varje test jämför även relevanta delresultat så att två fel inte kan ta ut varandra i totalsumman.

## Resultatprotokoll och godkännande

För varje fall sparas test-ID/version, fullständiga indata med cellkoppling, grundfilens hash, testkopians filnamn, Excel-version, omräkningsdatum, programversion och följande tabell:

| Resultatpost och enhet | Excel, omräknat | Program | Handberäknat förväntat | Skillnad program−Excel | Tolerans | Status och förklaring |
|---|---|---|---|---|---|---|
| Fylls i vid körning | Ej kört | Ej kört | Enligt typfall | Ej beräknad | Enligt enhet | Ej kört |

För deterministiska belopp används föreslagen tolerans `max(0,01 kr, abs(förväntat) × 10⁻⁸)` före visningsavrundning. Årtal och aktiveringsval jämförs exakt. För fysiska mängder bestäms en numerisk tolerans i rätt enhet innan fallet körs.

En oförklarad skillnad innebär att testet inte är godkänt. Om grundfilen ger ett felvärde, tomt resultat eller en konstaterat felaktig beräkning sparas även detta i protokollet. Programmet ska inte anpassas till felet enbart för att få samma tal. Dokumentera då grundfilens beteende, den beslutade rättelsen och det oberoende förväntade resultatet. En eventuell rättad Excel-kopia versionsmärks och körs separat, med båda jämförelserna bevarade. Markera resultatet ”godkänt mot beslutad regel, dokumenterad avvikelse från grundfil”.

## Osäkerhetstester

Efter de fasta typfallen införs min/trolig/max för en parameter åt gången. Jämför först fördelningsparametrar och därefter percentiler och totalresultat. Samma slumpfrö i två olika system garanterar inte samma slumptal. Exakt jämförelse kräver en gemensam förutbestämd slumpserie i en separat, dokumenterad testvariant. Körningar med oberoende slumpserier jämförs statistiskt med i förväg fastställda kriterier och upprepningar. Toleransen får inte höjas i efterhand för att dölja en skillnad.

## När testerna ska genomföras

Typfallen preciseras under projektplanens steg 1 och körs mot programmet under steg 2. Hela uppsättningen körs inför leverans i steg 5. De sparade kontrollerade resultaten används därefter som automatiska regressionstester. Vid ändringar i modellen körs berörda fall om i båda systemen. Testerna kompletterar kontroller av projektlagring och gränssnitt, som saknar motsvarighet i grundfilen.
