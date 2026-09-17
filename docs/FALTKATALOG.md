# Fältkatalog och källkoppling

2026-09-17. Celladresser avser TSV KNA.xlsb. Katalogen är en implementeringsgrund, inte en bekräftelse av att alla originalformler är riktiga.

## Nuläge

| Parameter | Cell eller indataområde | Typ |
|---|---|---|
| Startår analys | C5 | Heltal |
| Slutår analys | C6 | Heltal |
| Diskonteringsränta [%] | C7 | Fast numeriskt värde |
| Samhällskostnad av koldioxid [kr/CO2-eq] | C8 | Fast numeriskt värde |
| Volym tillskottsvatten [m3/år] | C14:E14 | Min / trolig / max eller fast troligt värde |
| Utgift för kommunen för rening av tillskottsvatten [kr/m3] | C17:E17 | Min / trolig / max eller fast troligt värde |
| Klimatpåverkan rening [kg CO2-eq/m3] | C18:E18 | Min / trolig / max eller fast troligt värde |
| Investering reningsverk - grundvattenpåverkan [kr/m3] | C19:E19 | Min / trolig / max eller fast troligt värde |
| Investering reningsverk - trög regnpåverkan [kr/m3] | C20:E20 | Min / trolig / max eller fast troligt värde |
| Investering reningsverk - snabb regnpåverkan [kr/m3] | C21:E21 | Min / trolig / max eller fast troligt värde |
| Energi för pumpning [kWh/m3] | C24:E24 | Min / trolig / max eller fast troligt värde |
| Utgift för kommunen för el [kr/kWh] | C25:E25 | Min / trolig / max eller fast troligt värde |
| Klimatpåverkan elanvändning [kg CO2-eq/kWh] | D26 | Fast värde |
| Totalt antal källaröversvämningar [st/år] | C29:E29 | Min / trolig / max eller fast troligt värde |
| Andel översvämmade mindre byggnader (småhus och motsvarande) [%] | D30 | Fast värde |
| Andel översvämmade större byggnader (flerfamiljshus, handelsbyggnader och motsvarande) [%] | D31 | Föreslaget beräknat komplement |
| Kostnad källaröversvämning mindre byggnad - fysiska skador [kr/st] | C32:E32 | Min / trolig / max eller fast troligt värde |
| Kostnad källaröversvämning större byggnad - fysiska skador [kr/st] | C33:E33 | Min / trolig / max eller fast troligt värde |
| Kostnad källaröversvämning mindre byggnad - övriga kostnader [kr/st] | C34:E34 | Min / trolig / max eller fast troligt värde |
| Kostnad källaröversvämning större byggnad - övriga kostnader [kr/st] | C35:E35 | Min / trolig / max eller fast troligt värde |
| Volym bräddat avloppsvatten [m3/år] | C38:E38 | Min / trolig / max eller fast troligt värde |
| Intern kostnad bräddning [kr/m3 bräddat vatten] | C39:E39 | Min / trolig / max eller fast troligt värde |
| Extern kostnad bräddning [kr/m3 bräddat vatten] | C40:E40 | Min / trolig / max eller fast troligt värde |
| Övriga kostnader [kr/år] | C43:E43 | Min / trolig / max eller fast troligt värde |

Andelar och ränta lagras som andel av 1 i beräkningar, men visas som procent. Inmatningsgrupperna saknar ifyllda projektvärden i den avlästa filen. Exempelvärden finns separat i G:I och är inte aktiva projektdata. Anteckningsområdet börjar vid rad 46.

## Åtgärder

| Parameter | Alternativ 1 | Alternativ 2 | Alternativ 3 |
|---|---|---|---|
| Välj vilka åtgärder som ska ingå i analysen (ja/nej) | D6 | G6 | J6 |
| Namn på åtgärd | C7 | F7 | I7 |
| Startår genomförande av åtgärd (årtal) | D10 | G10 | J10 |
| Slutår genomförande av åtgärd (årtal) | D11 | G11 | J11 |
| Total investeringsutgift [kr] | C12:E12 | F12:H12 | I12:K12 |
| Total klimatpåverkan anläggning [kg CO2-eq] | C13:E13 | F13:H13 | I13:K13 |
| Total kostnad för påverkan av trafiken under byggnation [kr] | C16:E16 | F16:H16 | I16:K16 |
| Nytta pga minskat behov av förnyelse [kr/år efter slutförd åtgärd] | C17:E17 | F17:H17 | I17:K17 |
| Övriga kostnader [kr/år efter slutförd åtgärd] | C18:E18 | F18:H18 | I18:K18 |
| Övriga nyttor [kr/år efter slutförd åtgärd] | C19:E19 | F19:H19 | I19:K19 |
| Minskning tillskottsvatten [m3/år] | C22:E22 | F22:H22 | I22:K22 |
| Andel grundvattenpåverkan av minskad volym [%] | D23 | G23 | J23 |
| Andel trög regnpåverkan av minskad volym [%] | D24 | G24 | J24 |
| Andel snabb regnpåverkan av minskad volym [%] | D25 | G25 | J25 |
| Minskning källaröversvämning [st/år] | C26:E26 | F26:H26 | I26:K26 |
| Minskning bräddning [m3/år] | C27:E27 | F27:H27 | I27:K27 |

Intervallkolumnerna är min/trolig/max. Start- och slutår samt flödesandelar behandlas som fasta värden. Anteckningsområdet börjar vid rad 29. Namnfältens celler är förankrade i hänvisningarna från Ber!G2:I2.

## Beräkningshjälp

| Hjälp | Indata | Utdata |
|---|---|---|
| Reningsverksinvestering | D4 andel tillskottsvatten, D6 investeringsår, E8:F10 bygg/installation, livslängd och reinvestering | D18:F21, varav raderna 19–21 motsvarar Nuläge raderna 19–21 |
| Översvämningsrisk | C28:C33 återkomsttider och D28:D33 skadeantal | D35 förväntat antal per år |
| Klimatpåverkan | D43:E45 längder per alternativ, D48:F49 utsläppsfaktorer | D53:L53, enheter och percentilordning måste rättas/fastställas |
| Trafikpåverkan | D59:E61 längder, E63 tidskostnad, D66:F69 hastigheter/försening/ÅDT | D73:L73, percentilordning måste kontrolleras |

## Resultatkoppling

| Resultat | Källområde |
|---|---|
| NNV, sammanfattning | Resultat!D4:F4 via Ber!BJ14:BL14 |
| Annuitet | Resultat!D5:F5 |
| Årliga kostnader | Resultat!B108:N117 |
| Årliga nyttor | Resultat!B119:N122 |
| Investeringskostnader | Resultat!B124:N127 |
| Percentiler | Ber!A18:A22 och motsvarande resultatkolumner |

## Lagring för varje indataparameter

Parameterkod, tillhörande projektrevision/alternativ, enhet, fast värde eller fördelningstyp, min/trolig/max, källa och kommentar. Hjälpberäknade värden ska också peka på sparad hjälpkalkyl. En uppgift utan känd källa får sparas men ska inte automatiskt märkas som verifierad.
