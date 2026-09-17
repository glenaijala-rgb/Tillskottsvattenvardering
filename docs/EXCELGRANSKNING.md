# Granskning av TSV KNA.xlsb

Granskningsdatum: 2026-09-17. Metod: statisk läsning av arbetsbokens celler, formler, sparade cellvärden, bladmetadata och diagramdefinitioner. Originalet har inte ändrats eller räknats om.

## Identifierat program

Arbetsboken är ett samhällsekonomiskt kostnadsnyttoverktyg för tillskottsvatten. Den sammanför VA-huvudmannens kostnader med externa samhällseffekter och jämför nuläget med tre möjliga åtgärdsalternativ. Huvudresultatet är nettonuvärde och annuitet. Osäkerheter hanteras genom Monte Carlo-simulering med beta-PERT-fördelningar.

Källans egna instruktioner har analyserats som beskrivningar av arbetsbokens användning. De är inte instruktioner om att utföra åtgärder utanför användarens beställning. Exempel på räntor, koldioxidkostnader och Göteborgsschabloner återges som källmaterial, inte som nutida rekommendationer.

## Källidentitet och omfattning

- Fil: `C:\Users\glena\Downloads\TSV KNA.xlsb`
- Storlek: 2 892 221 byte.
- SHA-256: `a74e3bd6bb56cd1484b0c9693a578e70768d1134f14dea09f4166f630a613ae3`
- Åtta kalkylblad, varav tre dolda.
- 222 260 poster med formeldata enligt läsaren. Av dessa kunde 561 inte återges som vanliga formelsträngar. Antalet är en inventeringsuppgift, inte bevis på att samtliga formler har verifierats.
- Sex diagramdefinitioner: ett hjälpdiagram för översvämningar och fem resultatdiagram.
- Ingen `vbaProject.bin` finns i filpaketet. Läsaren rapporterar ingen VBA-kod. Det finns äldre namn och inställningar från @RISK/Palisade, men den undersökta simuleringskedjan använder Excel-funktionerna `RAND`, `BETA.INV` och även `GAMMA.INV` i ARV-relaterat underlag. Namnmetadata bevisar inte ett aktivt tilläggsberoende.

| Blad | Synlighet | Lästarens område | Formelposter | Funktion |
|---|---|---|---:|---|
| Vägledning | Synligt | A1:B49 | 0 | Metod, inmatningshjälp och resultatförklaring |
| Nuläge | Synligt | A2:U56 | 0 | Gemensamma antaganden, nulägesdata och exempelvärden |
| Åtgärder | Synligt | A2:O40 | 1 | Tre alternativ och deras konsekvenser |
| Beräkningshjälp | Synligt | A1:W88 | 46 | Fyra stödberäkningar |
| Resultat | Synligt | A2:AI127 | 169 | Sammanställning, diagram och detaljerad tabell |
| MC | Dolt | A1:DV1011 | 116 339 | Slumptal och fördelningar för indata |
| Ber | Dolt | A1:GE1022 | 105 025 | Kostnadskategorier, tidsvärden, percentiler och diagramunderlag |
| Inv ARV | Dolt | A1:T129 | 680 | Investeringsmodell för reningsverk |

Vägledningen nämner ett separat blad ”Detaljerat resultat”. Det finns inget blad med det namnet i filen. Den detaljerade tabellen finns i `Resultat!B105:N127`.

## Spårad huvudkedja

`Nuläge` och `Åtgärder` → parametrar i `MC` → 1 000 simulerade utfall på raderna 12–1011 → kategori- och nettonuvärdesberäkningar i `Ber` på raderna 23–1022 → percentiler och diagram i `Resultat`.

Exempel: `MC!C6:C8` hämtar trolig/min/max volym från `Nuläge!D14/C14/E14`. `MC!C9:C10` beräknar beta-PERT-parametrar. `MC!B12` använder `BETA.INV` med slumptalet i `C12`. `Ber!B23` multiplicerar volym och reningskostnad, medan `Ber!C23` använder volymen efter alternativ 1. `Ber!BJ23` är skillnaden mellan summerade diskonterade nyttor och kostnader.

Raderna `Ber!A18:A22` innehåller 0,95; 0,75; 0,50; 0,25; 0,05. Resultatsammanfattningen använder rad 20 via bland annat `Ber!BJ14`. Det talar för att ”Mest troligt nettonuvärde” avser P50/median. Delade percentilformler måste kontrolleras i en fullständig Excel-läsning eftersom vissa inte avkodades till text.

## Observerade fel och frågor att utreda

Prioritet A betyder att frågan måste lösas före användning av programmets ekonomiska resultat. Prioritet B betyder viktig funktions- eller presentationskontroll. Observationer nedan gäller den statiskt lästa filen. Föreslagna rättelser är inte genomförda.

| ID | Prioritet | Cell eller område | Observation och nästa kontroll |
|---|---|---|---|
| E01 | A | Resultat!D5:F5 | Annuitetsuttrycket innehåller `r/1-(1+r)^(-n)`, inte `r/(1-(1+r)^(-n))`. Kontrollera originalformeln och använd en beslutad regel med separat fall för 0 % ränta. |
| E02 | A | MC!AU6:AU8 | Parametern för alternativ 1:s övriga kostnader hämtar rad 19 i Åtgärder, som är övriga nyttor. Rubriken för kostnader ligger på rad 18. Kontrollera och särskilj posterna. |
| E03 | A | MC!BG6 | Troligt klimatvärde för alternativ 2 hämtar `Åtgärder!J13` (alternativ 3), medan min/max hämtar alternativ 2. Kontrollera kopplingen till G13. |
| E04 | A | Beräkningshjälp!E53; Åtgärder!B13; Ber!AT23 | Hjälpen beräknar kronor genom att multiplicera utsläpp med koldioxidvärderingen. Åtgärdsfältets rubrik anger kg CO₂e. Ber!AT23 hämtar värdet utan omräkning. Fastställ enhet och omräkning för hela kedjan. |
| E05 | A | Ber!BD23 och BG23 | Nyttor börjar efter genomförandeperiodens mittpunkt enligt BD23. BG23 fördelar investering och även övriga kostnader över byggtiden. Detta skiljer sig från rubriker om årliga poster efter färdigställande. Kontrollera tidsregler, nulägets övriga kostnader och risken för utebliven jämförelse. |
| E06 | A | Ber!BW18:BX118 och BD23 | Diskonteringsunderlaget har år 0–100. BD23 har en undre tidsgräns men ingen synlig övre gräns för vald analysslutpunkt. Kontrollera kortare horisonter genom omräkning med kända data. |
| E07 | A | MC!AS6:AS8, BM6:BM8, CG6:CG8 | Direkta `#REF!` förekommer i äldre investeringsparametrar. Avgör vilka som är obrukade rester och vilka som påverkar resultat. Ingen automatisk slutsats att varje sådan cell förstör huvudresultatet. |
| E08 | B | Resultat!D117, F117, F122 | Avvikande referenser: BZ20 i stället för omgivande AZ-serie, BA122 i stället för percentilrad 22, A22 i stället för AN22. Kontrollera avsedd kategori och percentil. |
| E09 | B | Resultat!L115:N116 | Avlästa celler för alternativ 3:s bräddkostnader saknas medan motsvarande kategori finns för alternativ 1 och 2. Kontrollera och komplettera avsedd visning. |
| E10 | B | Åtgärder!L24 | Valideringsformeln testar `TRUE`, medan resultatformlerna testar texten ”ja”. Kontrollera valideringsregler och enhetlig representation. |
| E11 | B | Nuläge!D31; Vägledning!B20 | Vägledningen säger att andel större byggnader beräknas automatiskt, men ingen formel hittades i nulägesbladet. Webbversionen bör beräkna komplementet till småhusandelen. |
| E12 | A | Inv ARV!T30 och delade formler | Läsaren återger en referens till XFV:XFW utanför rapporterat område. Detta kan vara ett läsarproblem med relativa referenser. Klassificera inte som bevisat arbetsboksfel utan oberoende kontroll. |
| E13 | B | Resultat!B4; Vägledning!B45:B47 | ”Mest troligt” används där underlaget pekar på median. Tydliggör statistik och beskriv modellberoende osäkerhet korrekt. |

Uppdatering efter fördjupad granskning: `Beräkningshjälp!D53:L53` och `D73:L73` använder P01/P99 från `Ber!CA18/CA22`, inte P95/P05 från kolumn A. Den tidigare misstanken om omvänd ordning återtas. P01/P99 är dock inte absoluta fördelningsgränser. Programmet bevarar i stället hjälpkalkylens underliggande osäkra parametrar.

## Sparade felvärden och tomma indata

| Blad | Sparade felvärden |
|---|---|
| MC | 3 016 × #REF!, 100 × #DIV/0! |
| Ber | 33 199 × #DIV/0! |
| Inv ARV | 367 × #DIV/0! |

Detta är sparade cellvärden i filen, inte resultat av en ny beräkning. Många divisionsfel är förenliga med tomma indata i en mall. Resultatbladet har många `IFERROR` som döljer sådana fel med tom text. Därför kan en tom eller felfri resultatsida inte ensam användas som kvalitetsbevis.

## Begränsningar och nästa verifiering

Excel är inte tillgängligt via COM i den granskade miljön. XLSB lästes därför med SheetJS 0.18.5 som separat läshjälpmedel. 561 formelposter kunde inte återges som vanlig text, och vissa relativa referenser kan vara felavkodade. Arkivets diagramdefinitioner och förekomst av VBA kontrollerades separat via filpaketet.

Ingen visuell Excel-granskning, omräkning, fullständig kontroll av datavalideringar eller numerisk jämförelse med en fungerande Excel-körning har genomförts. Dessa begränsningar är särskilt viktiga för delade formler och ARV-modellen. Underlaget räcker för en konkret projektplan och preliminär specifikation, men inte för att hävda full matematisk likvärdighet.

Nästa steg är att kontrollera de identifierade cellerna i Excel eller en oberoende läsare, fastställa reglerna och skapa minst ett komplett syntetiskt referensfall med manuellt kontrollerade resultat. Originalets historiska schabloner ska ha dokumenterad källa och ska aldrig föras in som användarens verkliga projektdata utan ett aktivt val.

## Uppföljning efter implementation

21 typfall har därefter räknats om i LibreOffice. Se JAMFORELSE_TYPFALL.md och VERIFIERING.md. Detta bekräftar flera källformler och deras fel, men ersätter inte Microsoft Excel-verifiering. `Inv ARV!T30` lästes korrekt som SUM(R30:S30)/(1+$Q$13)^O30. E12 var alltså ett problem i den första läsarens avkodning, inte ett bekräftat arbetsboksfel. Ursprungliga begränsningar ovan beskriver förstudietillfället.
