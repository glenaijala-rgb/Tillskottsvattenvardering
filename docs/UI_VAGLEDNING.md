# Placering av vägledning i gränssnittet

Grundfilens introduktion och numrerade vägledning har gåtts igenom tillsammans med appens hjälptexter. UI-texterna innehåller inga hänvisningar till numrerade punkter som användaren måste slå upp. Cellreferenser finns kvar som källangivelse, tillsammans med själva informationen.

| Innehåll från grundfilen | Placering i appen |
|---|---|
| Syfte, samhällsperspektiv, bredare beslutsunderlag, iterativt arbete | Projekt → Så används modellen |
| Resursåtgång, moms, inflation, avskrivningar, låneränta | Information vid monetära huvudparametrar |
| Separeringsprojekt och privata kostnader | Investeringsutgiftens egen information |
| Tidshorisont, ränta, koldioxidvärdering | Information vid respektive analysfält |
| Min, mest troligt, max och osäkerhetsfördelning | Utfällbar information i varje parametergrupp |
| Slumpfrö och antal simuleringar | Information vid respektive fält under Beräkningsinställningar |
| Göteborgsexempel och ursprung | Information vid fältet med numeriska värden, enhet och källcell |
| Volymer, rening, pumpning, bräddning, övriga kostnader | Respektive huvudparameters korttext och information |
| Skador, olägenhet och byggnadsandelar | Fältens information under Källaröversvämningar |
| Val av alternativ och namn | Åtgärdernas aktiveringsval, namn och introduktion |
| Byggstart och färdigställande | Egen information vid de två årsfälten |
| Förnyelse, övriga nyttor och åtgärdseffekter | Respektive åtgärdsfälts information |
| ARV-metod och giltighetsbegränsningar | Marginalvärdenas information och synlig begränsning; stödets egna fält har förklaringar av andelar, investeringsår, livslängder och reinvesteringar |
| Riskbaserat översvämningsunderlag | Stödets information med återkomsttider, skadeantal, källa och antaganden |
| Klimat och trafik | Stödens sammanställning samt egen information vid längd, emissionsfaktor, arbetstakt, försening, trafikmängd och tidskostnad |
| NNV, annuitet, percentiler, diagram och årstabeller | Resultatens förklaring och texter intill diagram/tabeller |

Förklaringar beskriver programmets nuvarande metod där den avviker från Excel, exempelvis reproducerbar simulering, tidsregler, ARV-P50 och diskonterade kategoridiagram. Historiska råd presenteras inte som aktuella rekommendationer. Detaljerad introduktion om ränta/år/koldioxid har ersatts av information direkt vid varje fält.

Verifiering: TypeScript och produktionsbygge godkända. Sökning efter numrerade punkthänvisningar i UI-källorna gav inga träffar. I webbläsaren kontrollerades räntans informationsruta och trafikstödets egen förklaring av försening. Befintliga projekt och beräkningsregler är oförändrade.
