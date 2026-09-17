// Bearbetat från TSV KNA.xlsb, Vägledning B5:B49. Historiska schabloner är inte rekommendationer.
export const help: Record<string, [string, string]> = {
  volume: [
    "Årlig volym från utredningsområdet som når reningsverket.",
    "Avser tillskottsvatten, inte den sammanlagda mängden spillvatten och tillskottsvatten. Underlag: Vägledning punkt 6.",
  ],
  treatment: [
    "Utgift för att rena en kubikmeter tillskottsvatten.",
    "Bedöm kostnaden för tillskottsvatten separat från spillvatten; föroreningshalt och återvunnen energi kan påverka fördelningen. Punkt 7.",
  ],
  treatment_co2: [
    "Utsläpp vid rening av en kubikmeter tillskottsvatten.",
    "Använd reningsverkets klimatunderlag om det finns. Fördelningen mellan spillvatten och tillskottsvatten behöver bedömas lokalt. Punkt 8.",
  ],
  arv_ground: [
    "Marginalnytta av minskad grundvattenpåverkan för investering i reningsverk.",
    "Beräkningshjälpen fyller i alla tre flödeskomponenter. Underlaget bygger på expertbedömningar av dimensioneringsbehov. Punkterna 9 och 31.",
  ],
  arv_slow: [
    "Marginalnytta av minskad trög regnpåverkan för investering i reningsverk.",
    "Gemensamt beräkningsunderlag öppnas vid grundvattenpåverkan ovan. Punkterna 9 och 31.",
  ],
  arv_fast: [
    "Marginalnytta av minskad snabb regnpåverkan för investering i reningsverk.",
    "Höga flöden påverkar dimensioneringen. Gemensamt beräkningsunderlag öppnas vid grundvattenpåverkan ovan. Punkterna 9 och 31.",
  ],
  energy: [
    "Elenergi för att pumpa en kubikmeter tillskottsvatten på ledningsnätet.",
    "Ange energiåtgång, inte elkostnad. Elpris och klimatpåverkan anges separat. Punkt 10.",
  ],
  electricity: [
    "Årsmedelpris inklusive nätavgift och energiskatt, utan moms.",
    "Använd ett pris som motsvarar det egna projektets förutsättningar. Punkt 11.",
  ],
  electricity_co2: [
    "Utsläpp per använd kilowattimme el.",
    "Dokumentera vald emissionsfaktor och dess källa. Punkt 12.",
  ],
  floods: [
    "Alla källaröversvämningar på grund av tillskottsvatten i området, även när kommunen inte är ansvarig.",
    "Använd historiskt underlag eller beräkna ett förväntat årsantal från olika återkomsttider. Även ovanliga, allvarliga händelser behöver beaktas. Punkterna 13 och 32.",
  ],
  damage_small: [
    "Kostnad för att återställa fysiska skador i en mindre byggnad.",
    "Ta med skadan oavsett om kostnaden bärs av VA-huvudman, fastighetsägare eller försäkringsbolag. Göteborgsexemplet bygger på försäkringsstatistik. Punkt 15.",
  ],
  damage_large: [
    "Kostnad för att återställa fysiska skador i en större byggnad.",
    "Ta med skadan oavsett vem som betalar. Undvik att räkna samma skada flera gånger. Punkt 15.",
  ],
  social_small: [
    "Värdering av olägenhet och lidande vid översvämning i en mindre byggnad.",
    "Avser konsekvenser utöver fysiska skador. Göteborgsexemplet bearbetades från en norsk värderingsstudie. Punkt 16.",
  ],
  social_large: [
    "Värdering av olägenhet och lidande vid översvämning i en större byggnad.",
    "Avser konsekvenser utöver fysiska skador. Historiska exempel måste bedömas för det egna området. Punkt 16.",
  ],
  overflow: [
    "Total bräddad avloppsvolym från områdets ledningsnät, inte enbart spillvatten.",
    "Ange kubikmeter per år. Kostnader per kubikmeter anges separat. Punkt 17.",
  ],
  overflow_internal: [
    "Intern kostnad per kubikmeter bräddat avloppsvatten.",
    "Göteborgsexemplet utgår från kostnaden att avskilja motsvarande fosformängd genom dagvattenrening. Det är en värderingsansats, inte en generell taxa. Punkt 18.",
  ],
  overflow_external: [
    "Samhällets externa kostnad per kubikmeter bräddat vatten.",
    "Göteborgsexemplet bygger på betalningsvilja för bättre status i recipienterna. Bedöm lokal relevans och undvik dubbelräkning med andra nyttor. Punkt 19.",
  ],
  other: [
    "Andra årliga kostnader för tillskottsvatten i nuläget.",
    "Exempel är slitage och arbetsmiljökonsekvenser. Ta endast med sådant som inte redan ingår i andra poster. Punkt 20.",
  ],
  investment: [
    "Hela åtgärdens utgift, inklusive kostnader för fastighetsägare och andra aktörer.",
    "Vid separering kan även dagvattenhantering behöva ingå. Ange faktisk resursåtgång utan moms, inflation, avskrivningar och låneränta. Punkt 24.",
  ],
  construction_co2: [
    "Totala utsläpp för att genomföra åtgärden, i kg CO₂e.",
    "Ange utsläpp, inte kronor. Programmet använder projektets koldioxidvärdering för kostnaden. Stödet omfattar schakt och schaktfritt arbete; andra utsläpp kräver ett eget komplett värde. Punkterna 25 och 33.",
  ],
  traffic: [
    "Sammanlagd kostnad för trafikens förseningar under byggtiden.",
    "Stödet använder ledningslängd, arbetstakt, försening per fordon, trafikmängd och tidskostnad. Punkt 34.",
  ],
  renewal: [
    "Årlig nytta av minskat förnyelsebehov efter färdigställandet.",
    "Jämför förnyelsebehov före och efter åtgärd. Minskningen multipliceras med relevant förnyelsekostnad. Punkt 27.",
  ],
  other_cost: [
    "Övriga årliga kostnader som återstår eller tillkommer efter åtgärden.",
    "Ange nivån efter åtgärd, inte bara förändringen. Programmet jämför den med nulägets övriga kostnader. Exempel: drift, underhåll och slitage. Bearbetat från punkt 28 enligt programmets metodbeslut.",
  ],
  other_benefit: [
    "Övriga årliga nyttor som åtgärden skapar.",
    "Exempel är rekreationsvärden från dammar eller gröna fördröjningsytor. Ta inte med nyttor som redan räknas i andra poster. Punkt 29.",
  ],
  volume_reduction: [
    "Volymen tillskottsvatten som tas bort per år, inte volymen som återstår.",
    "Fördelningen mellan grundvattenpåverkan, trög och snabb regnpåverkan gäller den borttagna volymen. Punkt 30.",
  ],
  flood_reduction: [
    "Minskningen av antalet källaröversvämningar per år.",
    "Ange skillnaden mot nuläget. Åtgärdens effekt behöver bedömas för området. Punkt 30.",
  ],
  overflow_reduction: [
    "Minskningen av bräddad avloppsvolym per år.",
    "Ange skillnaden mot nuläget, inte kvarvarande bräddning. Punkt 30.",
  ],
};
