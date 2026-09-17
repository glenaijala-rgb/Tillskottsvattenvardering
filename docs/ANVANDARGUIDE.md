# Börja använda programmet

## Starta

Öppna mappen `D:\kod\Tillskottsvattenvardering` och dubbelklicka på **Starta.cmd**. Programmet öppnas i webbläsaren. Det körs på din egen dator.

## Prova med ett enkelt exempel

1. Välj **Mina projekt** och sedan **Öppna syntetiskt typfall**.
2. Öppna **Granska** och välj **Beräkna och visa resultat**. Exemplet sparas som ett eget projekt.
3. På **Resultat** visas en sammanfattning. Öppna jämförelsetabell, diagram och detaljer vid behov.

Exemplet är testdata. Det är inte en värdering av ett verkligt område.

## Skapa ett eget projekt

1. Välj **Mina projekt → Nytt projekt**. Ange namn, område och analysförutsättningar i steg **Projekt**.
2. Fyll i **Nuläge**, en grupp i taget. Använd delmenyn eller **Nästa**. Välj **Inte aktuellt** vid områdesrubriken eller posten om den inte ingår. Tomma aktiva fält betyder att en uppgift saknas.
3. Ett fast värde anges bara i **Mest troligt**. Välj **Ange ett osäkerhetsintervall** för att visa **Min** och **Max**. Befintliga gränser visas automatiskt. För att återgå till ett fast värde behöver du själv tömma både min och max; att byta vy raderar inget.
4. Fyll i **Åtgärder**. Aktivera de alternativ du vill jämföra.
5. Välj **Beräkningsstöd** vid det aktuella fältet. Stödvärden förs över först när du väljer **Använd**. Läs fältets korta förklaring eller öppna **ⓘ Information**.
6. Välj **Spara projekt** när du vill spara arbetet, även om det inte är färdigt.
7. Öppna **Granska**. Klicka på ett fel för att komma till rätt uppgift. Granska även källor och bortval. Välj sedan **Beräkna och visa resultat**. Kontrollen använder samma regler som beräkningen och sparar inget på egen hand.

## Läs resultatet

Ett positivt **nettonuvärde** betyder att beräknade nyttor är större än kostnaderna. **P50** är medianen. **P05–P95** visar modellens osäkerhetsintervall under de antaganden du har matat in. **Annuitet** är ett motsvarande årligt belopp.

Byggkostnader fördelas över båda de angivna byggåren och alla år däremellan. Löpande nyttor börjar året efter färdigställandet. Belopp är utan moms, inflation och låneränta.

Varje beräkning sparas. Du kan välja en äldre körning högst upp på resultatsidan. Ändrade indata räknar inte automatiskt om gamla resultat. När du väljer **Skriv ut / spara PDF** skrivs den valda körningens resultat och indata ut.

## Behåll dina projekt

Öppna **Mina projekt** för projektlistan, arkivet och säkerhetskopiorna.

**Säkerhetskopiera** skapar en kopia i mappen `backups`. **Visa säkerhetskopior** låter dig välja en kopia och återställa den som nya projekt. Befintliga projekt skrivs inte över. Kopiera gärna färdiga säkerhetskopior till en annan disk.

**Kopiera sparat projekt** skapar ett självständigt projekt. Spara ändringar först om de ska följa med. **Arkivera** gömmer ett projekt från den vanliga listan. Kryssa i **Visa arkiverade** för att öppna eller återställa det.

Dina data finns i `data/projects.sqlite3`. Redigera inte databasfilen manuellt medan programmet körs. Att stänga webbläsarfliken stoppar inte servern. `Stoppa.ps1` stoppar programmets egen registrerade server om du behöver stänga den.

## Kvarvarande verifiering

Appen är en första lokal version. Grundfilen innehåller fel som har dokumenterats och flera beräkningsregler har förtydligats. Läs `docs/VERIFIERING.md` och `docs/BESLUT_OCH_FRAGOR.md` innan resultat används som beslutsunderlag. Microsoft Excel-verifieringen och ARV-modellens verksamhetsmässiga granskning återstår.

## Hjälp direkt vid fälten

Reningsverksstödet finns vid grundvattenpåverkan under Rening och fyller i alla tre marginalvärden. Översvämningsstödet finns vid antal källaröversvämningar. Klimat- och trafikstöden finns vid respektive fält i den valda åtgärden.

Efter att du har använt ett stöd öppnar **Beräkningsstöd** de sparade indata igen. Ett manuellt ändrat resultat markeras som eget värde. Tidigare stöddata finns kvar. Ändringar i stödets formulär används först efter **Beräkna stödvärde** och **Använd**; spara sedan projektet. Stänger du stödet eller byter steg eller grupp innan dess lämnas utkastet bort.

Klimat- och trafikstödet hämtar ledningslängder från senast använda stöd för samma åtgärd. Ändrade längder behöver beräknas och användas i båda stöden. En uppmaning visas vid ett tidigare beräknat värde vars längder skiljer sig. Underlag delas inte mellan olika åtgärder.

## Rätta inmatningsfel

Om Beräkna hittar fel öppnas den del där första felet finns. Berörda fält får röd markering och feltext. Samma text visas när muspekaren hålls över fältet och är kopplad till fältet för skärmläsare. Flikar och åtgärder med fel märks med Fel. Markeringarna avser senaste kontrollen: rätta uppgifterna och öppna Granska igen. Där finns länkar direkt till felaktiga fält.

## Välj bort det som inte ingår

Små kryssrutor **Inte aktuellt** finns vid områdena Rening, Pumpning, Källaröversvämningar och Bräddning samt vid valbara enskilda poster. Bortvalda fält fälls ihop. Tidigare värden och stöddata bevaras och kommer tillbaka när du tar bort krysset.

Ett bortvalt område i nuläget gäller hela jämförelsen. Om källaröversvämningar eller bräddning inte ingår, utelämnas även motsvarande minskning i samtliga åtgärder. Enskilda bortval i en åtgärd gäller bara den åtgärden. Analysförutsättningar och volym tillskottsvatten behöver fortfarande anges.

Resultatet redovisar bortvalen under **Ingår inte i värderingen**, även i utskriftsunderlaget. De sparas med projektet och varje resultatkörning. Äldre projekt ändras inte automatiskt: tidigare nollor ligger kvar tills du väljer något annat.

## Startvärden och information

Nya projekt börjar med koldioxidvärderingen **1 kr/kg CO₂e**. Fält som har Göteborgsexempel i grundfilen fylls automatiskt med exemplets min-, trolig- och maxvärden. Startvärdena är redigerbara. Uppgifter utan exempel, exempelvis volym tillskottsvatten, behöver fortfarande fyllas i. Befintliga projekt och sparade resultat ändras inte.

Öppna **ⓘ Information** vid ett fält för fördjupning, källa och kommentar. Där visas också Göteborgsexemplets ursprungliga värden med enhet och cellrad i grundfilen samt om dina värden avviker. Exemplen är historiska och behöver bedömas för ditt område. Knappen för att kopiera exempelvärden har tagits bort.

**Slumpfrö** och **Simuleringar** finns under **Beräkningsinställningar** i Projekt. Inställningarna är normalt hopfällda och behöver oftast inte ändras. Andel mindre/större översvämmade byggnader finns under **Källaröversvämningar** och döljs tillsammans med området om det markeras Inte aktuellt.

### Fördelning av borttaget tillskottsvatten

Ange grundvattenpåverkan och trög regnpåverkan. Snabb regnpåverkan fylls automatiskt med resten upp till 100 %. De två inmatade andelarna får tillsammans vara högst 100 %. Vid fel blir andelsfälten och förklaringen röda; håll muspekaren över fälten för förklaringen. Markeringen försvinner när fördelningen är giltig.
