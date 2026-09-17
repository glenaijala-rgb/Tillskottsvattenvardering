"""Compare recorded spreadsheet recalculations against the same program input cases."""
import json,math
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
cases={x['id']:x for x in json.loads((ROOT/'tests/fixtures/typical_cases.json').read_text(encoding='utf-8'))}
observations=json.loads((ROOT/'tests/fixtures/libreoffice_observations.json').read_text(encoding='utf-8'))
rows=[]
def add(id,label,cell,program,reason=''):
    source=next(x for x in observations if x['id']==id)['outputs'][cell]
    value=source['value'];present=not source['error'] and source['text']!=''
    match=present and math.isclose(value,program,abs_tol=.01,rel_tol=1e-8)
    rows.append({'case':id,'metric':label,'cell':cell,'source':value if present else None,'source_text':source['text'],'source_error':source['error'],'program':program,'difference':program-value if present else None,'status':'Överensstämmer' if match else 'Förklarad metod-/felavvikelse' if reason else 'Utred','reason':'' if match else reason})

for observation in observations:
    id=observation['id'];case=cases[id];p=case['program']
    if 'helper' not in case:
        for i,a in enumerate(p['alternatives']):
            cell=chr(68+i)
            reason='B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100.'
            if id=='T07':reason='B03: båda byggåren inkluderas. Grundfilen exkluderar byggslutåret.'
            if id.startswith('T08'):reason+=' B05: separat årlig kostnad/nytta. Grundfilens kostnadsparameter hämtar nyttor och läggs under byggtiden.'
            if id=='T09':reason='B03/B06: byggår inkluderas, kg omräknas till kr. Grundfilen saknar omräkning och alternativ 2 hämtar alternativ 3:s klimatvärde.'
            if id in ('T10-one','T10-hundred'):reason='B03: samma start/slutår ger engångskostnad. Grundfilen dividerar med 0 och döljer felet.'
            add(id,'NNV '+a['name'],'Resultat!'+cell+'4',a['npv']['p50'],reason)
            add(id,'Annuitet '+a['name'],'Resultat!'+cell+'5',a['annuity']['p50'],'B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.')
        first=p['alternatives'][0]
        for key,before,after in [('treatment','D109','G109'),('treatment_co2','D110','G110'),('pumping','D111','G111'),('pumping_co2','D112','G112'),('flood_damage','D113','G113'),('overflow_internal','D115','G115'),('overflow_external','D116','G116')]:
            add(id,key+' nuläge','Resultat!'+before,p['baseline'][key]['p50'])
            add(id,key+' efter åtgärd','Resultat!'+after,first['after'][key]['p50'])
    elif case['helper']=='climate':add(id,'Klimatkostnad hjälp','Beräkningshjälp!E53',p['cost'])
    elif case['helper']=='traffic':add(id,'Trafikkostnad hjälp','Beräkningshjälp!E73',p['cost'])
    elif case['helper']=='flood':add(id,'Årlig översvämningsrisk','Beräkningshjälp!D35',p['expected'])
    else:
        for key,row in [('arv_ground',19),('arv_slow',20),('arv_fast',21)]:add(id,key+' stödvärde','Beräkningshjälp!E'+str(row),p['apply'][key],'B11/B12: programmet använder analytisk P50 och investeringar inom vald horisont. Grundfilen använder slumpmässigt histogramtypvärde och annan tidsavgränsning. Ingen numerisk likvärdighet hävdas.')

pending=[r for r in rows if r['status']=='Utred']
out=ROOT/'docs'/'JAMFORELSE_TYPFALL.md'
text=['# Jämförelseprotokoll – rena typfall','',
 '21 typfallskörningar gjorda på kopior av TSV KNA.xlsb i **LibreOffice 26.2.4.2**. Samma indata har körts genom programmets beräkningsmotor. Microsoft Excel är inte tillgängligt; detta är en kompletterande kompatibilitetskontroll, inte en Excel-certifiering.','',
 'Grundfilens SHA-256: `a74e3bd6bb56cd1484b0c9693a578e70768d1134f14dea09f4166f630a613ae3`. Formlerna i testkopiorna har inte rättats. Inmatningar har ändrats och filerna räknats om. Omräknade kopior finns i `analysis/lo-results/` som ODS. Originalfilen och XLSB-referensen är oförändrade.','',
 f"Jämförda poster: {len(rows)}. Överensstämmer inom tolerans: {sum(r['status']=='Överensstämmer' for r in rows)}. Förklarade metod-/felavvikelser: {sum(r['status']=='Förklarad metod-/felavvikelse' for r in rows)}. Oförklarade i detta urval: {len(pending)}.",'',
 'Detta är ett urval av delresultat och samtliga huvudresultat i typfallen, inte alla celler i arbetsboken. ARV-avvikelser är redovisade metodskillnader och utgör inte godkänd numerisk kompatibilitet. Besluts-ID hänvisar till `BESLUT_OCH_FRAGOR.md`.','',
 '| Typfall | Resultat | Grundfil i LibreOffice | Program | Skillnad | Bedömning |','|---|---|---:|---:|---:|---|']
for row in rows:
    fmt=lambda v:'Saknas/fel' if v is None else f'{v:.6f}'
    text.append(f"| {row['case']} | {row['metric']} | {fmt(row['source'])} | {fmt(row['program'])} | {fmt(row['difference'])} | {row['status']} |")
text+=['','## Förklaringar','']
seen=set()
for row in rows:
    key=(row['case'],row['reason'])
    if row['reason'] and key not in seen:text.append(f"- **{row['case']}:** {row['reason']}");seen.add(key)
text+=['','## Återupprepning','',
 '`scripts/typical_cases.py` skapar gemensamma indata och programresultat. `scripts/run_libreoffice_cases.py` kör på en separat LibreOffice-instans. `scripts/run_excel_cases.ps1` kör samma manifest på en dator med Microsoft Excel. `scripts/comparison_report.py` skriver detta protokoll från sparade observationer. Numerisk tolerans: max(0,01 kr, absolut referensvärde × 10⁻⁸). Fysiska hjälpvärden kontrolleras dessutom med separata strängare kodtester.','',
 'Råobservationer, formeltext, felstatus och gemensamma indata finns i `tests/fixtures/`. Tabellens skillnad är program minus grundfil. Tomma eller dolda fel redovisas som saknade, inte som nollor.']
out.write_text('\n'.join(text)+'\n',encoding='utf-8')
(ROOT/'tests/fixtures/comparison.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'cases':len(observations),'metrics':len(rows),'matched':sum(r['status']=='Överensstämmer' for r in rows),'unexplained':pending},ensure_ascii=False))
