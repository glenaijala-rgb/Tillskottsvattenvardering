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
5. Använd **Beräkningshjälp** vid behov. Stödvärden förs över först när du väljer **Använd**.
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
