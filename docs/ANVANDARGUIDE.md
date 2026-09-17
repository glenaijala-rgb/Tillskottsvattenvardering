# Börja använda programmet

## Starta

Öppna mappen `D:\kod\Tillskottsvattenvardering` och dubbelklicka på **Starta.cmd**. Programmet öppnas i webbläsaren. Det körs på din egen dator.

## Prova med ett enkelt exempel

1. Välj **Öppna syntetiskt typfall**.
2. Välj **Beräkna**. Exemplet sparas automatiskt som ett eget projekt.
3. Öppna **Resultat**. Där syns värdering, diagram och detaljer.

Exemplet är testdata. Det är inte en värdering av ett verkligt område.

## Skapa ett eget projekt

1. Välj **Nytt projekt** och ange namn och område.
2. Fyll i **Nuläge**. Ange 0 där en kostnad eller effekt inte är aktuell. Tomma fält betyder att en uppgift saknas.
3. Ett säkert värde anges bara i **Mest troligt**. För ett osäkert värde anges även **Min** och **Max**.
4. Fyll i **Åtgärder**. Aktivera de alternativ du vill jämföra.
5. Välj **Beräkna med stöd** vid det aktuella fältet. Stödvärden förs över först när du väljer **Använd**. Läs fältets korta förklaring eller fäll ut **Läs mer**.
6. Välj **Spara projekt** när du vill spara arbetet, även om det inte är färdigt.
7. Välj **Beräkna** när underlaget är komplett. Saknade eller felaktiga uppgifter visas i ett meddelande.

## Läs resultatet

Ett positivt **nettonuvärde** betyder att beräknade nyttor är större än kostnaderna. **P50** är medianen. **P05–P95** visar modellens osäkerhetsintervall under de antaganden du har matat in. **Annuitet** är ett motsvarande årligt belopp.

Byggkostnader fördelas över båda de angivna byggåren och alla år däremellan. Löpande nyttor börjar året efter färdigställandet. Belopp är utan moms, inflation och låneränta.

Varje beräkning sparas. Du kan välja en äldre körning högst upp på resultatsidan. Ändrade indata räknar inte automatiskt om gamla resultat. När du väljer **Skriv ut / spara PDF** skrivs den valda körningens resultat och indata ut.

## Behåll dina projekt

**Säkerhetskopiera** skapar en kopia i mappen `backups`. **Visa säkerhetskopior** låter dig välja en kopia och återställa den som nya projekt. Befintliga projekt skrivs inte över. Kopiera gärna färdiga säkerhetskopior till en annan disk.

**Kopiera sparat projekt** skapar ett självständigt projekt. Spara ändringar först om de ska följa med. **Arkivera** gömmer ett projekt från den vanliga listan. Kryssa i **Visa arkiverade** för att öppna eller återställa det.

Dina data finns i `data/projects.sqlite3`. Redigera inte databasfilen manuellt medan programmet körs. Att stänga webbläsarfliken stoppar inte servern. `Stoppa.ps1` stoppar programmets egen registrerade server om du behöver stänga den.

## Kvarvarande verifiering

Appen är en första lokal version. Grundfilen innehåller fel som har dokumenterats och flera beräkningsregler har förtydligats. Läs `docs/VERIFIERING.md` och `docs/BESLUT_OCH_FRAGOR.md` innan resultat används som beslutsunderlag. Microsoft Excel-verifieringen och ARV-modellens verksamhetsmässiga granskning återstår.

## Hjälp direkt vid fälten

Reningsverksstödet finns vid grundvattenpåverkan under Rening och fyller i alla tre marginalvärden. Översvämningsstödet finns vid antal källaröversvämningar. Klimat- och trafikstöden finns vid respektive fält i den valda åtgärden.

Efter att du har använt ett stöd öppnar **Visa eller ändra underlag** de sparade indata igen. Ett manuellt ändrat resultat markeras som eget värde. Tidigare stöddata finns kvar. Ändringar i stödets formulär används först efter **Beräkna stödvärde** och **Använd**; spara sedan projektet. Stänger du stödet eller byter flik innan dess lämnas utkastet bort.

Klimat- och trafikstödet hämtar ledningslängder från senast använda stöd för samma åtgärd. Ändrade längder behöver beräknas och användas i båda stöden. En uppmaning visas vid ett tidigare beräknat värde vars längder skiljer sig. Underlag delas inte mellan olika åtgärder.

## Rätta inmatningsfel

Om Beräkna hittar fel öppnas den del där första felet finns. Berörda fält får röd markering och feltext. Samma text visas när muspekaren hålls över fältet och är kopplad till fältet för skärmläsare. Flikar och åtgärder med fel märks med Fel. Markeringarna avser senaste försöket: rätta uppgifterna och välj Beräkna igen för en ny kontroll.
