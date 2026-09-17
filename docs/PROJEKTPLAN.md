# Projektplan – Tillskottsvattenvärdering

Version 0.1 • 2026-09-17 • Förslag inför utveckling

## 1. Mål och fastställda ramar

Programmet ska ersätta Excel-arbetsbokens arbetsflöde för samhällsekonomisk kostnadsnyttoanalys av tillskottsvattenåtgärder. Användaren ska kunna skapa, spara, öppna och vidareutveckla flera värderingsprojekt.

Användarens krav är webbaserat gränssnitt, SQL-databas, projekt under `D:\kod` och ingen OpenShift-drift. Val av gränssnittsverktyg är fritt. Detta uppdrag omfattar förstudie, projektplan och specifikation, inte implementering av programmet.

Bekräftat av användaren: första versionen används av en person på den egna datorn. Den körs lokalt på Windows och öppnas i webbläsaren. Gemensam serverdrift och inloggning ingår inte i första versionen.

## 2. Vad första användbara versionen ska innehålla

- Projektlista med skapa, öppna, kopiera och arkivera projekt.
- Nuläge och upp till tre åtgärdsalternativ, motsvarande Excel-filen.
- Alla fyra beräkningshjälper: reningsverksinvestering, källaröversvämningsrisk, klimatpåverkan och trafikpåverkan.
- Beräkningsmotor för kostnader, nyttor, diskontering och osäkerhet.
- Resultat med nettonuvärde, annuitet, percentiler, diagram och kategorifördelning.
- Sparade beräkningskörningar som kan öppnas igen med samma indata och resultat.
- Säkerhetskopiering och återläsning av projektdata samt utskriftsvänlig resultatrapport.

Automatisk import av godtyckliga Excel-filer, GIS, ekonomisystem, fler än tre alternativ, avancerade behörighetsroller och publik molndrift är möjliga senare steg. De behövs inte för att ersätta just denna arbetsboks centrala funktioner. Manuell inmatning och explicit användning av exempelvärden ingår från början.

## 3. Arbetsordning och leveranser

| Steg | Arbete | Leverans och kriterium för klart |
|---|---|---|
| 0. Förstudie | Identifiera modell, indata, resultat och risker | Dessa dokument och cellförankrad fältkatalog. Genomförd strukturell granskning, inte fullständig matematisk certifiering. |
| 1. Fastställ beräkningsregler | Kontrollera parserbegränsningar, tidslogik, enheter, övriga kostnader, annuitet och ARV-modell | Regelkatalog med beslut för varje öppen fråga samt rena typfall med identiska indata för körning både i Excel-grundfilen och i programmet. |
| 2. Bygg och verifiera beräkningsmotorn | Deterministiska beräkningar först, därefter osäkerhet och hjälpkalkyler | Automatiska tester av räknefall, gränser och reproducerbarhet. Ingen Excel-installation behövs för körning. |
| 3. Projekt och SQL-lagring | Databas, versioner, spara/öppna/kopiera/arkivera och backup | Två projekt kan ändras och återöppnas efter omstart utan sammanblandning. |
| 4. Webbgränssnitt | Formulär, hjälptexter, beräkningshjälper och resultat | Hela flödet fungerar i webbläsaren med begripliga valideringsmeddelanden. |
| 5. Samlad verifiering | Kontroll av ekonomi, alla alternativ, diagram, rapport och datalagring | Godkända acceptanstester och jämförelseprotokoll från typfall körda både i grundfilen och i programmet. Alla skillnader ska förklaras. |
| 6. Lokal leverans | Startfunktion, användarguide och återställningsprov | Användaren kan starta, skapa ett projekt, beräkna, stänga och återöppna. |

Steg 2–4 kan utvecklas i små genomgående delar, men beräkningsbesluten i steg 1 styr resultaten. En osäker ARV-del får vara tydligt spärrad i en prototyp, men en sådan prototyp är inte en komplett Excel-ersättare.

Ingen kalenderprognos låses i förstudien. Arbetsbokens fel och kontrollbehov är den största osäkerheten i tidsåtgången. Gör en uppskattning efter steg 1, när modellens avgränsning är fastställd.

## 4. Kontrollpunkter innan utvecklingen låser beteendet

1. Lokal användning är beslutad. Gemensam databas för flera användare ligger utanför första versionen.
2. Vilket kalenderår är år 0, vilka år ingår, och när börjar en åtgärd ge nytta?
3. Ska övriga kostnader vara årliga efter åtgärd, som rubriken anger, och hur ska de jämföras med nuläget?
4. Ska rubriken ”Mest troligt nettonuvärde” ändras till ”Median, P50” när det är det mått som faktiskt beräknas?
5. Ska klimatpåverkan matas in i kg CO₂e och omräknas till kronor exakt en gång?
6. Finns en korrekt ifylld referensarbetsbok eller metodrapport som kan användas för ARV-validering?

Dessa frågor hindrar inte framtagningen av detta underlag. De behöver avgöras innan programmet betraktas som verifierat beslutsstöd. Befintliga ränte- och schablonexempel är historiskt källmaterial, inte verifierade aktuella rekommendationer.

## 5. Risker och åtgärder

| Risk | Åtgärd |
|---|---|
| Felaktiga Excel-formler kopieras | Skilj avsedd regel från observerad formel. Dokumentera varje rättelse och ett testfall. |
| Tomma indata ger till synes korrekta nollor | Kräv fullständiga relevanta indata före beräkning. Visa saknade fält. |
| Slump gör att resultat ändras vid varje visning | Spara slumpfrö, motorversion, fördelningar, antal simuleringar och resultat. |
| Enheter blandas, särskilt kg och kronor | Enhet på varje fält, separat fysisk mängd och monetärt värde. |
| Schabloner tolkas som lokala fakta | Tydlig källa och aktivt val att kopiera exempelvärden. |
| Projekt går förlorade eller blandas | Transaktioner, projekt-ID, versionshistorik och verifierad återställning. |
| XLSB-läsaren tolkar en formel fel | Kontroll i Excel eller oberoende läsare för omstridda formler före implementation. |

## 6. Överlämning

Förstudien lämnar ett lokalt Git-repository med dokumentation och en bevarad källkopia utanför versionshanteringen. Nästa konkreta arbetssteg är en kort regelkatalog och ett syntetiskt referensprojekt som kan räknas för hand. Därefter byggs programmet stegvis mot dessa kontroller.

## 7. Jämförelsetester mot grundfilen

Rena typfall ska köras både i Excel-grundfilen och i programmet med identiska indata. Börja med fasta värden och en effekt åt gången. Jämför delresultat, nettonuvärde och annuitet och dokumentera varje skillnad. Se [Testplan](TESTPLAN.md) för typfall, körningssätt och godkännandekriterier. Testerna är planerade och ännu inte körda.


## 8. Genomförandestatus 2026-09-17

Lokal version 1.0.0 är implementerad. Beräkningsmotor, datalagring, webbgränssnitt, hjälpberäkningar, historik, backup och startfunktion finns. 43 automatiska tester har godkänts och 21 typfall har körts mot grundfilen i LibreOffice med samma indata som programmet.

Steg 1 är dokumenterat i BESLUT_OCH_FRAGOR.md, med ARV:s verksamhetsgranskning kvarstående. Steg 2–4 är implementerade och lokalt testade. Steg 5 är delvis genomfört: jämförelseprotokoll finns men Microsoft Excel-körningen och ARV:s slutliga metodgranskning återstår. Steg 6 har lokal startfunktion och användarguide. Full acceptans hävdas inte. Se VERIFIERING.md för avgränsning och evidens.
