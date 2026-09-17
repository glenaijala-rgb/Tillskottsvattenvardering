import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type P = {
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
  if (!r.ok)
    throw new Error(
      Array.isArray(data.detail)
        ? data.detail
            .map((x: any) => (typeof x === "string" ? x : JSON.stringify(x)))
            .join("\n")
        : data.detail || "Något gick fel.",
    );
  return data;
}
function NumberField({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  unit?: string;
}) {
  const [text, setText] = useState(
    value == null ? "" : String(value).replace(".", ","),
  );
  useEffect(
    () => setText(value == null ? "" : String(value).replace(".", ",")),
    [value],
  );
  return (
    <label className="field">
      {label}
      {unit && <span className="unit">{unit}</span>}
      <input
        inputMode="decimal"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const v = parse(e.target.value);
          if (v === null || Number.isFinite(v)) onChange(v);
        }}
        onBlur={() => {
          const v = parse(text);
          if (v !== null && !Number.isFinite(v)) {
            setText(value == null ? "" : String(value));
          }
        }}
      />
    </label>
  );
}
function Parameters({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Record<string, P>;
  onChange: (key: string, p: P) => void;
}) {
  return (
    <>
      {[...new Set(fields.map((x) => x[3]))].map((group) => (
        <section className="card" key={group}>
          <h2>{group}</h2>
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
              return (
                <div key={key} className="parameter">
                  <div className="parameter-row">
                    <div>
                      <strong>{label}</strong>
                      <small>{unit}</small>
                    </div>
                    {(["low", "mode", "high"] as const).map((k) => (
                      <NumberField
                        key={k}
                        label={`${label}, ${{ low: "min", mode: "mest troligt", high: "max" }[k]}`}
                        value={p[k]}
                        onChange={(v) =>
                          onChange(key, { ...p, [k]: v, derived: undefined })
                        }
                      />
                    ))}
                  </div>
                  <details>
                    <summary>
                      Källa och kommentar{p.source ? " · " + p.source : ""}
                    </summary>
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
              );
            })}
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
      ["trenchless_factor", "Utsläpp schaktfritt", "kg CO₂e/m", 0],
      ["trench_factor", "Utsläpp med schakt", "kg CO₂e/m", 0],
    ],
  },
  traffic: {
    name: "Trafikpåverkan",
    fields: [
      ["trenchless_length", "Längd schaktfritt", "m", 0],
      ["trench_length", "Längd med schakt", "m", 0],
      ["trenchless_speed", "Hastighet schaktfritt", "m/dygn", 100],
      ["trench_speed", "Hastighet med schakt", "m/dygn", 5],
      ["delay", "Försening per fordon", "sekunder", 0],
      ["vehicles", "Årsmedeldygntrafik", "fordon/dygn", 0],
      ["time_cost", "Tidskostnad", "kr/timme/fordon", 0],
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
}: {
  project: Project;
  onApply: (entry: any, target: string) => void;
  notify: (s: string) => void;
}) {
  const [uncertain, setUncertain] = useState(false);
  const [kind, setKind] = useState("climate");
  const [values, setValues] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [target, setTarget] = useState("1");
  useEffect(() => {
    setValues(
      kind === "flood"
        ? { times: [1, 2, 5, 10, 20, 100], counts: [0, 0, 0, 0, 0, 0] }
        : Object.fromEntries(
            helperDefinitions[kind].fields.map((x) => [x[0], x[3]]),
          ),
    );
    setResult(null);
    setUncertain(false);
  }, [kind]);
  const update = (k: string, v: any) => {
    setValues({ ...values, [k]: v });
    setResult(null);
  };
  return (
    <>
      <div className="intro">
        <h1>Beräkningshjälp</h1>
        <p>
          Räkna fram ett stödvärde. Granska resultatet och välj sedan att
          använda det i projektet.
        </p>
      </div>
      <div className="subnav">
        {Object.entries(helperDefinitions).map(([key, h]) => (
          <button
            key={key}
            className={kind === key ? "selected" : ""}
            onClick={() => setKind(key)}
          >
            {h.name}
          </button>
        ))}
      </div>
      <section className="card">
        <h2>{helperDefinitions[kind].name}</h2>
        <p className="muted">
          Ursprung och indata sparas när du använder resultatet. Klimat- och
          trafikhjälpen kan använda fasta värden eller osäkerhetsintervall.
          Föreslagna startvärden måste anpassas till ditt projekt.
        </p>
        <div className="grid">
          {!uncertain &&
            helperDefinitions[kind].fields.map(([key, label, unit]) => (
              <NumberField
                key={kind + key}
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
          {!["arv", "flood"].includes(kind) && (
            <label className="field">
              Till åtgärd
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                {project.alternatives.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
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
      <section className="card">
        <h2>Använda stödberäkningar</h2>
        {project.helpers.length ? (
          project.helpers.map((h, i) => (
            <details key={i}>
              <summary>
                {helperDefinitions[h.kind]?.name} ·{" "}
                {new Date(h.created).toLocaleString("sv-SE")}
              </summary>
              <pre>{JSON.stringify(h, null, 2)}</pre>
            </details>
          ))
        ) : (
          <p>Inga stödvärden har använts ännu.</p>
        )}
      </section>
    </>
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
              {Object.entries(g.params).map(([k, v]) => (
                <tr key={k}>
                  <td>{labels[k] || k}</td>
                  <td>{v.low ?? "–"}</td>
                  <td>{v.mode ?? "–"}</td>
                  <td>{v.high ?? "–"}</td>
                  <td>
                    {v.source} {v.note}
                  </td>
                </tr>
              ))}
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
      setMessage(String(e).replace(/^Error: /, ""));
    } finally {
      setBusy(false);
    }
  };
  const load = async (id: string) => {
    const p = await api("/projects/" + id);
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
                ["helpers", "Beräkningshjälp"],
                ["results", "Resultat"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={tab === key ? "selected" : ""}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </nav>
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
                    <label className="field">
                      Projektnamn
                      <input
                        value={project.name}
                        onChange={(e) => patch({ name: e.target.value })}
                      />
                    </label>
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
                      Fyll i nuläget och jämför upp till tre åtgärder. Använd
                      belopp exklusive moms, inflation och låneränta. Ta med
                      både kommunens kostnader och externa samhällseffekter.
                    </p>
                    <p>
                      Fyll i alla relevanta värden. Skriv 0 där en post inte är
                      aktuell. Lämna min och max tomma för ett fast värde. Du
                      kan spara även när uppgifter saknas.
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
                      Gemensamma förutsättningar för alla åtgärder. Min och max
                      beskriver osäkerheten, inte årets variation.
                    </p>
                  </header>
                  <section className="card">
                    <h2>Analysens förutsättningar</h2>
                    <div className="grid">
                      {(
                        [
                          ["start", "Startår", "år"],
                          ["end", "Slutår", "år"],
                          ["rate", "Diskonteringsränta", "%"],
                          ["carbon", "Koldioxidvärdering", "kr/kg CO₂e"],
                          ["seed", "Slumpfrö", ""],
                        ] as const
                      ).map(([k, l, u]) => (
                        <NumberField
                          key={k}
                          label={l}
                          unit={u}
                          value={project.analysis[k]}
                          onChange={(v) =>
                            patch({ analysis: { ...project.analysis, [k]: v } })
                          }
                        />
                      ))}
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
                      <NumberField
                        label="Andel mindre byggnader"
                        unit="%"
                        value={project.small_share}
                        onChange={(v) => patch({ small_share: v as number })}
                      />
                      <div className="field">
                        Andel större byggnader
                        <strong>{fmt(100 - project.small_share, 2)} %</strong>
                      </div>
                    </div>
                    <p className="muted">
                      Startåret är år 0. Årliga effekter räknas till och med
                      slutåret. Ett sparat slumpfrö gör resultaten
                      reproducerbara.
                    </p>
                  </section>
                  <section className="card">
                    <h2>Exempelvärden från grundfilen</h2>
                    <p>
                      Historiska Göteborgsexempel kan kopieras till tomma fält.
                      De är inte aktuella rekommendationer och måste bedömas för
                      ditt område. Dina redan ifyllda värden ersätts inte.
                    </p>
                    <button
                      onClick={() => {
                        const baseline = structuredClone(project.baseline);
                        for (const [key, values] of Object.entries(
                          catalog.examples,
                        ) as [
                          string,
                          [number | null, number, number | null],
                        ][]) {
                          if (
                            baseline[key].mode === null &&
                            baseline[key].low === null &&
                            baseline[key].high === null
                          ) {
                            baseline[key] = {
                              low: values[0],
                              mode: values[1],
                              high: values[2],
                              source:
                                "Göteborgsexempel i TSV KNA.xlsb, aktualitet ej verifierad",
                              note: "Kontrollera lämplighet för det egna området.",
                            };
                          }
                        }
                        patch({ baseline });
                      }}
                    >
                      Kopiera exempel till tomma fält
                    </button>
                  </section>
                  <Parameters
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
                      </button>
                    ))}
                  </div>
                  <section className="card">
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
                    <label className="field">
                      Namn på åtgärden
                      <input
                        value={alt.name}
                        onChange={(e) =>
                          updateAlt(altIndex, { name: e.target.value })
                        }
                      />
                    </label>
                    <div className="grid">
                      <NumberField
                        label="Byggstart"
                        value={alt.start}
                        onChange={(v) =>
                          updateAlt(altIndex, { start: v as number })
                        }
                      />
                      <NumberField
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
                    <div className="grid">
                      {[
                        "Grundvattenpåverkan",
                        "Trög regnpåverkan",
                        "Snabb regnpåverkan",
                      ].map((label, i) => (
                        <NumberField
                          key={i}
                          label={label}
                          unit="%"
                          value={alt.shares[i]}
                          onChange={(v) =>
                            updateAlt(altIndex, {
                              shares: alt.shares.map((s, j) =>
                                i === j ? (v as number) : s,
                              ),
                            })
                          }
                        />
                      ))}
                    </div>
                    <p>
                      Summa:{" "}
                      {fmt(
                        alt.shares.reduce((a, b) => a + b, 0),
                        2,
                      )}{" "}
                      % (ska vara 100 %).
                    </p>
                  </section>
                  <Parameters
                    key={alt.id}
                    fields={catalog?.alternative || []}
                    values={alt.params}
                    onChange={(k, p) =>
                      updateAlt(altIndex, { params: { ...alt.params, [k]: p } })
                    }
                  />
                </>
              )}
              {tab === "helpers" && (
                <Helpers
                  project={project}
                  onApply={apply}
                  notify={setMessage}
                />
              )}{" "}
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
                    stale={dirty || (!!run && run.revision !== saved?.revision)}
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
          </>
        )}
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
