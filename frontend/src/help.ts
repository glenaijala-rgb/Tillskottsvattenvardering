// Bearbetat från TSV KNA.xlsb, Vägledning B5:B49. Historiska schabloner är inte rekommendationer.
export const help: Record<string, [string, string]> = {
  volume: [
    "Årlig volym från utredningsområdet som når reningsverket.",
    "Avser tillskottsvatten, inte den sammanlagda mängden spillvatten och tillskottsvatten.",
  ],
  treatment: [
    "Utgift för att rena en kubikmeter tillskottsvatten.",
    "Bedöm utgiften för tillskottsvatten separat från spillvatten. Spillvattenrening kan ge intäkter från exempelvis biogas eller fjärrvärme, medan tillskottsvatten är mindre förorenat. Dessa skillnader kan påverka hur utgifterna fördelas. Gör en lokal bedömning och dokumentera vad den bygger på. Ange faktisk resursåtgång utan moms, avskrivningar och låneränta.",
  ],
  treatment_co2: [
    "Utsläpp vid rening av en kubikmeter tillskottsvatten.",
    "Använd reningsverkets klimatunderlag om det finns. Om underlaget gäller allt avloppsvatten behöver utsläppen fördelas mellan spillvatten och tillskottsvatten utifrån en lokal bedömning. Svenskt Vattens klimatberäkningsverktyg nämns som möjlig källa i grundfilen. Ange kg CO₂e per kubikmeter tillskottsvatten; programmet räknar om utsläppen till kronor med projektets koldioxidvärdering.",
  ],
  arv_ground: [
    "Marginalnytta av minskad grundvattenpåverkan för investering i reningsverk.",
    "Ange den minskade investeringskostnaden per borttagen kubikmeter av denna flödeskomponent. Höga flöden kräver större dimensionering, så nyttan av att minska snabb regnpåverkan kan vara större än nyttan av att minska grundvattenpåverkan. Underlaget bygger på en workshop med experter på investeringar i reningsverk. Det gäller marginalförändringar: värdena ska inte användas när flödet förändras mycket, exempelvis när allt tillskottsvatten tas bort, och ska inte multipliceras med hela nulägets tillskottsvattenvolym. Stödet använder andel tillskottsvatten, år för nyinvestering, fördelning mellan bygg och installation, deras livslängder samt reinvesteringsandelar. Reinvesteringsandelen anger hur stor del av nyinvesteringen som återinvesteras efter respektive livslängd. Programmet överför P50 som fasta värden för de tre flödeskomponenterna; osäkerheten förs inte vidare. Den rekonstruerade ARV-metoden behöver slutgranskas.",
  ],
  arv_slow: [
    "Marginalnytta av minskad trög regnpåverkan för investering i reningsverk.",
    "Ange den minskade investeringskostnaden per borttagen kubikmeter av denna flödeskomponent. Höga flöden kräver större dimensionering, så nyttan av att minska snabb regnpåverkan kan vara större än nyttan av att minska grundvattenpåverkan. Underlaget bygger på en workshop med experter på investeringar i reningsverk. Det gäller marginalförändringar: värdena ska inte användas när flödet förändras mycket, exempelvis när allt tillskottsvatten tas bort, och ska inte multipliceras med hela nulägets tillskottsvattenvolym. Stödet använder andel tillskottsvatten, år för nyinvestering, fördelning mellan bygg och installation, deras livslängder samt reinvesteringsandelar. Reinvesteringsandelen anger hur stor del av nyinvesteringen som återinvesteras efter respektive livslängd. Programmet överför P50 som fasta värden för de tre flödeskomponenterna; osäkerheten förs inte vidare. Den rekonstruerade ARV-metoden behöver slutgranskas.",
  ],
  arv_fast: [
    "Marginalnytta av minskad snabb regnpåverkan för investering i reningsverk.",
    "Ange den minskade investeringskostnaden per borttagen kubikmeter av denna flödeskomponent. Höga flöden kräver större dimensionering, så nyttan av att minska snabb regnpåverkan kan vara större än nyttan av att minska grundvattenpåverkan. Underlaget bygger på en workshop med experter på investeringar i reningsverk. Det gäller marginalförändringar: värdena ska inte användas när flödet förändras mycket, exempelvis när allt tillskottsvatten tas bort, och ska inte multipliceras med hela nulägets tillskottsvattenvolym. Stödet använder andel tillskottsvatten, år för nyinvestering, fördelning mellan bygg och installation, deras livslängder samt reinvesteringsandelar. Reinvesteringsandelen anger hur stor del av nyinvesteringen som återinvesteras efter respektive livslängd. Programmet överför P50 som fasta värden för de tre flödeskomponenterna; osäkerheten förs inte vidare. Den rekonstruerade ARV-metoden behöver slutgranskas.",
  ],
  energy: [
    "Elenergi för att pumpa en kubikmeter tillskottsvatten på ledningsnätet.",
    "Ange energiåtgång, inte elkostnad. Elpris och klimatpåverkan anges separat.",
  ],
  electricity: [
    "Årsmedelpris inklusive nätavgift och energiskatt, utan moms.",
    "Använd ett pris som motsvarar det egna projektets förutsättningar.",
  ],
  electricity_co2: [
    "Utsläpp per använd kilowattimme el.",
    "Dokumentera vald emissionsfaktor och dess källa.",
  ],
  floods: [
    "Alla källaröversvämningar på grund av tillskottsvatten i området, även när kommunen inte är ansvarig.",
    "Ange ett årligt antal källaröversvämningar orsakade av tillskottsvatten inom utredningsområdet, oavsett om kommunen anses ansvarig. Antalet kan uppskattas från historiska händelser eller beräknas riskbaserat. Det riskbaserade stödet använder antal översvämmade källare vid olika återkomsttider och beräknar ett förväntat årsantal från arean under riskkurvan. På så sätt beaktas även ovanliga men allvarliga händelser. Saknas sådant modelleringsunderlag behöver du använda och dokumentera en annan bedömning. I programmets stöd antas konstant skadeantal bortom den längsta återkomsttiden.",
  ],
  damage_small: [
    "Kostnad för att återställa fysiska skador i en mindre byggnad.",
    "Ta med skadan oavsett om kostnaden bärs av VA-huvudman, fastighetsägare eller försäkringsbolag. Göteborgsexemplet bygger på försäkringsstatistik.",
  ],
  damage_large: [
    "Kostnad för att återställa fysiska skador i en större byggnad.",
    "Ange kostnaden för att återställa eller ersätta fysiska skador efter en källaröversvämning i en större byggnad. Kostnaden ska ingå oavsett om den bärs av VA-huvudmannen, fastighetsägaren eller ett försäkringsbolag. Räkna samma skada bara en gång. Göteborgsexemplet bygger på nationell försäkringsstatistik och behöver bedömas för det egna området.",
  ],
  social_small: [
    "Värdering av olägenhet och lidande vid översvämning i en mindre byggnad.",
    "Avser konsekvenser utöver fysiska skador. Göteborgsexemplet bearbetades från en norsk värderingsstudie.",
  ],
  social_large: [
    "Värdering av olägenhet och lidande vid översvämning i en större byggnad.",
    "Avser fastighetsägarens olägenhet eller lidande vid en källaröversvämning, utöver kostnaden för de fysiska skadorna. Göteborgsexemplet är bearbetat från en norsk värderingsstudie. Bedöm om den historiska värderingen passar det egna området och håll den åtskild från återställningskostnaden.",
  ],
  overflow: [
    "Total bräddad avloppsvolym från områdets ledningsnät, inte enbart spillvatten.",
    "Ange total bräddad avloppsvolym från ledningsnätet inom utredningsområdet i kubikmeter per år, inte enbart spillvattendelen. I grundfilens exempel bygger kostnaden per kubikmeter på en schablon för det bräddade vattnets sammansättning. Kontrollera att använda kostnadsvärden passar den volym och sammansättning som bedöms här.",
  ],
  overflow_internal: [
    "Intern kostnad per kubikmeter bräddat avloppsvatten.",
    "Göteborgsexemplet värderar bräddningen utifrån kostnaden att avskilja motsvarande fosformängd genom dagvattenrening. Tanken är att minskad bräddning kan minska behovet av annan rening för att uppnå recipientens målvärden. Underlagets troliga antaganden är 40 000 kr per kg fosfor och år för dagvattenrening samt 0,6 gram fosfor per kubikmeter bräddat vatten. Detta beskriver hur det historiska underlaget tagits fram, inte en aktuell taxa eller rekommendation. Anpassa värderingen till det egna området.",
  ],
  overflow_external: [
    "Samhällets externa kostnad per kubikmeter bräddat vatten.",
    "Göteborgsexemplet bygger på en studie av invånarnas betalningsvilja för att uppnå god status i recipienterna. En del av betalningsviljan hänförs till bräddning och representerar olägenheter för medborgarna. Ange värderingen per kubikmeter bräddat vatten. Bedöm lokal relevans och undvik att samma nytta också räknas i andra poster.",
  ],
  other: [
    "Andra årliga kostnader för tillskottsvatten i nuläget.",
    "Exempel är slitage och arbetsmiljökonsekvenser. Ta endast med sådant som inte redan ingår i andra poster.",
  ],
  investment: [
    "Hela åtgärdens utgift, inklusive kostnader för fastighetsägare och andra aktörer.",
    "Vid separering kan även dagvattenhantering behöva ingå. Ange faktisk resursåtgång utan moms, inflation, avskrivningar och låneränta.",
  ],
  construction_co2: [
    "Totala utsläpp för att genomföra åtgärden, i kg CO₂e.",
    "Ange utsläpp i kg CO₂e, inte kronor. Programmet använder projektets koldioxidvärdering för att beräkna kostnaden. Stödet multiplicerar längd med utsläpp per meter för schaktfria arbeten, exempelvis infodring, respektive arbeten med schakt, exempelvis separering, och summerar utsläppen. Använd faktorer som passar projektet. Om andra delar av åtgärden också ger utsläpp behöver de läggas till i ett eget komplett totalvärde; en manuell ändring kopplar loss stödberäkningen.",
  ],
  traffic: [
    "Sammanlagd kostnad för trafikens förseningar under byggtiden.",
    "Stödet uppskattar byggtiden från ledningslängd och arbetstakt för schaktfritt arbete respektive schakt. Trafikens förlorade tid beräknas med försening per fordon och årsmedeldygntrafik och värderas med en tidskostnad per fordon och timme. Ange arbetstakt i meter per dygn och försening i sekunder per fordon. Grundfilens tidsvärdering bygger på en VTI-studie och innehåller historiska Göteborgsexempel. Bedöm förutsättningarna på de aktuella vägarna; osäkra indata kan anges med min, mest troligt och max.",
  ],
  renewal: [
    "Årlig nytta av minskat förnyelsebehov efter färdigställandet.",
    "Jämför det årliga förnyelsebehovet för dagens ledningsbestånd med behovet efter åtgärden. Om behovet minskar, multiplicera minskningen med relevant förnyelsekostnad, exempelvis kostnaden för infodring. Ange nyttan i kronor per år efter färdigställandet. Grundfilen nämner Svenskt Vattens verktyg för förnyelseplanering som möjligt underlag för jämförelsen.",
  ],
  other_cost: [
    "Övriga årliga kostnader som återstår eller tillkommer efter åtgärden.",
    "Ange nivån efter åtgärd, inte bara förändringen. Programmet jämför den med nulägets övriga kostnader. Exempel: drift, underhåll och slitage.",
  ],
  other_benefit: [
    "Övriga årliga nyttor som åtgärden skapar.",
    "Exempel är rekreationsvärden från dammar eller gröna fördröjningsytor. Ta inte med nyttor som redan räknas i andra poster.",
  ],
  volume_reduction: [
    "Volymen tillskottsvatten som tas bort per år, inte volymen som återstår.",
    "Ange minskningen av tillskottsvatten i kubikmeter per år. Fördelningen mellan grundvattenpåverkan, trög regnpåverkan och snabb regnpåverkan gäller just den borttagna volymen och ska summera till 100 procent. Grundfilen beskriver att separering främst påverkar snabba flöden, medan infodring främst påverkar långsamma flöden. Bedöm den faktiska effekten för det egna projektet; fördelningen är inte automatiskt densamma som i nuläget.",
  ],
  flood_reduction: [
    "Minskningen av antalet källaröversvämningar per år.",
    "Ange skillnaden mellan förväntat antal källaröversvämningar per år i nuläget och efter åtgärden. Ange inte antalet som återstår. Åtgärder som minskar snabba flöden, exempelvis separering, kan påverka översvämningarna, men storleken behöver bedömas för området. Minskningen får inte överstiga nuläget; detta kontrolleras även för angivna osäkerhetsintervall.",
  ],
  overflow_reduction: [
    "Minskningen av bräddad avloppsvolym per år.",
    "Ange skillnaden mellan årlig bräddad avloppsvolym i nuläget och efter åtgärden, inte volymen som återstår. Åtgärder som minskar snabba flöden kan påverka bräddningen; bedöm effekten för området. Minskningen får inte överstiga nuläget, även när osäkerhetsintervall anges.",
  ],
  start: [
    "Analysens startår är år 0.",
    "Alla framtida belopp diskonteras till detta år. Analysperioden måste omfatta 1–100 år och genomförandeåren ska ligga inom perioden. Nya projekts årtal är redigerbara startantaganden, inte uppgifter om ditt projekt.",
  ],
  end: [
    "Sista året vars årliga effekter ingår i analysen.",
    "En kort period kan missa långsiktiga nyttor och kostnader. Välj en period som passar åtgärdernas livslängd och pröva hur resultatet påverkas. Programmet tillåter högst 100 år och räknar årliga effekter till och med slutåret.",
  ],
  rate: [
    "Räntan bestämmer hur framtida nyttor och kostnader värderas i dag.",
    "Ju högre ränta, desto mindre vikt får effekter långt fram i tiden. Vid 0 % väger alla år lika. Räntan speglar antaganden om framtiden och avvägningar mellan generationer. Utgå från organisationens beslutade metod och pröva olika räntor. Appens startvärde 3 % är ett antagande, inte en aktuell myndighetsrekommendation.",
  ],
  carbon: [
    "Samhällskostnad per kg utsläppt koldioxidekvivalent.",
    "Programmet använder samma värdering under hela analysperioden. Startvärdet 1 kr/kg CO₂e är valt för denna app och kan ändras. Värderingen kan bero på metod och politiska avvägningar. Dokumentera ert val och undersök hur en annan värdering påverkar resultatet. Grundfilens historiska prisexempel är inte aktuella rekommendationer.",
  ],
  seed: [
    "Styr de slumpdragningar som används i simuleringen.",
    "Samma sparade indata, slumpfrö och beräkningsversion ger reproducerbara resultat. Du behöver normalt inte ändra detta värde. Ett annat frö ändrar de simulerade utfallen, inte modellens antaganden.",
  ],
  iterations: [
    "Antal simulerade utfall i varje beräkning.",
    "För varje utfall dras värden från angivna osäkerhetsfördelningar och nyttor och kostnader beräknas. 10 000 simuleringar ger normalt stabilare numeriska sammanställningar än 1 000, men kan ta längre tid. Fler simuleringar kompenserar inte för bristfälliga indata.",
  ],
  small_share: [
    "Andel av de översvämmade byggnaderna som är småhus eller motsvarande.",
    "Mindre byggnader har en separat skadekostnad. Återstående andel räknas som större byggnader, exempelvis flerfamiljshus och handelsbyggnader. Andelen gäller översvämmade byggnader, inte alla byggnader i området. Startvärdet 100 % är appens antagande och ska anpassas.",
  ],
  build_start: [
    "Året då åtgärden börjar genomföras.",
    "Byggstart och färdigställande ska ligga inom analysperioden. Programmet fördelar byggkostnader jämnt över samtliga byggår, inklusive start- och slutår. Samma år kan anges för båda fälten.",
  ],
  build_end: [
    "Året då åtgärden är färdig.",
    "Årliga nyttor och löpande kostnader efter åtgärden börjar året efter färdigställandet och räknas till analysens slutår. Detta är programmets tidsregel; gradvis nyttoinförande under byggtiden modelleras inte.",
  ],
  trenchless_length: [
    "Längden som utförs schaktfritt, exempelvis genom infodring.",
    "Ange meter för denna åtgärd. Noll är en platshållare och betyder att ingen sådan längd räknas med. Klimat- och trafikstödet återanvänder senast använda längdunderlag inom samma åtgärd; ändringar behöver beräknas och användas i båda stöden.",
  ],
  trench_length: [
    "Längden som utförs med schakt.",
    "Ange meter för denna åtgärd, exempelvis vid separering. Noll är en platshållare, inte ett Göteborgsexempel. Längden används tillsammans med utsläpp per meter eller arbetstakt beroende på vilket stöd du använder.",
  ],
  trenchless_factor: [
    "Utsläpp per meter schaktfritt arbete.",
    "Göteborgsexemplet är min 1, mest troligt 10 och max 217 kg CO₂e/m. Källa: TSV KNA.xlsb, Beräkningshjälp!H48:J48. Vägledningen nämner infodring som exempel. Anpassa faktorn till material, dimension och arbetsmetod. Utsläppen multipliceras med längden; projektets koldioxidvärdering används sedan för omräkning till kronor.",
  ],
  trench_factor: [
    "Utsläpp per meter arbete med schakt.",
    "Göteborgsexemplet är min 33, mest troligt 104 och max 855 kg CO₂e/m. Källa: TSV KNA.xlsb, Beräkningshjälp!H49:J49. Vägledningen nämner separering som exempel. Värdena är historiska. Andra utsläpp utöver de arbeten som stödet täcker måste ingå i ett eget komplett totalvärde.",
  ],
  trenchless_speed: [
    "Hur många meter schaktfritt arbete som färdigställs per dygn.",
    "Göteborgsexemplet är 80 / 100 / 150 m/dygn (min / mest troligt / max), från Beräkningshjälp!H66:J66. Byggtiden beräknas som längd delad med arbetstakt. Högre arbetstakt ger kortare trafikpåverkan. Anpassa till projektets förutsättningar.",
  ],
  trench_speed: [
    "Hur många meter arbete med schakt som färdigställs per dygn.",
    "Göteborgsexemplet är 4 / 5 / 6 m/dygn, från Beräkningshjälp!H67:J67. Arbetstakten används för att uppskatta antal dygn med trafikpåverkan. Använd lokalt underlag om det finns.",
  ],
  delay: [
    "Extra restid för varje förbipasserande fordon.",
    "Göteborgsexemplet är 5 / 30 / 120 sekunder per fordon, från Beräkningshjälp!H68:J68. Det är förseningen, inte fordonets hela restid, som ska anges. Tiden multipliceras med trafikmängden och byggtiden och omvandlas till timmar.",
  ],
  vehicles: [
    "Genomsnittligt antal fordon per dygn på berörda vägar.",
    "Göteborgsexemplet är 300 / 5 000 / 40 000 fordon/dygn, från Beräkningshjälp!H69:J69. Ange den trafikmängd som påverkas av arbetena. Antagandet bör passa samma sträcka och försening som övriga indata.",
  ],
  time_cost: [
    "Värdering av en timmes försening för ett fordon.",
    "Grundfilens fasta exempel är 125 kr/timme/fordon, Beräkningshjälp!I63. Vägledningen nämner en VTI-studie, men den granskade texten anger inte fullständig referens eller prisår. Det är därför ett historiskt startvärde, inte en aktuell rekommendation.",
  ],
  share: [
    "Tillskottsvattnets andel av det totala flödet till reningsverket.",
    "Startvärdet 50 % är ett appantagande och ska ersättas med ett eget underlag. Modellen har referensscenarier för 30, 50 och 70 %. Mellan dessa interpoleras resultaten; under 30 eller över 70 % används närmaste scenario. Modellen ger marginalvärden och ska inte användas för stora flödesförändringar.",
  ],
  next_year: [
    "Kalenderåret då den nya reningsverksinvesteringen tas i bruk.",
    "Startvärdet 2032 är ett redigerbart appantagande, inte ett projektår från grundfilen. Ange planerat år inom analysperioden. Investeringen diskonteras till analysens startår; senare reinvesteringar tas med om de faller inom perioden.",
  ],
  building_share: [
    "Byggdelens andel av nyinvesteringen; resten är installation.",
    "Grundfilens exempel är 70 % bygg och 30 % installation, Beräkningshjälp!H8:I8. Delarna har olika livslängder och reinvesteringsbehov. Ange en fördelning som passar planerat reningsverk.",
  ],
  building_life: [
    "Tid innan byggdelen behöver reinvesteras.",
    "Exemplet är 50 år, Beräkningshjälp!H9. Programmet återkommer med reinvestering med denna periodicitet efter nyinvesteringen, inom analysperioden. Hur stor del som reinvesteras anges separat.",
  ],
  installation_life: [
    "Tid innan installationsdelen behöver reinvesteras.",
    "Exemplet är 25 år, Beräkningshjälp!I9. Reinvesteringar återkommer efter denna livslängd inom analysperioden. Installationsdelens reinvesteringsandel anges separat.",
  ],
  building_reinvestment: [
    "Andel av byggdelens ursprungliga investering som återinvesteras.",
    "Grundfilens exempel är 30 %, Beräkningshjälp!H10. Det är inte 30 % av hela reningsverkets investering: programmet multiplicerar andelen med byggdelens andel av nyinvesteringen.",
  ],
  installation_reinvestment: [
    "Andel av installationsdelens ursprungliga investering som återinvesteras.",
    "Grundfilens exempel är 50 %, Beräkningshjälp!I10. Programmet multiplicerar andelen med installationsdelens andel av nyinvesteringen vid respektive reinvesteringstillfälle.",
  ],
};
