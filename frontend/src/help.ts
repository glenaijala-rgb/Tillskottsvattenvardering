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
};
