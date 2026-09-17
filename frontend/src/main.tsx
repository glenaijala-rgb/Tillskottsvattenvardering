import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useId,
} from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { help } from "./help";

type P = {
  excluded?: boolean;
  low: number | null;
  mode: number | null;
  high: number | null;
  source: string;
  note: string;
  derived?: any;
};
type Field = [string, string, string, string, number];
type Alternative = {
  id: string;
  name: string;
  active: boolean;
  start: number;
  end: number;
  shares: number[];
  params: Record<string, P>;
};
type Project = {
  excluded_groups?: string[];
  name: string;
  area: string;
  notes: string;
  analysis: {
    start: number;
    end: number;
    rate: number;
    carbon: number | null;
    seed: number;
    iterations: number;
  };
  small_share: number;
  baseline: Record<string, P>;
  alternatives: Alternative[];
  helpers: any[];
};
type Saved = { id: string; revision: number; archived: number; data: Project };
type Stats = {
  p05: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
};
const fmt = (v: number, dec = 0) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: dec }).format(v);
const parse = (text: string) =>
  text.trim() === "" ? null : Number(text.replace(/\s/g, "").replace(",", "."));
async function api(path: string, method = "GET", body?: unknown) {
  const r = await fetch("/api" + path, {
    method,
    headers: method === "GET" ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) {
    const error = new Error(
      Array.isArray(data.detail)
        ? data.detail
            .map((x: any) => (typeof x === "string" ? x : JSON.stringify(x)))
            .join("\n")
        : data.detail || "Något gick fel.",
    );
    Object.assign(error, { fields: data.fields || [] });
    throw error;
  }
  return data;
}
type FieldIssue = { path: string; message: string };
const IssueContext = createContext<FieldIssue[]>([]);
function effectIssues(project: Project | null): FieldIssue[] {
  if (!project) return [];
  const issues: FieldIssue[] = [];
  const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
  const pairs = [
    ["volume", "volume_reduction", "tillskottsvatten", "m³/år", ""],
    ["floods", "flood_reduction", "källaröversvämningar", "st/år", "Källaröversvämningar"],
    ["overflow", "overflow_reduction", "bräddning", "m³/år", "Bräddning"],
  ];
  project.alternatives.forEach((alt, index) => {
    if (!alt.active) return;
    pairs.forEach(([baseKey, key, label, unit, group]) => {
      const base = project.baseline[baseKey];
      const reduction = alt.params[key];
      if (!base || !reduction || reduction.excluded || project.excluded_groups?.includes(group)) return;
      const limit = base.low ?? base.mode;
      const entered = reduction.high ?? reduction.mode;
      if (!finite(limit) || !finite(entered) || limit < 0 || entered <= limit) return;
      const uncertain = base.low != null || base.high != null || reduction.low != null || reduction.high != null;
      const message = uncertain
        ? `Minskningen av ${label} är som högst ${fmt(entered, 10)} ${unit}, men nulägets lägsta värde är bara ${fmt(limit, 10)} ${unit}. Minskningens max får inte överstiga nulägets min; annars kan simuleringen ge ett negativt antal eller en negativ volym efter åtgärden.`
        : `Du anger en minskning av ${label} med ${fmt(entered, 10)} ${unit}, men i nuläget finns bara ${fmt(limit, 10)} ${unit}. Det går inte att ta bort mer än vad som finns idag.`;
      issues.push({ path: `alternatives.${index}.params.${key}`, message });
    });
  });
  return issues;
}
function FieldValidation({
  path,
  children,
}: {
  path?: string;
  children: React.ReactNode;
}) {
  const issues = useContext(IssueContext).filter((e) => e.path === path);
  const id = useId();
  const message = [...new Set(issues.map((e) => e.message))].join(" ");
  return (
    <div
      className={message ? "invalid-field" : "validated-field"}
      data-field-path={path}
      title={message || undefined}
    >
      {children}
      {message && (
        <p className="field-error" id={id}>
          {message}
        </p>
      )}
    </div>
  );
}
function FieldInfo({ label, helpKey }: { label: string; helpKey: string }) {
  const content = help[helpKey];
  if (!content) return null;
  return (
    <details className="field-info">
      <summary aria-label={"Information om " + label}>
        <span className="info-icon" aria-hidden="true">
          i
        </span>{" "}
        Information
      </summary>
      <p>{content[0]}</p>
      <p>{content[1]}</p>
    </details>
  );
}
function NumberField({
  label,
  value,
  onChange,
  unit,
  errorPath,
  helpKey,
  readOnly = false,
  invalid = false,
  grouped = !!unit?.includes("kr"),
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  unit?: string;
  errorPath?: string;
  helpKey?: string;
  readOnly?: boolean;
  invalid?: boolean;
  grouped?: boolean;
}) {
  const display = (v: number | null) => {
    if (v == null) return "";
    const [integer, fraction] = String(v).split(".");
    const whole = grouped ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : integer;
    return whole + (fraction === undefined ? "" : "," + fraction);
  };
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => display(value));
  useEffect(() => {
    if (!focused) setText(display(value));
  }, [value, focused, grouped]);
  return (
    <FieldValidation path={errorPath}>
      <label className="field">
        {label}
        {unit && <span className="unit">{unit}</span>}
        <input
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          data-live-invalid={invalid ? "true" : undefined}
          inputMode="decimal"
          value={text}
          onFocus={() => {
            setFocused(true);
            if (grouped) setText(text.replace(/\s/g, ""));
          }}
          onChange={(e) => {
            setText(e.target.value);
            const v = parse(e.target.value);
            if (v === null || Number.isFinite(v)) onChange(v);
          }}
          onBlur={() => {
            const v = parse(text);
            setFocused(false);
            setText(display(v !== null && !Number.isFinite(v) ? value : v));
          }}
        />
      </label>
      {helpKey && <FieldInfo label={label} helpKey={helpKey} />}
    </FieldValidation>
  );
}
function Parameters({
  fields,
  values,
  onChange,
  support,
  errorScope,
  excludedGroups = [],
  onGroupToggle,
  groupContent,
  examples = {},
}: {
  groupContent?: (group: string) => React.ReactNode;
  examples?: Record<string, [number | null, number, number | null]>;
  excludedGroups?: string[];
  onGroupToggle?: (group: string, excluded: boolean) => void;
  errorScope?: string;
  support?: (key: string) => React.ReactNode;
  fields: Field[];
  values: Record<string, P>;
  onChange: (key: string, p: P) => void;
}) {
  return (
    <>
      {[...new Set(fields.map((x) => x[3]))].map((group) => (
        <section className="card" key={group}>
          <div className="section-title">
            <h2>{group}</h2>
            {onGroupToggle &&
              [
                "Rening",
                "Pumpning",
                "Källaröversvämningar",
                "Bräddning",
              ].includes(group) && (
                <label className="exclude-choice">
                  <input
                    type="checkbox"
                    aria-label={group + ": Inte aktuellt"}
                    checked={excludedGroups.includes(group)}
                    onChange={(e) => onGroupToggle(group, e.target.checked)}
                  />
                  Inte aktuellt
                </label>
              )}
          </div>
          {!(onGroupToggle && excludedGroups.includes(group)) && (
            <>
              {groupContent?.(group)}
              <details className="field-info">
                <summary>
                  <span className="info-icon" aria-hidden="true">
                    i
                  </span>{" "}
                  Om min, mest troligt och max
                </summary>
                <p>
                  Min och max beskriver osäkerheten i uppgiften. Mest troligt är
                  det troligaste utfallet, inte medelvärdet. Ange endast mest
                  troligt för ett fast värde; annars krävs både min och max.
                  Programmet använder en beta-PERT-fördelning för osäkra indata.
                  Resultatets P50 är medianen av simuleringarna och är inte
                  samma sak som inmatningens mest troliga värde.
                </p>
              </details>
              <div className="parameter-head">
                <span>Uppgift</span>
                <span>Min</span>
                <span>Mest troligt</span>
                <span>Max</span>
              </div>
              {fields
                .filter((x) => x[3] === group)
                .map(([key, label, unit]) => {
                  const p = values[key];
                  const fieldSupport = support?.(key);
                  const inherited =
                    (key === "flood_reduction" &&
                      excludedGroups.includes("Källaröversvämningar")) ||
                    (key === "overflow_reduction" &&
                      excludedGroups.includes("Bräddning"));
                  const canExclude =
                    !!errorScope &&
                    [
                      "other",
                      "investment",
                      "construction_co2",
                      "traffic",
                      "renewal",
                      "other_cost",
                      "other_benefit",
                      "flood_reduction",
                      "overflow_reduction",
                    ].includes(key);
                  const excluded = inherited || p.excluded === true;
                  const choice = canExclude && (
                    <label className="exclude-choice">
                      <input
                        type="checkbox"
                        aria-label={label + ": Inte aktuellt"}
                        checked={excluded}
                        disabled={inherited}
                        onChange={(e) =>
                          onChange(key, { ...p, excluded: e.target.checked })
                        }
                      />
                      {inherited ? "Inte aktuellt i nuläget" : "Inte aktuellt"}
                    </label>
                  );
                  if (excluded)
                    return (
                      <div className="excluded-row" key={key}>
                        <strong>{label}</strong>
                        {choice}
                      </div>
                    );
                  return (
                    <FieldValidation
                      key={key}
                      path={errorScope ? errorScope + "." + key : undefined}
                    >
                      <div className="parameter">
                        {fieldSupport && (
                          <div className="supported-heading">
                            <strong>{label}</strong>
                            {fieldSupport}
                          </div>
                        )}
                        <div className="parameter-row">
                          <div>
                            {!fieldSupport && <strong>{label}</strong>}
                            <small>{unit}</small>
                            {choice}
                          </div>
                          {(["low", "mode", "high"] as const).map((k) => (
                            <NumberField
                              key={k}
                              grouped={unit.includes("kr")}
                              label={`${label}, ${{ low: "min", mode: "mest troligt", high: "max" }[k]}`}
                              value={p[k]}
                              onChange={(v) =>
                                onChange(key, {
                                  ...p,
                                  [k]: v,
                                  derived: undefined,
                                  source: p.source.startsWith(
                                    "Beräkningshjälp:",
                                  )
                                    ? "Eget värde"
                                    : p.source,
                                  note: p.source.startsWith("Beräkningshjälp:")
                                    ? "Manuellt ändrat; tidigare stödberäkning finns kvar som underlag."
                                    : p.note,
                                })
                              }
                            />
                          ))}
                        </div>
                        {help[key] && (
                          <div className="field-help">
                            <p>{help[key][0]}</p>
                          </div>
                        )}
                        {key === "arv_ground" && (
                          <p className="notice">
                            Marginalvärdena ska inte användas vid stora
                            flödesförändringar, exempelvis när allt
                            tillskottsvatten tas bort. ARV-metoden är ännu inte
                            slutligt granskad.
                          </p>
                        )}
                        <details className="field-info">
                          <summary aria-label={"Information om " + label}>
                            <span className="info-icon" aria-hidden="true">
                              i
                            </span>{" "}
                            Information
                          </summary>
                          {help[key] && (
                            <>
                              <p>{help[key][1]}</p>
                              {unit.startsWith("kr") && (
                                <p>
                                  Ange värdet av faktisk resursåtgång utan moms,
                                  inflation, avskrivningar och låneränta. Ta med
                                  kostnaden oavsett vem i samhället som bär den
                                  och undvik dubbelräkning.
                                </p>
                              )}
                              <small>
                                Bearbetat från grundfilens Vägledning.
                              </small>
                            </>
                          )}
                          {examples[key] && (
                            <div className="example-info">
                              <h4>Startvärde från Göteborgsexemplet</h4>
                              <p>
                                Min:{" "}
                                {examples[key][0] === null
                                  ? "–"
                                  : fmt(examples[key][0], 5)}{" "}
                                · Mest troligt: {fmt(examples[key][1], 5)} ·
                                Max:{" "}
                                {examples[key][2] === null
                                  ? "–"
                                  : fmt(examples[key][2], 5)}{" "}
                                {unit}.
                              </p>
                              <p>
                                Källa: TSV KNA.xlsb, blad Nuläge,
                                exempelkolumner G–I, rad{" "}
                                {fields.find((f) => f[0] === key)?.[4]}.
                                Historiska exempel, inte aktuella
                                rekommendationer. Kontrollera att de passar ditt
                                område.
                              </p>
                              <p>
                                {[p.low, p.mode, p.high].every(
                                  (value, i) => value === examples[key][i],
                                )
                                  ? "Fältets värden överensstämmer med Göteborgsexemplet."
                                  : "Fältets värden skiljer sig från Göteborgsexemplet."}
                              </p>
                            </div>
                          )}
                          <label className="field">
                            Källa
                            <input
                              value={p.source}
                              onChange={(e) =>
                                onChange(key, { ...p, source: e.target.value })
                              }
                            />
                          </label>
                          <label className="field">
                            Kommentar
                            <input
                              value={p.note}
                              onChange={(e) =>
                                onChange(key, { ...p, note: e.target.value })
                              }
                            />
                          </label>
                        </details>
                      </div>
                    </FieldValidation>
                  );
                })}
            </>
          )}
        </section>
      ))}
    </>
  );
}
const helperDefinitions: Record<
  string,
  { name: string; fields: [string, string, string, number][] }
> = {
  climate: {
    name: "Klimatpåverkan anläggning",
    fields: [
      ["trenchless_length", "Längd schaktfritt", "m", 0],
      ["trench_length", "Längd med schakt", "m", 0],
      ["trenchless_factor", "Utsläpp schaktfritt", "kg CO₂e/m", 10],
      ["trench_factor", "Utsläpp med schakt", "kg CO₂e/m", 104],
    ],
  },
  traffic: {
    name: "Trafikpåverkan",
    fields: [
      ["trenchless_length", "Längd schaktfritt", "m", 0],
      ["trench_length", "Längd med schakt", "m", 0],
      ["trenchless_speed", "Hastighet schaktfritt", "m/dygn", 100],
      ["trench_speed", "Hastighet med schakt", "m/dygn", 5],
      ["delay", "Försening per fordon", "sekunder", 30],
      ["vehicles", "Årsmedeldygntrafik", "fordon/dygn", 5000],
      ["time_cost", "Tidskostnad", "kr/timme/fordon", 125],
    ],
  },
  flood: { name: "Källaröversvämningsrisk", fields: [] },
  arv: {
    name: "Investering reningsverk",
    fields: [
      ["share", "Andel tillskottsvatten", "%", 50],
      ["next_year", "Nästa nyinvestering", "år", 2032],
      ["building_share", "Andel bygg (resten installation)", "%", 70],
      ["building_life", "Livslängd bygg", "år", 50],
      ["installation_life", "Livslängd installation", "år", 25],
      ["building_reinvestment", "Reinvestering bygg", "%", 30],
      ["installation_reinvestment", "Reinvestering installation", "%", 50],
    ],
  },
};
function Helpers({
  project,
  onApply,
  notify,
  kind,
  target,
}: {
  kind: string;
  target: string;
  project: Project;
  onApply: (entry: any, target: string) => void;
  notify: (s: string) => void;
}) {
  const [uncertain, setUncertain] = useState(false);
  const [values, setValues] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  useEffect(() => {
    const previous = [...project.helpers]
      .reverse()
      .find((h) => h.kind === kind && h.target === target);
    const initial = structuredClone(
      previous?.values ||
        (kind === "flood"
          ? { times: [1, 2, 5, 10, 20, 100], counts: [0, 0, 0, 0, 0, 0] }
          : Object.fromEntries(
              helperDefinitions[kind].fields.map((x) => [x[0], x[3]]),
            )),
    );
    if (kind === "climate" && !previous) {
      initial.trenchless_factor = {
        low: 1,
        mode: 10,
        high: 217,
        source: "Göteborgsexempel, TSV KNA.xlsb, Beräkningshjälp!H48:J48",
        note: "Historiskt exempel; bedöm lokal relevans.",
      };
      initial.trench_factor = {
        low: 33,
        mode: 104,
        high: 855,
        source: "Göteborgsexempel, TSV KNA.xlsb, Beräkningshjälp!H49:J49",
        note: "Historiskt exempel; bedöm lokal relevans.",
      };
    }
    if (kind === "traffic" && !previous) {
      const examples = {
        trenchless_speed: [80, 100, 150],
        trench_speed: [4, 5, 6],
        delay: [5, 30, 120],
        vehicles: [300, 5000, 40000],
        time_cost: [null, 125, null],
      };
      for (const [key, v] of Object.entries(examples))
        initial[key] = {
          low: v[0],
          mode: v[1],
          high: v[2],
          source:
            "Göteborgsexempel, TSV KNA.xlsb, Beräkningshjälp!I63 och H66:J69",
          note: "Historiskt exempel; bedöm lokal relevans.",
        };
    }
    if (["climate", "traffic"].includes(kind)) {
      const shared = [...project.helpers]
        .reverse()
        .find(
          (h) => h.target === target && ["climate", "traffic"].includes(h.kind),
        );
      if (shared)
        for (const k of ["trench_length", "trenchless_length"])
          initial[k] = structuredClone(shared.values[k]);
      const hasUncertainty = Object.values(initial).some(
        (v) => v && typeof v === "object" && "mode" in v,
      );
      if (hasUncertainty)
        for (const k of Object.keys(initial))
          if (typeof initial[k] === "number")
            initial[k] = {
              low: null,
              mode: initial[k],
              high: null,
              source: "",
              note: "",
            };
    }
    setValues(structuredClone(initial));
    setResult(null);
    setUncertain(
      Object.values(initial).some(
        (v) => v && typeof v === "object" && "mode" in v,
      ),
    );
  }, [kind, target]);
  useEffect(() => setResult(null), [project.analysis]);
  const update = (k: string, v: any) => {
    setValues({ ...values, [k]: v });
    setResult(null);
  };
  return (
    <>
      <section className="card">
        <h2>{helperDefinitions[kind].name}</h2>
        <p className="muted">
          Ursprung och indata sparas när du använder resultatet. Klimat- och
          trafikhjälpen kan använda fasta värden eller osäkerhetsintervall.
          Föreslagna startvärden måste anpassas till ditt projekt.
        </p>
        <p className="muted">
          Ändringar används först när du väljer Använd. Spara därefter
          projektet. Stänger du stödet innan dess lämnas ändringarna bort.
        </p>
        {["climate", "traffic"].includes(kind) && (
          <p>
            Ledningslängder hämtas från senast använda klimat- eller
            trafikunderlag för denna åtgärd. Ändrade längder behöver användas i
            båda beräkningarna.
          </p>
        )}
        {kind === "arv" && (
          <p className="notice">
            Stödet fyller i tre marginalvärden samtidigt. P50 överförs som fasta
            värden; osäkerheten förs inte vidare. Metoden behöver slutgranskas.
          </p>
        )}
        {kind === "flood" && (
          <p>
            Ange antal översvämmade källare vid varje återkomsttid. Stödet
            beräknar ett förväntat antal per år från riskkurvan. Modellen antar
            konstant antal bortom 100-årshändelsen.
          </p>
        )}
        {kind === "climate" && (
          <details className="field-info">
            <summary aria-label="Information om klimatfaktorer">
              <span className="info-icon" aria-hidden="true">
                i
              </span>{" "}
              Information om utsläpp per meter
            </summary>
            <p>
              Grundfilens Göteborgsexempel används som startvärden i nya
              klimatunderlag. Sparade underlag behåller sina egna värden.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Arbetssätt</th>
                  <th>Min</th>
                  <th>Mest troligt</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Schaktfritt</th>
                  <td>1</td>
                  <td>10</td>
                  <td>217</td>
                </tr>
                <tr>
                  <th>Med schakt</th>
                  <td>33</td>
                  <td>104</td>
                  <td>855</td>
                </tr>
              </tbody>
            </table>
            <p>
              Enhet: kg CO₂e/m. Källa: TSV KNA.xlsb, Beräkningshjälp!H48:J49.
              Vägledningen beskriver dessa som schabloner från Göteborg för
              schaktfritt arbete (exempelvis infodring) och arbete med schakt
              (exempelvis separering).
            </p>
            <p>
              Värdena är historiska exempel och behöver bedömas för projektets
              material, dimensioner och arbetsmetod. De är utsläpp, inte kronor.
              Stödet multiplicerar längden med utsläppet per meter; kostnaden
              beräknas med projektets koldioxidvärdering. Osäkerhetsintervallet
              är förvalt. Om du väljer fasta värden används bara det mest
              troliga värdet.
            </p>
          </details>
        )}
        {kind === "traffic" && (
          <details className="field-info">
            <summary aria-label="Information om trafikexempel">
              <span className="info-icon" aria-hidden="true">
                i
              </span>{" "}
              Information om trafikens startvärden
            </summary>
            <p>
              Historiska Göteborgsexempel från TSV KNA.xlsb, Beräkningshjälp!I63
              och H66:J69. Vägledningen anger att tidskostnaden bygger på en
              VTI-studie, men fullständig studiereferens och prisår framgår inte
              av den granskade vägledningstexten.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Uppgift</th>
                  <th>Min</th>
                  <th>Mest troligt</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Schaktfritt, m/dygn</th>
                  <td>80</td>
                  <td>100</td>
                  <td>150</td>
                </tr>
                <tr>
                  <th>Schakt, m/dygn</th>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                </tr>
                <tr>
                  <th>Försening, sekunder/fordon</th>
                  <td>5</td>
                  <td>30</td>
                  <td>120</td>
                </tr>
                <tr>
                  <th>Årsmedeldygntrafik, fordon/dygn</th>
                  <td>300</td>
                  <td>5 000</td>
                  <td>40 000</td>
                </tr>
                <tr>
                  <th>Tidskostnad, kr/timme/fordon</th>
                  <td>–</td>
                  <td>125</td>
                  <td>–</td>
                </tr>
              </tbody>
            </table>
            <p>
              Byggtid uppskattas som längd delad med arbetstakt. Förlorad
              trafiktid värderas med försening, trafikmängd och tidskostnad. Byt
              exemplen mot lokala uppgifter när sådana finns. 125 kr är ett fast
              historiskt exempel, inte en aktuell rekommendation. Längderna
              måste anges för åtgärden; noll i längdfältet är inget
              Göteborgsexempel.
            </p>
          </details>
        )}
        {kind === "arv" && (
          <details className="field-info">
            <summary aria-label="Information om reningsverkets exempelvärden">
              <span className="info-icon" aria-hidden="true">
                i
              </span>{" "}
              Information om reningsverkets startvärden
            </summary>
            <p>Grundfilens exempel finns i Beräkningshjälp!H8:I10:</p>
            <table>
              <thead>
                <tr>
                  <th>Uppgift</th>
                  <th>Bygg</th>
                  <th>Installation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Andel av nyinvesteringen</th>
                  <td>70 %</td>
                  <td>30 %</td>
                </tr>
                <tr>
                  <th>Livslängd</th>
                  <td>50 år</td>
                  <td>25 år</td>
                </tr>
                <tr>
                  <th>Reinvestering efter livslängden</th>
                  <td>30 %</td>
                  <td>50 %</td>
                </tr>
              </tbody>
            </table>
            <p>
              Installationens andel är resten efter byggandelen.
              Reinvesteringsandel betyder hur stor del av respektive komponents
              ursprungliga investering som återinvesteras efter dess livslängd.
              Modellen bygger på expertbedömningar av dimensionering och
              använder referensscenarier för 30, 50 och 70 procent
              tillskottsvatten. Värden mellan scenarierna interpoleras; utanför
              30–70 procent används närmaste scenario.
            </p>
            <p>
              Andel tillskottsvatten 50 % och nyinvesteringsår 2032 är
              programmets redigerbara startantaganden, inte förifyllda
              projektspecifika värden från grundfilen. Ange egna uppgifter.
              Stödet beräknar marginalnyttor, inte hela reningsverkets
              investeringskostnad. Den rekonstruerade metoden behöver
              slutgranskas.
            </p>
          </details>
        )}
        {kind === "flood" && (
          <details className="field-info">
            <summary aria-label="Information om översvämningsunderlag">
              <span className="info-icon" aria-hidden="true">
                i
              </span>{" "}
              Information om återkomsttider och skadeantal
            </summary>
            <p>
              Återkomsttiderna 1, 2, 5, 10, 20 och 100 år kommer från
              Beräkningshjälp!C28:C33. Grundfilen innehåller inga exempel på
              antal översvämmade källare i D28:D33. Programmets nollor är
              startplatshållare och ska ersättas med områdets modellerade eller
              bedömda skadeantal. De är inte statistik från Göteborg.
            </p>
            <p>
              Stödet beräknar ett förväntat årsantal från riskkurvan. Sällsynta
              men allvarliga händelser kan därför påverka resultatet. Ange antal
              källare, inte procent. Saknas ett sådant underlag behöver du göra
              en dokumenterad egen bedömning.
            </p>
          </details>
        )}
        <div className="grid">
          {!uncertain &&
            helperDefinitions[kind].fields.map(([key, label, unit]) => (
              <NumberField
                key={kind + key}
                helpKey={key}
                label={label}
                unit={unit}
                value={values[key] ?? null}
                onChange={(v) => update(key, v)}
              />
            ))}
        </div>
        {["climate", "traffic"].includes(kind) && (
          <label className="check">
            <input
              type="checkbox"
              checked={uncertain}
              onChange={(e) => {
                const enabled = e.target.checked;
                setUncertain(enabled);
                setValues(
                  Object.fromEntries(
                    Object.entries(values).map(([k, v]: any) => [
                      k,
                      enabled
                        ? {
                            low: null,
                            mode: v,
                            high: null,
                            source: "",
                            note: "",
                          }
                        : v.mode,
                    ]),
                  ),
                );
                setResult(null);
              }}
            />
            Ange osäkerhetsintervall
          </label>
        )}
        {uncertain && (
          <Parameters
            fields={helperDefinitions[kind].fields.map(([k, l, u]) => [
              k,
              l,
              u,
              "Osäkra indata",
              0,
            ])}
            values={values}
            onChange={(key, p) => update(key, p)}
          />
        )}{" "}
        {kind === "flood" && (
          <div className="grid">
            {(values.times || []).map((t: number, i: number) => (
              <NumberField
                key={t}
                label={`Antal översvämningar vid ${t}-årsregn`}
                value={values.counts[i]}
                onChange={(v) =>
                  update(
                    "counts",
                    values.counts.map((x: number, j: number) =>
                      j === i ? v : x,
                    ),
                  )
                }
              />
            ))}
          </div>
        )}
        <button
          className="primary"
          onClick={async () => {
            try {
              setResult(
                await api("/helpers/" + kind, "POST", {
                  values,
                  settings: project.analysis,
                }),
              );
            } catch (e) {
              notify(String(e));
            }
          }}
        >
          Beräkna stödvärde
        </button>
      </section>
      {result && (
        <section className="card">
          <h2>Beräknat stödvärde</h2>
          <p>{result.note}</p>
          {result.distribution && (
            <p>
              P05: {fmt(result.distribution.p05, 2)}, P50:{" "}
              {fmt(result.distribution.p50, 2)}, P95:{" "}
              {fmt(result.distribution.p95, 2)} {result.unit}. Beloppen nedan
              använder troliga indata.
            </p>
          )}
          {result.metrics ? (
            <table>
              <thead>
                <tr>
                  <th>Flöde</th>
                  <th>P05</th>
                  <th>P50</th>
                  <th>P95</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.metrics).map(([k, s]: any) => (
                  <tr key={k}>
                    <td>
                      {
                        {
                          sewage: "Spillvatten",
                          arv_ground: "Grundvattenpåverkan",
                          arv_slow: "Trög regnpåverkan",
                          arv_fast: "Snabb regnpåverkan",
                        }[k as string]
                      }
                    </td>
                    <td>{fmt(s.p05, 3)}</td>
                    <td>{fmt(s.p50, 3)}</td>
                    <td>{fmt(s.p95, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="metrics">
              {result.emissions !== undefined && (
                <div>
                  <span>Utsläpp</span>
                  <strong>{fmt(result.emissions, 2)} kg CO₂e</strong>
                </div>
              )}
              {result.cost !== undefined && (
                <div>
                  <span>Kostnad</span>
                  <strong>{fmt(result.cost, 2)} kr</strong>
                </div>
              )}
              {result.expected !== undefined && (
                <div>
                  <span>Förväntat antal</span>
                  <strong>{fmt(result.expected, 3)} st/år</strong>
                </div>
              )}
            </div>
          )}
          <button
            className="primary"
            onClick={() => {
              onApply(
                { kind, values, result, created: new Date().toISOString() },
                ["arv", "flood"].includes(kind) ? "baseline" : target,
              );
              setResult(null);
            }}
          >
            Använd{" "}
            {kind === "arv"
              ? "P50 som fasta värden i nuläget"
              : ["flood"].includes(kind)
                ? "i nuläget"
                : "i åtgärden"}
          </button>
        </section>
      )}
    </>
  );
}
function FieldSupport({
  project,
  kind,
  target,
  onApply,
  notify,
}: {
  project: Project;
  kind: string;
  target: string;
  onApply: (entry: any, target: string) => void;
  notify: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const saved = [...project.helpers]
    .reverse()
    .find((h) => h.kind === kind && h.target === target);
  const parameters =
    target === "baseline"
      ? project.baseline
      : project.alternatives.find((a) => a.id === target)!.params;
  const keys = {
    climate: ["construction_co2"],
    traffic: ["traffic"],
    flood: ["floods"],
    arv: ["arv_ground", "arv_slow", "arv_fast"],
  }[kind]!;
  const linked = keys.every(
    (k) =>
      parameters[k].source ===
      "Beräkningshjälp: " + helperDefinitions[kind].name,
  );
  const latest = [...project.helpers]
    .reverse()
    .find(
      (h) => h.target === target && ["climate", "traffic"].includes(h.kind),
    );
  const outdated =
    saved &&
    latest &&
    ["climate", "traffic"].includes(kind) &&
    ["trench_length", "trenchless_length"].some(
      (k) =>
        JSON.stringify(saved.values[k]) !== JSON.stringify(latest.values[k]),
    );
  return (
    <div className="inline-support">
      <button
        className="support-toggle"
        aria-label={
          (open ? "Stäng stöd för " : "Öppna stöd för ") +
          helperDefinitions[kind].name
        }
        aria-expanded={open}
        title={
          outdated && linked
            ? "Ledningslängder har ändrats. Uppdatera underlaget."
            : saved
              ? "Visa eller ändra sparat beräkningsunderlag"
              : "Beräkna värdet med stöd"
        }
        onClick={() => setOpen(!open)}
      >
        {open
          ? "Stäng stöd"
          : outdated && linked
            ? "Uppdatera stöd"
            : "Beräkningsstöd"}
      </button>
      {open && (
        <div className="support-panel">
          <p className="muted">
            {linked ? "Beräknat med stöd" : "Eget värde"}
            {saved && !linked
              ? " · tidigare beräkningsunderlag finns sparat"
              : ""}
          </p>
          {outdated && linked && (
            <p className="notice">
              Ledningslängder har ändrats i det andra stödet. Beräkna och använd
              underlaget på nytt för att uppdatera detta värde.
            </p>
          )}
          <Helpers
            project={project}
            kind={kind}
            target={target}
            notify={notify}
            onApply={onApply}
          />
        </div>
      )}
    </div>
  );
}
function IntervalChart({
  alts,
  metric,
  title,
}: {
  alts: any[];
  metric: string;
  title: string;
}) {
  const min = Math.min(0, ...alts.map((a) => a[metric].p05));
  const max = Math.max(0, ...alts.map((a) => a[metric].p95));
  const scale = (v: number) => 170 + ((v - min) / (max - min || 1)) * 420;
  return (
    <section className="card chart">
      <h2>{title}</h2>
      <svg
        viewBox={`0 0 650 ${60 + alts.length * 64}`}
        role="img"
        aria-label={`${title}, kronor. Punkter visar median och intervall P05 till P95.`}
      >
        <line
          x1={scale(0)}
          x2={scale(0)}
          y1={10}
          y2={alts.length * 64 + 10}
          stroke="#c6d3ce"
        />
        {alts.map((a, i) => {
          const s: Stats = a[metric],
            y = 36 + i * 64;
          return (
            <g key={a.id}>
              <text x="0" y={y + 4}>
                {a.name.slice(0, 22)}
              </text>
              <line
                x1={scale(s.p05)}
                x2={scale(s.p95)}
                y1={y}
                y2={y}
                stroke="#538b7d"
                strokeWidth="3"
              />
              <rect
                x={scale(s.p25)}
                y={y - 10}
                width={Math.max(2, scale(s.p75) - scale(s.p25))}
                height="20"
                fill="#bdd9cc"
              />
              <circle cx={scale(s.p50)} cy={y} r="5" fill="#173d36" />
              <text x={scale(s.p50)} y={y + 27} textAnchor="middle">
                {fmt(s.p50)} kr
              </text>
              <title>{`${a.name}: P05 ${fmt(s.p05)}, P50 ${fmt(s.p50)}, P95 ${fmt(s.p95)} kr`}</title>
            </g>
          );
        })}
      </svg>
      <p className="caption">Punkt: P50. Låda: P25–P75. Linje: P05–P95.</p>
    </section>
  );
}
function Breakdown({
  alts,
  metric,
  title,
  categories,
}: {
  alts: any[];
  metric: string;
  title: string;
  categories: Record<string, string>;
}) {
  const rows = alts.flatMap((a) =>
    Object.entries(a[metric])
      .filter(([, v]: any) => v.p50 !== 0)
      .map(([key, v]: any) => ({ name: a.name, key, value: v.p50 })),
  );
  const max = Math.max(1, ...rows.map((x) => Math.abs(x.value)));
  return (
    <section className="card">
      <h2>{title}</h2>
      {rows.length ? (
        rows.map((x, i) => (
          <div className="bar-row" key={i}>
            <div>
              {x.name} · {categories[x.key]}
              <strong>{fmt(x.value)} kr</strong>
            </div>
            <div className="track">
              <div style={{ width: (Math.abs(x.value) / max) * 100 + "%" }} />
            </div>
          </div>
        ))
      ) : (
        <p>Inga belopp i detta typfall.</p>
      )}
      <p className="caption">
        Kategoriernas medianer (P50), diskonterade till analysens startår.
        Medianer är inte alltid additiva.
      </p>
    </section>
  );
}
function Results({
  run,
  categories,
  stale,
  inputLabels,
}: {
  run: any;
  categories: Record<string, string>;
  stale: boolean;
  inputLabels: Record<string, string>;
}) {
  if (!run || !run.result)
    return (
      <section className="card">
        <h1>Resultat</h1>
        <p>
          Fyll i nuläge och minst en åtgärd. Välj sedan Beräkna för att spara en
          resultatkörning.
        </p>
      </section>
    );
  const r = run.result,
    alts = r.alternatives;
  const excluded = [
    ...(run.input.excluded_groups || []).map(
      (name: string) => name + " (alla åtgärder)",
    ),
    ...[
      { name: "Nuläge", params: run.input.baseline },
      ...run.input.alternatives.filter((a: Alternative) => a.active),
    ].flatMap((g: { name: string; params: Record<string, P> }) =>
      Object.entries(g.params)
        .filter(([, v]) => v.excluded)
        .map(([key]) => `${g.name}: ${inputLabels[key] || key}`),
    ),
  ];
  return (
    <div className="report">
      <header className="intro">
        <div>
          <p className="eyebrow">
            Sparad värdering · {new Date(run.created).toLocaleString("sv-SE")}
          </p>
          <h1>{run.input.name}</h1>
          <p>
            {run.input.area} · {run.input.analysis.start}–
            {run.input.analysis.end} · {run.input.analysis.rate} % ränta
          </p>
        </div>
        <button className="no-print" onClick={() => window.print()}>
          Skriv ut / spara PDF
        </button>
      </header>
      {excluded.length > 0 && (
        <section className="card">
          <h2>Ingår inte i värderingen</h2>
          <p>
            Följande har markerats som Inte aktuellt och bidrar inte till
            resultatet:
          </p>
          <ul>
            {excluded.map((text: string, i: number) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </section>
      )}
      {stale && (
        <div className="notice">
          Indata har ändrats sedan denna beräkning. Resultatet visar den sparade
          körningens underlag.
        </div>
      )}
      <div className="notice">{r.validation_note}</div>
      <section className="card">
        <h2>Jämförelse med nuläget</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Åtgärd</th>
                <th>NNV P05</th>
                <th>NNV P50</th>
                <th>NNV P95</th>
                <th>Annuitet P50</th>
              </tr>
            </thead>
            <tbody>
              {alts.map((a: any) => (
                <tr key={a.id}>
                  <th>{a.name}</th>
                  <td>{fmt(a.npv.p05)} kr</td>
                  <td className={a.npv.p50 >= 0 ? "positive" : "negative"}>
                    {fmt(a.npv.p50)} kr
                  </td>
                  <td>{fmt(a.npv.p95)} kr</td>
                  <td>{fmt(a.annuity.p50)} kr/år</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Positivt nettonuvärde innebär större beräknade nyttor än kostnader.
          P50 är medianen av simuleringarna.
        </p>
        <details>
          <summary>Så tolkar du resultat och osäkerhet</summary>
          <p>
            Nettonuvärdet är diskonterade nyttor minus diskonterade kostnader,
            jämfört med nuläget. Annuiteten omvandlar nettonuvärdet till ett
            lika stort årligt belopp över analysperioden.
          </p>
          <p>
            P05–P95 omfattar de mittersta 90 procenten av modellens simulerade
            utfall. Det är inte en garanti för verkligheten: resultatet beror på
            indata, antaganden och vilka effekter som ingår. Använd analysen som
            del av en bredare bedömning.
          </p>
        </details>
      </section>
      <IntervalChart
        alts={alts}
        metric="npv"
        title="Nettonuvärde med osäkerhet"
      />
      <div className="chart-pair">
        <IntervalChart
          alts={alts}
          metric="benefits"
          title="Nuvärde av nyttor"
        />
        <IntervalChart
          alts={alts}
          metric="costs"
          title="Nuvärde av kostnader"
        />
      </div>
      <Breakdown
        alts={alts}
        metric="pv_benefit_categories"
        title="Nyttornas fördelning"
        categories={categories}
      />
      <Breakdown
        alts={alts}
        metric="pv_cost_categories"
        title="Kostnadernas fördelning"
        categories={categories}
      />
      <section className="card">
        <h2>Årliga kostnader efter åtgärd</h2>
        <p>Odiskonterade kr/år. Varje cell visar P05 / P50 / P95.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Nuläge</th>
                {alts.map((a: any) => (
                  <th key={a.id}>{a.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(r.baseline).map(([key, s]: any) => (
                <tr key={key}>
                  <th>{categories[key]}</th>
                  {[s, ...alts.map((a: any) => a.after[key])].map(
                    (x: any, i: number) => (
                      <td key={i}>
                        {fmt(x.p05)} / <b>{fmt(x.p50)}</b> / {fmt(x.p95)}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {alts.map((a: any) => (
        <section className="card" key={a.id}>
          <h2>{a.name} – detaljer</h2>
          <p>
            Andel simulerade utfall med positivt NNV:{" "}
            {fmt(a.probability_positive * 100, 1)} %.
          </p>
          {[
            ["annual_benefits", "Årliga nyttor efter åtgärd (kr/år)"],
            ["annual_costs", "Tillkommande årliga kostnader (kr/år)"],
            ["construction", "Byggnation, totalt före diskontering (kr)"],
          ].map(([key, label]) => (
            <details key={key}>
              <summary>{label}</summary>
              <table>
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>P05</th>
                    <th>P50</th>
                    <th>P95</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(a[key]).map(([k, s]: any) => (
                    <tr key={k}>
                      <td>{categories[k]}</td>
                      <td>{fmt(s.p05)}</td>
                      <td>{fmt(s.p50)}</td>
                      <td>{fmt(s.p95)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          ))}
          <details>
            <summary>Årsvis förlopp</summary>
            <table>
              <thead>
                <tr>
                  <th>År</th>
                  <th>Nyttor P50</th>
                  <th>Kostnader P50</th>
                  <th>Netto P50</th>
                  <th>Diskonterat netto P50</th>
                </tr>
              </thead>
              <tbody>
                {a.annual.map((row: any) => (
                  <tr key={row.year}>
                    <th>{row.year}</th>
                    <td>{fmt(row.benefit.p50)}</td>
                    <td>{fmt(row.cost.p50)}</td>
                    <td>{fmt(row.net.p50)}</td>
                    <td>{fmt(row.discounted_net.p50)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>
      ))}
      <section className="card">
        <h2>Antaganden och spårbarhet</h2>
        <p>{r.method_note}</p>
        <p>
          Beräkningsversion {r.version}. {r.iterations} simuleringar, slumpfrö{" "}
          {r.seed}. Projektrevision {run.revision}.
        </p>
        <p>{run.input.notes}</p>
        <details className="input-details">
          <summary>Visa alla sparade indata</summary>
          <InputReport project={run.input} labels={inputLabels} />
        </details>
      </section>
    </div>
  );
}
function InputReport({
  project,
  labels,
}: {
  project: Project;
  labels: Record<string, string>;
}) {
  return (
    <>
      <p>
        Områden som inte ingår: {project.excluded_groups?.join(", ") || "Inga"}.
      </p>
      <p>
        Andel mindre byggnader: {project.small_share} %. Koldioxidvärdering:{" "}
        {project.analysis.carbon} kr/kg CO₂e.
      </p>
      {[
        { name: "Nuläge", params: project.baseline },
        ...project.alternatives.map((a) => ({
          ...a,
          name: `${a.name} (${a.active ? "aktiv" : "inaktiv"}), byggår ${a.start}–${a.end}, flödesandelar ${a.shares.join("/")} %`,
        })),
      ].map((g, i) => (
        <div key={i}>
          <h3>{g.name}</h3>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Min</th>
                <th>Trolig</th>
                <th>Max</th>
                <th>Källa / kommentar</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(g.params).map(([k, v]) => {
                const group = {
                  treatment: "Rening",
                  treatment_co2: "Rening",
                  arv_ground: "Rening",
                  arv_slow: "Rening",
                  arv_fast: "Rening",
                  energy: "Pumpning",
                  electricity: "Pumpning",
                  electricity_co2: "Pumpning",
                  floods: "Källaröversvämningar",
                  damage_small: "Källaröversvämningar",
                  damage_large: "Källaröversvämningar",
                  social_small: "Källaröversvämningar",
                  social_large: "Källaröversvämningar",
                  overflow: "Bräddning",
                  overflow_internal: "Bräddning",
                  overflow_external: "Bräddning",
                  flood_reduction: "Källaröversvämningar",
                  overflow_reduction: "Bräddning",
                }[k];
                const excluded =
                  v.excluded ||
                  (group &&
                    project.excluded_groups?.includes(group) &&
                    (i === 0 ||
                      ["flood_reduction", "overflow_reduction"].includes(k)));
                return excluded ? (
                  <tr key={k}>
                    <td>{labels[k] || k}</td>
                    <td colSpan={4}>
                      Inte aktuellt – ingår inte i beräkningen
                    </td>
                  </tr>
                ) : (
                  <tr key={k}>
                    <td>{labels[k] || k}</td>
                    <td>{v.low ?? "–"}</td>
                    <td>{v.mode ?? "–"}</td>
                    <td>{v.high ?? "–"}</td>
                    <td>
                      {v.source} {v.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}
function App() {
  const [catalog, setCatalog] = useState<any>(null),
    [projects, setProjects] = useState<any[]>([]),
    [saved, setSaved] = useState<Saved | null>(null),
    [project, setProject] = useState<Project | null>(null),
    [tab, setTab] = useState("project"),
    [altIndex, setAltIndex] = useState(0),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [runs, setRuns] = useState<any[]>([]),
    [run, setRun] = useState<any>(null),
    [showArchived, setShowArchived] = useState(false),
    [backups, setBackups] = useState<string[]>([]),
    [backupChoice, setBackupChoice] = useState("");
  const [serverIssues, setFieldIssues] = useState<FieldIssue[]>([]);
  // These comparisons are recalculated as either the baseline or effect changes.
  const fieldIssues = [
    ...serverIssues.filter((issue) => !issue.message.includes("maximal minskning för")),
    ...effectIssues(project),
  ];
  useEffect(() => {
    setFieldIssues([]);
  }, [
    JSON.stringify(project?.excluded_groups),
    JSON.stringify(
      [
        project?.baseline,
        ...(project?.alternatives.map((a) => a.params) || []),
      ].map((params) =>
        Object.entries(params || {})
          .filter(([, v]) => v.excluded)
          .map(([k]) => k),
      ),
    ),
  ]);
  // Recompute the dependent share in drafts, including older saved projects.
  // The original saved revision remains unchanged until the user saves.
  useEffect(() => {
    if (!project) return;
    let changed = false;
    const alternatives = project.alternatives.map((a) => {
      const [ground, slow] = a.shares;
      const fast =
        typeof ground === "number" &&
        Number.isFinite(ground) &&
        typeof slow === "number" &&
        Number.isFinite(slow)
          ? Math.round((100 - ground - slow) * 1e10) / 1e10
          : null;
      if (a.shares[2] === fast) return a;
      changed = true;
      return { ...a, shares: [ground, slow, fast as number] };
    });
    if (changed) setProject({ ...project, alternatives });
  }, [project]);
  const dirty =
    !!project && JSON.stringify(project) !== JSON.stringify(saved?.data);
  const refresh = async () => setProjects(await api("/projects"));
  useEffect(() => {
    Promise.all([api("/catalog"), api("/projects")])
      .then(([c, p]) => {
        setCatalog(c);
        setProjects(p);
      })
      .catch((e) => setMessage(String(e)));
  }, []);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>("[data-field-path]")
      .forEach((container) => {
        const error = container.querySelector<HTMLElement>(".field-error");
        container
          .querySelectorAll<HTMLElement>("input,select")
          .forEach((input) => {
            if (error) {
              input.setAttribute("aria-invalid", "true");
              input.setAttribute("aria-describedby", error.id);
              input.setAttribute("title", error.textContent || "");
            } else {
              if (input.dataset.liveInvalid !== "true")
                input.removeAttribute("aria-invalid");
              input.removeAttribute("aria-describedby");
              input.removeAttribute("title");
            }
          });
      });
  }, [fieldIssues, tab, altIndex, project]);
  // Print expanded data without permanently changing the interactive view.
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = Array.from(
        document.querySelectorAll<HTMLDetailsElement>(
          ".report details:not([open])",
        ),
      );
      opened.forEach((x) => (x.open = true));
    };
    const after = () => {
      opened.forEach((x) => (x.open = false));
      opened = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  const guard = () =>
    !dirty ||
    window.confirm("Du har osparade ändringar. Lämna dem utan att spara?");
  const execute = async (fn: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      const fields: FieldIssue[] = (e as any).fields || [];
      setFieldIssues(fields);
      if (fields.length) {
        const path = fields[0].path;
        if (path.startsWith("alternatives")) {
          setTab("alternatives");
          const index = Number(path.split(".")[1]);
          if (Number.isInteger(index)) setAltIndex(index);
        } else setTab(path === "name" ? "project" : "baseline");
      }
      setMessage(
        fields.length
          ? `${new Set(fields.map((f) => f.path)).size} fält behöver kontrolleras. Se de röda markeringarna vid inmatningen.`
          : String(e).replace(/^Error: /, ""),
      );
    } finally {
      setBusy(false);
    }
  };
  const load = async (id: string) => {
    const p = await api("/projects/" + id);
    setFieldIssues([]);
    setSaved(p);
    setProject(p.data);
    const rs = await api("/projects/" + id + "/runs");
    setRuns(rs);
    const last = rs.find((x: any) => x.status === "complete");
    setRun(last ? await api("/runs/" + last.id) : null);
    setTab("project");
  };
  const save = async () => {
    if (!project) throw new Error("Inget projekt är öppet.");
    const p = await api(
      saved ? "/projects/" + saved.id : "/projects",
      saved ? "PUT" : "POST",
      saved ? { data: project, revision: saved.revision } : project,
    );
    setSaved(p);
    setProject(p.data);
    await refresh();
    return p as Saved;
  };
  const create = async (example = false) => {
    if (!guard()) return;
    setFieldIssues([]);
    setProject(await api("/template?example=" + example));
    setSaved(null);
    setRun(null);
    setRuns([]);
    setTab("project");
  };
  const patch = (change: Partial<Project>) =>
    setProject((p) => (p ? { ...p, ...change } : p));
  const updateAlt = (index: number, change: Partial<Alternative>) => {
    if (project)
      patch({
        alternatives: project.alternatives.map((a, i) =>
          i === index ? { ...a, ...change } : a,
        ),
      });
  };
  const apply = (entry: any, target: string) => {
    if (!project) return;
    const newP = structuredClone(project);
    const params =
      target === "baseline"
        ? newP.baseline
        : newP.alternatives.find((a) => a.id === target)!.params;
    Object.entries(entry.result.apply).forEach(
      ([key, value]) =>
        (params[key] = {
          ...(typeof value === "object"
            ? (value as P)
            : { low: null, high: null, mode: value as number }),
          source: "Beräkningshjälp: " + helperDefinitions[entry.kind].name,
          note: entry.result.note,
        }),
    );
    newP.helpers.push({ ...entry, target });
    setProject(newP);
    setMessage(
      "Stödvärdet har förts över. Spara projektet för att behålla det.",
    );
  };
  const alt = project?.alternatives[altIndex];
  const shareComplete =
    !!alt &&
    alt.shares.every((v) => typeof v === "number" && Number.isFinite(v));
  const shareSum = shareComplete
    ? alt!.shares.reduce((a, b) => a + b, 0)
    : null;
  const sharesInvalid =
    !shareComplete ||
    alt!.shares.some((v) => v < 0 || v > 100) ||
    Math.abs(shareSum! - 100) > 1e-8;
  const shareError = !shareComplete
    ? "Ange både grundvattenpåverkan och trög regnpåverkan."
    : "Andelarna måste ligga mellan 0 och 100 %. Grundvattenpåverkan och trög regnpåverkan får tillsammans vara högst 100 %.";
  return (
    <div className="app">
      <aside className="sidebar no-print">
        <a className="brand" href="/">
          Tillskottsvatten<span>VÄRDERING</span>
        </a>
        <p className="side-caption">Samhällsekonomiskt beslutsstöd</p>
        <button
          className="primary"
          disabled={busy}
          onClick={() => execute(() => create())}
        >
          + Nytt projekt
        </button>
        <button disabled={busy} onClick={() => execute(() => create(true))}>
          Öppna syntetiskt typfall
        </button>
        <div className="side-heading">MINA PROJEKT</div>
        <label className="check">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Visa arkiverade
        </label>
        <div className="project-list">
          {projects
            .filter((x) => showArchived || !x.archived)
            .map((p) => (
              <button
                disabled={busy}
                key={p.id}
                className={saved?.id === p.id ? "selected" : ""}
                onClick={() => {
                  if (guard()) execute(() => load(p.id));
                }}
              >
                <strong>{p.name}</strong>
                <small>
                  {p.archived ? "Arkiverat · " : ""}
                  {p.area || "Inget område angivet"}
                </small>
                <small>{new Date(p.updated).toLocaleDateString("sv-SE")}</small>
              </button>
            ))}
        </div>
        <div className="side-footer">
          <button
            disabled={busy}
            onClick={() =>
              execute(async () => {
                const b = await api("/backup", "POST", {});
                setBackups(await api("/backups"));
                setMessage("Säkerhetskopia skapad: " + b.file);
              })
            }
          >
            Säkerhetskopiera
          </button>
          <button
            disabled={busy}
            onClick={() =>
              execute(async () => setBackups(await api("/backups")))
            }
          >
            Visa säkerhetskopior
          </button>
          {backups.length > 0 && (
            <>
              <label className="field">
                Säkerhetskopia
                <select
                  value={backupChoice}
                  onChange={(e) => setBackupChoice(e.target.value)}
                >
                  <option value="">Välj en kopia</option>
                  {backups.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <button
                disabled={!backupChoice || busy}
                onClick={() =>
                  execute(async () => {
                    const r = await api("/restore", "POST", {
                      file: backupChoice,
                    });
                    await refresh();
                    setMessage(
                      `${r.restored} projekt återställda som nya kopior. Befintliga projekt finns kvar.`,
                    );
                  })
                }
              >
                Återställ som nya projekt
              </button>
            </>
          )}
          <small>Lokalt på din dator</small>
        </div>
      </aside>
      <main>
        <div className="toolbar no-print">
          <span className={"status " + (dirty ? "unsaved" : "")}>
            {busy
              ? "Arbetar…"
              : dirty
                ? "Osparade ändringar"
                : saved
                  ? "Sparat"
                  : "Inget projekt öppet"}
          </span>
          <div>
            <button
              disabled={!project || busy}
              onClick={() =>
                execute(async () => {
                  await save();
                  setMessage("Projektet är sparat.");
                })
              }
            >
              Spara projekt
            </button>
            <button
              className="primary"
              disabled={!project || busy}
              onClick={() =>
                execute(async () => {
                  setFieldIssues([]);
                  const p = dirty || !saved ? await save() : saved;
                  const r = await api(
                    "/projects/" + p.id + "/calculate",
                    "POST",
                    { revision: p.revision },
                  );
                  setRun(r);
                  setRuns(await api("/projects/" + p.id + "/runs"));
                  setTab("results");
                })
              }
            >
              {busy ? "Arbetar…" : "Beräkna"}
            </button>
          </div>
        </div>
        {message && (
          <div role="alert" className="message no-print">
            <button
              aria-label="Stäng meddelande"
              onClick={() => setMessage("")}
            >
              ×
            </button>
            {message}
          </div>
        )}
        {!project ? (
          <div className="welcome">
            <p className="eyebrow">FRÅN UNDERLAG TILL BESLUT</p>
            <h1>
              Värdera åtgärder
              <br />
              mot tillskottsvatten.
            </h1>
            <p>
              Jämför nyttor och kostnader, undersök osäkerheter och samla dina
              värderingsprojekt på ett ställe.
            </p>
            <button className="primary" onClick={() => execute(() => create())}>
              Skapa ditt första projekt
            </button>
            <p className="muted">
              Du kan också öppna ett syntetiskt typfall för att prova hela
              flödet.
            </p>
          </div>
        ) : (
          <>
            <nav className="tabs no-print" aria-label="Projektets delar">
              {[
                ["project", "Projekt"],
                ["baseline", "Nuläge"],
                ["alternatives", "Åtgärder"],
                ["results", "Resultat"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={tab === key ? "selected" : ""}
                  onClick={() => setTab(key)}
                >
                  {label}
                  {fieldIssues.some((e) =>
                    key === "project"
                      ? e.path === "name"
                      : key === "baseline"
                        ? /^(baseline|analysis|small_share)/.test(e.path)
                        : key === "alternatives"
                          ? e.path.startsWith("alternatives")
                          : false,
                  )
                    ? " · Fel"
                    : ""}
                </button>
              ))}
            </nav>
            {fieldIssues.length > 0 && (
              <p className="validation-summary" role="status">
                Markerade fält behöver kontrolleras. Effekterna jämförs direkt
                med nuläget. Övriga fel uppdateras när du väljer Beräkna igen.
              </p>
            )}
            <IssueContext.Provider value={fieldIssues}>
              <fieldset className="content editor" disabled={busy}>
                {tab === "project" && (
                  <>
                    <header className="intro">
                      <p className="eyebrow">VÄRDERINGSPROJEKT</p>
                      <h1>Projekt och förutsättningar</h1>
                      <p>
                        Börja med projektets namn. Arbetet sparas först när du
                        väljer Spara projekt eller Beräkna.
                      </p>
                    </header>
                    <section className="card">
                      <FieldValidation path={"name"}>
                        <label className="field">
                          Projektnamn
                          <input
                            value={project.name}
                            onChange={(e) => patch({ name: e.target.value })}
                          />
                        </label>
                      </FieldValidation>
                      <label className="field">
                        Utredningsområde
                        <input
                          value={project.area}
                          onChange={(e) => patch({ area: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        Beskrivning och anteckningar
                        <textarea
                          rows={5}
                          value={project.notes}
                          onChange={(e) => patch({ notes: e.target.value })}
                        />
                      </label>
                      {saved && (
                        <div className="actions">
                          <button
                            onClick={() => {
                              if (guard())
                                execute(async () => {
                                  const p = await api(
                                    "/projects/" + saved.id + "/copy",
                                    "POST",
                                    {},
                                  );
                                  await refresh();
                                  await load(p.id);
                                });
                            }}
                          >
                            Kopiera sparat projekt
                          </button>
                          <button
                            onClick={() =>
                              execute(async () => {
                                await api(
                                  "/projects/" + saved.id + "/archive",
                                  "POST",
                                  { archived: !saved.archived },
                                );
                                setSaved({
                                  ...saved,
                                  archived: saved.archived ? 0 : 1,
                                });
                                await refresh();
                              })
                            }
                          >
                            {saved.archived
                              ? "Återställ från arkiv"
                              : "Arkivera projekt"}
                          </button>
                        </div>
                      )}
                    </section>
                    <section className="card">
                      <h2>Så används modellen</h2>
                      <p>
                        Jämför upp till tre åtgärder med nuläget. Analysen
                        omfattar kommunens kostnader och effekter för resten av
                        samhället och är en del av ett bredare beslutsunderlag.
                      </p>
                      <p>
                        Börja med tillgängliga uppgifter och förbättra
                        underlaget stegvis. Prioritera poster som är osäkra
                        eller har stor påverkan på resultatet. Välj Inte
                        aktuellt för sådant som inte ingår; tomma fält betyder
                        att uppgifter saknas. Arbetet kan sparas även när det är
                        ofullständigt.
                      </p>
                      <p className="notice">
                        Versionen är under verifiering mot Excel-grundfilen.
                        ARV-hjälpen använder en dokumenterad rekonstruktion.
                      </p>
                    </section>
                  </>
                )}
                {tab === "baseline" && (
                  <>
                    <header className="intro">
                      <h1>Nuläge</h1>
                      <p>
                        Gemensamma förutsättningar för alla åtgärder. Min och
                        max beskriver osäkerheten, inte årets variation.
                      </p>
                    </header>
                    <section className="card">
                      <h2>Analysens förutsättningar</h2>
                      <p>
                        Min och max beskriver osäkerhet. Mest troligt är det
                        troligaste utfallet, inte medelvärdet. Lämna min och max
                        tomma för ett fast värde.
                      </p>

                      <div className="grid">
                        {(
                          [
                            ["start", "Startår", "år"],
                            ["end", "Slutår", "år"],
                            ["rate", "Diskonteringsränta", "%"],
                            ["carbon", "Koldioxidvärdering", "kr/kg CO₂e"],
                          ] as const
                        ).map(([k, l, u]) => (
                          <NumberField
                            key={k}
                            helpKey={k}
                            label={l}
                            unit={u}
                            errorPath={"analysis." + k}
                            value={project.analysis[k]}
                            onChange={(v) =>
                              patch({
                                analysis: { ...project.analysis, [k]: v },
                              })
                            }
                          />
                        ))}
                      </div>
                      <p className="muted">
                        Koldioxidvärderingen börjar på 1 kr/kg CO₂e i nya
                        projekt och kan ändras.
                      </p>
                      <details
                        className="calculation-settings"
                        open={
                          fieldIssues.some((e) =>
                            ["analysis.seed", "analysis.iterations"].includes(
                              e.path,
                            ),
                          )
                            ? true
                            : undefined
                        }
                      >
                        <summary>Beräkningsinställningar</summary>
                        <p>
                          Slumpfröet gör beräkningen reproducerbar. Fler
                          simuleringar ger stabilare numeriska resultat men gör
                          inte antagandena säkrare.
                        </p>
                        <div className="grid">
                          <NumberField
                            label="Slumpfrö"
                            helpKey="seed"
                            errorPath="analysis.seed"
                            value={project.analysis.seed}
                            onChange={(v) =>
                              patch({
                                analysis: {
                                  ...project.analysis,
                                  seed: v as number,
                                },
                              })
                            }
                          />
                          <FieldValidation path={"analysis.iterations"}>
                            <label className="field">
                              Simuleringar
                              <select
                                value={project.analysis.iterations}
                                onChange={(e) =>
                                  patch({
                                    analysis: {
                                      ...project.analysis,
                                      iterations: Number(e.target.value),
                                    },
                                  })
                                }
                              >
                                <option value={1000}>1 000</option>
                                <option value={10000}>10 000</option>
                              </select>
                            </label>
                            <FieldInfo
                              label="Simuleringar"
                              helpKey="iterations"
                            />
                          </FieldValidation>
                        </div>
                      </details>
                      <p className="muted">
                        Startåret är år 0. Årliga effekter räknas till och med
                        slutåret. Ett sparat slumpfrö gör resultaten
                        reproducerbara.
                      </p>
                    </section>
                    <Parameters
                      examples={catalog.examples}
                      groupContent={(group) =>
                        group === "Källaröversvämningar" ? (
                          <div className="flood-shares">
                            <h3>Fördelning av översvämmade byggnader</h3>
                            <p>
                              Andelen avser mindre byggnader, exempelvis småhus.
                              Startvärdet 100 % är ett redigerbart antagande i
                              programmet, inte ett Göteborgsexempel. Anpassa
                              fördelningen till området. Resterande andel räknas
                              som större byggnader.
                            </p>
                            <div className="grid">
                              {" "}
                              <NumberField
                                helpKey="small_share"
                                errorPath="small_share"
                                label="Andel mindre byggnader bland de översvämmade"
                                unit="%"
                                value={project.small_share}
                                onChange={(v) =>
                                  patch({ small_share: v as number })
                                }
                              />
                              <div className="field">
                                Andel större byggnader
                                <strong>
                                  {fmt(100 - project.small_share, 2)} %
                                </strong>
                              </div>
                            </div>
                          </div>
                        ) : null
                      }
                      support={(key) => {
                        const kind = { floods: "flood", arv_ground: "arv" }[
                          key
                        ];
                        return kind ? (
                          <FieldSupport
                            project={project}
                            kind={kind}
                            target="baseline"
                            onApply={apply}
                            notify={setMessage}
                          />
                        ) : null;
                      }}
                      excludedGroups={project.excluded_groups || []}
                      onGroupToggle={(group, excluded) => {
                        patch({
                          excluded_groups: excluded
                            ? [...(project.excluded_groups || []), group]
                            : (project.excluded_groups || []).filter(
                                (g) => g !== group,
                              ),
                        });
                        setFieldIssues([]);
                      }}
                      errorScope="baseline"
                      fields={catalog?.baseline || []}
                      values={project.baseline}
                      onChange={(k, p) =>
                        patch({ baseline: { ...project.baseline, [k]: p } })
                      }
                    />
                  </>
                )}
                {tab === "alternatives" && alt && (
                  <>
                    <header className="intro">
                      <h1>Åtgärder</h1>
                      <p>
                        Varje alternativ jämförs med samma nuläge. Nyttor och
                        löpande kostnader börjar året efter färdigställandet.
                      </p>
                    </header>
                    <div className="subnav">
                      {project.alternatives.map((a, i) => (
                        <button
                          key={a.id}
                          className={i === altIndex ? "selected" : ""}
                          onClick={() => setAltIndex(i)}
                        >
                          {a.name}
                          {!a.active ? " · inaktiv" : ""}
                          {fieldIssues.some((e) =>
                            e.path.startsWith("alternatives." + i + "."),
                          )
                            ? " · Fel"
                            : ""}
                        </button>
                      ))}
                    </div>
                    <section className="card">
                      <FieldValidation path="alternatives">
                        <label className="check">
                          <input
                            type="checkbox"
                            checked={alt.active}
                            onChange={(e) =>
                              updateAlt(altIndex, { active: e.target.checked })
                            }
                          />
                          Ta med i analysen
                        </label>
                      </FieldValidation>
                      <FieldValidation
                        path={"alternatives." + altIndex + ".name"}
                      >
                        <label className="field">
                          Namn på åtgärden
                          <input
                            value={alt.name}
                            onChange={(e) =>
                              updateAlt(altIndex, { name: e.target.value })
                            }
                          />
                        </label>
                      </FieldValidation>
                      <div className="grid">
                        <NumberField
                          errorPath={"alternatives." + altIndex + ".start"}
                          helpKey="build_start"
                          label="Byggstart"
                          value={alt.start}
                          onChange={(v) =>
                            updateAlt(altIndex, { start: v as number })
                          }
                        />
                        <NumberField
                          errorPath={"alternatives." + altIndex + ".end"}
                          helpKey="build_end"
                          label="Färdigställande"
                          value={alt.end}
                          onChange={(v) =>
                            updateAlt(altIndex, { end: v as number })
                          }
                        />
                      </div>
                      <p>
                        Byggkostnader fördelas jämnt från och med byggstart till
                        och med färdigställande.
                      </p>
                      <h3>Fördelning av borttaget tillskottsvatten</h3>
                      <p>
                        Andelarna gäller den volym som åtgärden tar bort, inte
                        allt vatten i nuläget.
                      </p>
                      <div
                        className={
                          "grid share-fields" +
                          (sharesInvalid ? " shares-invalid" : "")
                        }
                        role="group"
                        aria-label="Fördelning av borttaget tillskottsvatten"
                        aria-describedby="share-total"
                        title={sharesInvalid ? shareError : undefined}
                      >
                        {[
                          "Grundvattenpåverkan",
                          "Trög regnpåverkan",
                          "Snabb regnpåverkan",
                        ].map((label, i) => (
                          <NumberField
                            key={alt.id + i}
                            label={label}
                            unit="%"
                            value={alt.shares[i]}
                            readOnly={i === 2}
                            invalid={sharesInvalid}
                            onChange={(v) => {
                              if (i === 2) return;
                              const shares = [...alt.shares];
                              shares[i] = v as number;
                              shares[2] = (
                                typeof shares[0] === "number" &&
                                typeof shares[1] === "number"
                                  ? Math.round(
                                      (100 - shares[0] - shares[1]) * 1e10,
                                    ) / 1e10
                                  : null
                              ) as number;
                              updateAlt(altIndex, { shares });
                            }}
                          />
                        ))}
                      </div>
                      <p className="muted">
                        Snabb regnpåverkan beräknas automatiskt: 100 % minus
                        grundvattenpåverkan och trög regnpåverkan.
                      </p>
                      <p
                        id="share-total"
                        className={sharesInvalid ? "field-error" : undefined}
                        role="status"
                      >
                        {shareComplete && alt.shares[0] + alt.shares[1] > 100
                          ? `Grundvattenpåverkan + trög regnpåverkan: ${fmt(alt.shares[0] + alt.shares[1], 2)} % (högst 100 %).`
                          : `Summa: ${shareSum === null ? "–" : fmt(shareSum, 2)} % (ska vara 100 %).`}
                        {sharesInvalid && <> {shareError}</>}
                      </p>
                    </section>
                    <Parameters
                      key={alt.id}
                      support={(key) => {
                        const kind = {
                          construction_co2: "climate",
                          traffic: "traffic",
                        }[key];
                        return kind ? (
                          <FieldSupport
                            key={alt.id + kind}
                            project={project}
                            kind={kind}
                            target={alt.id}
                            onApply={apply}
                            notify={setMessage}
                          />
                        ) : null;
                      }}
                      excludedGroups={project.excluded_groups || []}
                      errorScope={"alternatives." + altIndex + ".params"}
                      fields={catalog?.alternative || []}
                      values={alt.params}
                      onChange={(k, p) =>
                        updateAlt(altIndex, {
                          params: { ...alt.params, [k]: p },
                        })
                      }
                    />
                  </>
                )}
                {tab === "results" && (
                  <>
                    {runs.length > 0 && (
                      <label className="field no-print">
                        Sparad körning
                        <select
                          value={run?.id || ""}
                          onChange={(e) =>
                            execute(async () =>
                              setRun(await api("/runs/" + e.target.value)),
                            )
                          }
                        >
                          {runs
                            .filter((x) => x.status === "complete")
                            .map((x) => (
                              <option key={x.id} value={x.id}>
                                {new Date(x.created).toLocaleString("sv-SE")} ·
                                revision {x.revision}
                              </option>
                            ))}
                        </select>
                      </label>
                    )}
                    <Results
                      run={run}
                      inputLabels={Object.fromEntries(
                        [
                          ...(catalog?.baseline || []),
                          ...(catalog?.alternative || []),
                        ].map((x: Field) => [x[0], `${x[1]} (${x[2]})`]),
                      )}
                      categories={catalog?.categories || {}}
                      stale={
                        dirty || (!!run && run.revision !== saved?.revision)
                      }
                    />
                    {runs
                      .filter((x) => x.status === "failed")
                      .map((x) => (
                        <p className="notice" key={x.id}>
                          Avbruten körning: {x.error}
                        </p>
                      ))}
                  </>
                )}
              </fieldset>
            </IssueContext.Provider>
          </>
        )}
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
