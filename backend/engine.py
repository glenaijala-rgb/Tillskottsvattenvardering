"""Versioned, deterministic cost-benefit engine. No UI or database dependencies."""

import hashlib
import json
import math
import numpy as np
from .catalog import BASE, ALT, CATEGORIES

VERSION = "1.0.0"


class InputError(ValueError):
    def __init__(self, errors, fields=None):
        self.errors = list(errors)
        self.fields = fields if fields is not None else getattr(errors, "fields", [])
        super().__init__("; ".join(errors))


class ValidationErrors(list):
    """Keep readable errors and stable field paths together (independent of names)."""
    def __init__(self):
        super().__init__()
        self.paths = []
        self.fields = []

    def append(self, message):
        super().append(message)
        for path in self.paths:
            self.fields.append({"path": path, "message": message})

    def extend(self, messages):
        for message in messages:
            self.append(message)


def finite(v):
    return isinstance(v, (float, int)) and not isinstance(v, bool) and math.isfinite(v)


def bounds(p):
    return (p["mode"], p["mode"]) if p.get("low") is None else (p["low"], p["high"])


def validate(p):
    errors = ValidationErrors()
    errors.paths = ["name"]
    if not isinstance(p, dict):
        raise InputError(["Projektet måste vara ett objekt."])
    if not isinstance(p.get("name"), str) or not p["name"].strip():
        errors.append("Projektnamn saknas.")
    a = p.get("analysis", {})
    for k, label in [
        ("start", "Startår"),
        ("end", "Slutår"),
        ("seed", "Slumpfrö"),
        ("iterations", "Antal simuleringar"),
    ]:
        errors.paths = ["analysis." + k]
        if type(a.get(k)) is not int:
            errors.append(f"{label}: ange ett heltal.")
    errors.paths = ["analysis.start", "analysis.end"]
    if all(type(a.get(k)) is int for k in ("start", "end")):
        if not (
            1900 <= a["start"] < a["end"] <= 2300 and 1 <= a["end"] - a["start"] <= 100
        ):
            errors.append("Analysen måste omfatta 1–100 år, inom 1900–2300.")
    errors.paths = ["analysis.seed"]
    if type(a.get("seed")) is int and not 0 <= a["seed"] < 2**32:
        errors.append("Slumpfrö måste vara 0–4294967295.")
    errors.paths = ["analysis.iterations"]
    if a.get("iterations") not in (1000, 10000):
        errors.append("Välj 1 000 eller 10 000 simuleringar.")
    for k, label in [("rate", "Diskonteringsränta"), ("carbon", "Koldioxidvärdering")]:
        errors.paths = ["analysis." + k]
        if not finite(a.get(k)) or a[k] < 0 or a[k] > 1e9:
            errors.append(f"{label}: ange ett giltigt icke-negativt värde.")
    errors.paths = ["analysis.rate"]
    if finite(a.get("rate")) and a["rate"] > 100:
        errors.append("Diskonteringsränta får vara högst 100 %.")
    errors.paths = ["small_share"]
    if not finite(p.get("small_share")) or not 0 <= p["small_share"] <= 100:
        errors.append("Andel mindre byggnader måste vara 0–100 %.")

    def group(values, catalog, prefix, path):
        errors.paths = [path]
        if not isinstance(values, dict):
            errors.append(prefix + ": indata saknas.")
            return
        for key, label, *_ in catalog:
            errors.paths = [path + "." + key]
            item = values.get(key, {})
            if not isinstance(item, dict):
                errors.append(f"{prefix} / {label}: ogiltigt fält.")
                continue
            lo, mode, hi = item.get("low"), item.get("mode"), item.get("high")
            if not finite(mode) or mode < 0 or mode > 1e15:
                errors.append(f"{prefix} / {label}: ange ett värde, även om det är 0.")
                continue
            if (lo is None) != (hi is None):
                errors.append(
                    f"{prefix} / {label}: ange både min och max, eller lämna båda tomma."
                )
            elif lo is not None and (
                not finite(lo) or not finite(hi) or not 0 <= lo <= mode <= hi <= 1e15
            ):
                errors.append(f"{prefix} / {label}: kräver 0 ≤ min ≤ troligt ≤ max.")
            if item.get("derived"):
                from .helpers import derived_parameter

                recipe = item["derived"]
                if (
                    not isinstance(recipe, dict)
                    or recipe.get("kind") not in ("climate", "traffic")
                    or (key, recipe.get("kind"))
                    not in (("construction_co2", "climate"), ("traffic", "traffic"))
                ):
                    errors.append(
                        f"{prefix} / {label}: fel koppling till beräkningshjälp."
                    )
                else:
                    try:
                        expected = derived_parameter(
                            recipe["kind"], recipe.get("values", {})
                        )
                        if any(
                            item.get(k) != expected[k] for k in ("low", "mode", "high")
                        ):
                            errors.append(
                                f"{prefix} / {label}: stödvärdets underlag stämmer inte."
                            )
                    except InputError as e:
                        errors.extend(e.errors)

    group(p.get("baseline"), BASE, "Nuläge", "baseline")
    errors.paths = ["alternatives"]
    alts = p.get("alternatives", [])
    if not isinstance(alts, list) or not 1 <= len(alts) <= 3:
        raise InputError(errors + ["Projektet ska ha 1–3 alternativ."])
    if not all(isinstance(x, dict) for x in alts):
        raise InputError(errors + ["Ogiltigt alternativ."])
    if not all(isinstance(x.get("id"), str) and x["id"] for x in alts):
        errors.append("Alternativen måste ha giltiga ID.")
    if len({str(x.get("id")) for x in alts}) != len(alts):
        errors.append("Alternativen måste ha olika ID.")
    active = [x for x in alts if x.get("active") is True]
    if not active:
        errors.append("Aktivera minst en åtgärd.")
    for alt in active:
        path = "alternatives." + str(alts.index(alt))
        errors.paths = [path + ".name"]
        name = alt.get("name") or "Namnlös åtgärd"
        if not alt.get("name"):
            errors.append("Namn på aktiv åtgärd saknas.")
        group(alt.get("params"), ALT, name, path + ".params")
        errors.paths = [path + ".start", path + ".end"]
        if any(type(alt.get(k)) is not int for k in ("start", "end")):
            errors.append(f"{name}: genomförandeår måste vara heltal.")
        elif (
            all(type(a.get(k)) is int for k in ("start", "end"))
            and not a["start"] <= alt["start"] <= alt["end"] <= a["end"]
        ):
            errors.append(f"{name}: byggåren måste ligga inom analysen.")
        errors.paths = [path + ".shares"]
        shares = alt.get("shares", [])
        if (
            not isinstance(shares, list)
            or len(shares) != 3
            or not all(finite(v) and 0 <= v <= 100 for v in shares)
            or abs(sum(shares) - 100) > 1e-8
        ):
            errors.append(f"{name}: flödesandelarna ska summera till 100 %.")
    if not errors:
        for alt in active:
            for key, reduction in [
                ("volume", "volume_reduction"),
                ("floods", "flood_reduction"),
                ("overflow", "overflow_reduction"),
            ]:
                # Safe over the complete support for independent distributions. No clipping.
                errors.paths = ["alternatives." + str(alts.index(alt)) + ".params." + reduction, "baseline." + key]
                if bounds(alt["params"][reduction])[1] > bounds(p["baseline"][key])[0]:
                    errors.append(
                        f"{alt['name']}: maximal minskning för {dict((x[0],x[1]) for x in BASE)[key]} överstiger nulägets minsta värde. Justera intervallen."
                    )
    if errors:
        raise InputError(errors)


def sample(item, rng, n):
    if item.get("derived"):
        from .helpers import sample_derived

        return sample_derived(item["derived"], rng, n)
    lo, hi = bounds(item)
    m = item["mode"]
    if lo == hi:
        return np.full(n, m, dtype=float)
    return lo + (hi - lo) * rng.beta(
        1 + 4 * (m - lo) / (hi - lo), 1 + 4 * (hi - m) / (hi - lo), n
    )


def summary(values):
    v = np.asarray(values, dtype=float)
    return dict(
        zip(
            ("p05", "p25", "p50", "p75", "p95"),
            [
                float(x)
                for x in np.quantile(v, [0.05, 0.25, 0.5, 0.75, 0.95], method="weibull")
            ],
        )
    )


def annuity_factor(rate, years):
    return 1 / years if rate == 0 else rate / (-math.expm1(-years * math.log1p(rate)))


def operating(b, volume, floods, overflow, small, carbon, other):
    return {
        "treatment": volume * b["treatment"],
        "treatment_co2": volume * b["treatment_co2"] * carbon,
        "pumping": volume * b["energy"] * b["electricity"],
        "pumping_co2": volume * b["energy"] * b["electricity_co2"] * carbon,
        "flood_damage": floods
        * (small * b["damage_small"] + (1 - small) * b["damage_large"]),
        "flood_social": floods
        * (small * b["social_small"] + (1 - small) * b["social_large"]),
        "overflow_internal": overflow * b["overflow_internal"],
        "overflow_external": overflow * b["overflow_external"],
        "other": other,
    }


def calculate(p):
    validate(p)
    settings = p["analysis"]
    n = settings["iterations"]
    r = settings["rate"] / 100
    years = settings["end"] - settings["start"]
    carbon = settings["carbon"]
    small = p["small_share"] / 100

    # Independent, stable substreams: toggling another alternative does not alter this alternative.
    def draw(group, stream):
        return {
            key: sample(
                value,
                np.random.default_rng(
                    np.random.SeedSequence([settings["seed"], stream, i])
                ),
                n,
            )
            for i, (key, value) in enumerate(sorted(group.items()))
        }

    b = draw(p["baseline"], 0)
    before = operating(
        b, b["volume"], b["floods"], b["overflow"], small, carbon, b["other"]
    )
    output = {
        "version": VERSION,
        "generator": "NumPy PCG64 / SeedSequence",
        "numpy_version": np.__version__,
        "seed": settings["seed"],
        "iterations": n,
        "percentile_method": "weibull / Excel PERCENTILE.EXC",
        "input_hash": hashlib.sha256(
            json.dumps(p, sort_keys=True, ensure_ascii=False, allow_nan=False).encode()
        ).hexdigest(),
        "baseline": {k: summary(v) for k, v in before.items()},
        "alternatives": [],
        "method_note": "Byggår inkluderar start och slut. Årlig nytta börjar året efter byggslut, till och med analysens slutår. Resultat jämförs med nuläget. Oberoende PERT-parametrar, gemensamt nuläge. ARV-hjälpens överförda värden är fasta P50.",
        "validation_note": "Excel-jämförelsen är ännu inte slutligt godkänd. Se verifieringsrapporten.",
    }
    for index, alt in enumerate(p["alternatives"]):
        if not alt["active"]:
            continue
        # ID is persistent even when alternatives are reordered.
        stream = (
            int.from_bytes(hashlib.sha256(alt["id"].encode()).digest()[:4], "little")
            or 1
        )
        v = draw(alt["params"], stream)
        after = operating(
            b,
            b["volume"] - v["volume_reduction"],
            b["floods"] - v["flood_reduction"],
            b["overflow"] - v["overflow_reduction"],
            small,
            carbon,
            v["other_cost"],
        )
        savings = {k: before[k] - after[k] for k in before}
        benefits = {k: np.maximum(value, 0) for k, value in savings.items()}
        costs = {k: np.maximum(-value, 0) for k, value in savings.items()}
        benefits.update(
            arv=v["volume_reduction"]
            * sum(
                alt["shares"][j] / 100 * b[key]
                for j, key in enumerate(("arv_ground", "arv_slow", "arv_fast"))
            ),
            renewal=v["renewal"],
            other_benefit=v["other_benefit"],
        )
        construction = {
            "investment": v["investment"],
            "construction_co2": v["construction_co2"] * carbon,
            "traffic": v["traffic"],
        }
        annual_b = sum(benefits.values())
        annual_c = sum(costs.values())
        build = sum(construction.values())
        pv_b = np.zeros(n)
        pv_c = np.zeros(n)
        annual = []
        operating_factor = 0.0
        building_factor = 0.0
        duration = alt["end"] - alt["start"] + 1
        for year in range(settings["start"], settings["end"] + 1):
            factor = (1 + r) ** (-(year - settings["start"]))
            active = year > alt["end"]
            building = alt["start"] <= year <= alt["end"]
            this_b = annual_b if active else np.zeros(n)
            this_c = (annual_c if active else np.zeros(n)) + (
                build / duration if building else 0
            )
            pv_b += this_b * factor
            pv_c += this_c * factor
            operating_factor += factor * active
            building_factor += factor * building / duration
            annual.append(
                {
                    "year": year,
                    "benefit": summary(this_b),
                    "cost": summary(this_c),
                    "net": summary(this_b - this_c),
                    "discounted_net": summary((this_b - this_c) * factor),
                }
            )
        net = pv_b - pv_c
        output["alternatives"].append(
            {
                "id": alt["id"],
                "name": alt["name"],
                "npv": summary(net),
                "annuity": summary(net * annuity_factor(r, years)),
                "benefits": summary(pv_b),
                "costs": summary(pv_c),
                "probability_positive": float(np.mean(net > 0)),
                "after": {k: summary(x) for k, x in after.items()},
                "annual_benefits": {k: summary(x) for k, x in benefits.items()},
                "annual_costs": {k: summary(x) for k, x in costs.items()},
                "construction": {k: summary(x) for k, x in construction.items()},
                "pv_benefit_categories": {
                    k: summary(x * operating_factor) for k, x in benefits.items()
                },
                "pv_cost_categories": {
                    **{k: summary(x * operating_factor) for k, x in costs.items()},
                    **{
                        k: summary(x * building_factor) for k, x in construction.items()
                    },
                },
                "annual": annual,
            }
        )
    return output
