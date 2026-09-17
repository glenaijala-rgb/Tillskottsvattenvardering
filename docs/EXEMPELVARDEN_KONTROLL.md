# Dubbelkontroll av exempelvärden

Kontrollerat mot TSV KNA.xlsb, dess extraherade cellvärden och Vägledning. Tabellen avser synliga exempel och användarindata; dolda modellkonstanter i Inv ARV är inte projektspecifika startvärden. En separat SVU-rapport har inte tillhandahållits eller granskats här.

## Nuläge

Samtliga elva exempelposter överensstämmer med originalets numeriska värden. Automatiskt jämförda G–I mot programmets EXAMPLES.

| Fält | Min / trolig / max | Källa | Utfall |
|---|---|---|---|
| Rening – kommunens utgift | 0.63 / 0.95 / 4.7 kr/m³ | Nuläge!G17:I17 | Redan korrekt |
| Klimatpåverkan rening | 0.03 / 0.12 / 0.22 kg CO₂e/m³ | Nuläge!G18:I18 | Redan korrekt |
| Energi för pumpning | 0.1 / 0.13 / 0.16 kWh/m³ | Nuläge!G24:I24 | Redan korrekt |
| Elpris inklusive nätavgift och skatt | 0.56 / 1.25 / 4.0 kr/kWh | Nuläge!G25:I25 | Redan korrekt |
| Klimatpåverkan elanvändning | – / 0.35 / – kg CO₂e/kWh | Nuläge!G26:I26 | Redan korrekt |
| Fysiska skador – mindre byggnader | 65000.0 / 70000.0 / 80000.0 kr/st | Nuläge!G32:I32 | Redan korrekt |
| Fysiska skador – större byggnader | 450000.0 / 530000.0 / 640000.0 kr/st | Nuläge!G33:I33 | Redan korrekt |
| Övriga konsekvenser – mindre byggnader | 4000.0 / 11000.0 / 15000.0 kr/st | Nuläge!G34:I34 | Redan korrekt |
| Övriga konsekvenser – större byggnader | 31000.0 / 83000.0 / 121000.0 kr/st | Nuläge!G35:I35 | Redan korrekt |
| Intern kostnad bräddning | 2.0 / 5.0 / 650.0 kr/m³ | Nuläge!G39:I39 | Redan korrekt |
| Extern kostnad bräddning | 3.0 / 15.0 / 87.0 kr/m³ | Nuläge!G40:I40 | Redan korrekt |

## Stödberäkningar

| Uppgift | Värden i grundfilen | Källa | Åtgärd |
|---|---|---|---|
| Klimat, schaktfritt | 1 / 10 / 217 kg CO₂e/m | Beräkningshjälp!H48:J48 | Redan kompletterat och verifierat |
| Klimat, schakt | 33 / 104 / 855 kg CO₂e/m | Beräkningshjälp!H49:J49 | Redan kompletterat och verifierat |
| Tidskostnad trafik | 125 kr/timme/fordon, fast | Beräkningshjälp!I63 | Saknades, nu startvärde och information |
| Arbetstakt schaktfritt | 80 / 100 / 150 m/dygn | Beräkningshjälp!H66:J66 | Trolig fanns, min/max tillagda |
| Arbetstakt schakt | 4 / 5 / 6 m/dygn | Beräkningshjälp!H67:J67 | Trolig fanns, min/max tillagda |
| Försening | 5 / 30 / 120 sekunder/fordon | Beräkningshjälp!H68:J68 | Saknades, nu startvärden och information |
| Trafikmängd | 300 / 5000 / 40000 fordon/dygn | Beräkningshjälp!H69:J69 | Saknades, nu startvärden och information |
| ARV bygg/installation | 70/30 %, livslängd 50/25 år, reinvestering 30/50 % | Beräkningshjälp!H8:I10 | Redan korrekta; bakgrund och tabell tillagda |
| Återkomsttider | 1, 2, 5, 10, 20, 100 år | Beräkningshjälp!C28:C33 | Redan korrekta; bakgrund tillagd |

## Uppgifter som grundfilen inte ger startvärden för

Volymer, antal översvämningar, byggnadsandelar, projektspecifika byggkostnader, längder, åtgärdseffekter, år för nyinvestering och faktisk andel tillskottsvatten behöver egna underlag. Appens ARV-startantaganden 50 %/2032 och nollor för längder och skadeantal är inte Göteborgsexempel. Byggnadsandelens 100 % mindre byggnader är också ett appantagande. Koldioxidvärderingen 1 kr/kg är användarens valda startvärde; analysår och ränta är redigerbara appantaganden. Dessa ska inte presenteras som lokalt fastställda fakta.

Göteborgsexempel är historiska. Ursprung anges som grundfilen; fullständig studiereferens eller prisår som inte framgår där har inte hittats på. Vägledningen nämner VTI för trafiktid, försäkringsstatistik för fysiska översvämningsskador, norsk värderingsstudie för olägenhet och lokal betalningsviljestudie för extern bräddningskostnad. Sådana bakgrunder finns nu i informationsrutorna.

Tidigare sparade stöd ersätts inte. Nya trafikstöd får hela osäkerhetsintervallet och källtext. Beräkningsmotorn är oförändrad.

## Verifiering av kompletteringen

Numeriska celljämförelser godkända för elva nulägesposter, sju klimat-/trafikposter och sex ARV-konstanter. TypeScript och produktionsbygge godkända. Webbläsarkontroll bekräftade samtliga nya trafikintervall, fast tidskostnad 125 och fungerande beräkning: 100 m schaktfritt ger 5 208,33 kr med troliga indata. ARV-informationsrutan visar skillnaden mellan grundfilens exempel och appens egna startantaganden. Inga befintliga användarprojekt ändrades.
