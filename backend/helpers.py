import json
from pathlib import Path
import numpy as np
from scipy.stats import gamma
from .engine import InputError, finite, summary, annuity_factor, sample

REFERENCE = json.loads(
    Path(__file__).with_name("arv_reference.json").read_text(encoding="utf-8")
)

HELPER_KEYS = {
    "climate": [
        "trenchless_length",
        "trenchless_factor",
        "trench_length",
        "trench_factor",
    ],
    "traffic": [
        "trenchless_length",
        "trenchless_speed",
        "trench_length",
        "trench_speed",
        "delay",
        "vehicles",
        "time_cost",
    ],
}


def helper_parameters(kind, values):
    params = {}
    for key in HELPER_KEYS[kind]:
        raw = values.get(key)
        item = (
            raw if isinstance(raw, dict) else {"mode": raw, "low": None, "high": None}
        )
        m, lo, hi = item.get("mode"), item.get("low"), item.get("high")
        if lo is None and hi is None:
            lo = hi = m
        if not all(finite(x) for x in (lo, m, hi)) or not 0 <= lo <= m <= hi <= 1e15:
            raise InputError(
                [f"{key}: kräver 0 ≤ min ≤ troligt ≤ max, eller ett fast värde."]
            )
        if "speed" in key and lo <= 0:
            raise InputError(
                [f"{key}: hastigheten måste vara större än noll i hela intervallet."]
            )
        params[key] = {"low": lo, "mode": m, "high": hi}
    return params


def helper_formula(kind, v):
    if kind == "climate":
        return (
            v["trenchless_length"] * v["trenchless_factor"]
            + v["trench_length"] * v["trench_factor"]
        )
    return (
        (
            v["trenchless_length"] / v["trenchless_speed"]
            + v["trench_length"] / v["trench_speed"]
        )
        * v["delay"]
        * v["vehicles"]
        * v["time_cost"]
        / 3600
    )


def sample_derived(recipe, rng, n):
    kind = recipe.get("kind")
    values = recipe.get("values", {})
    if kind not in HELPER_KEYS:
        raise InputError(["Ogiltig kopplad stödberäkning."])
    params = helper_parameters(kind, values)
    return helper_formula(kind, {k: sample(p, rng, n) for k, p in params.items()})


def derived_parameter(kind, v):
    params = helper_parameters(kind, v)
    lo = {k: p["high"] if "speed" in k else p["low"] for k, p in params.items()}
    hi = {k: p["low"] if "speed" in k else p["high"] for k, p in params.items()}
    mode = {k: p["mode"] for k, p in params.items()}
    return {
        "low": helper_formula(kind, lo),
        "mode": helper_formula(kind, mode),
        "high": helper_formula(kind, hi),
        "derived": {"kind": kind, "values": params},
    }


def calculate_helper(kind, v, settings):
    if not isinstance(v, dict) or not isinstance(settings, dict):
        raise InputError(["Ogiltiga indata till beräkningshjälpen."])
    if kind in HELPER_KEYS and any(isinstance(x, dict) for x in v.values()):
        parameter = derived_parameter(kind, v)
        draws = sample_derived(
            parameter["derived"],
            np.random.default_rng(settings.get("seed", 20260917)),
            1000,
        )
        key = "construction_co2" if kind == "climate" else "traffic"
        result = {
            "distribution": summary(draws),
            "unit": "kg CO₂e" if kind == "climate" else "kr",
            "apply": {key: parameter},
            "note": "De underliggande PERT-fördelningarna sparas och samplas direkt i huvudberäkningen. Resultatet görs inte om till en ny PERT-fördelning. Ändring av det överförda värdets min/trolig/max bryter kopplingen.",
        }
        if kind == "climate":
            carbon = settings.get("carbon")
            if not finite(carbon) or carbon < 0:
                raise InputError(["Ange koldioxidvärdering i nuläget först."])
            result.update(emissions=parameter["mode"], cost=parameter["mode"] * carbon)
        else:
            result["cost"] = parameter["mode"]
        return result

    def number(key, minimum=0, maximum=1e15):
        value = v.get(key)
        if not finite(value) or not minimum <= value <= maximum:
            raise InputError([f"{key}: ange ett värde mellan {minimum} och {maximum}."])
        return value

    if kind == "climate":
        kg = number("trenchless_length") * number("trenchless_factor") + number(
            "trench_length"
        ) * number("trench_factor")
        carbon = settings.get("carbon")
        if not finite(carbon) or carbon < 0:
            raise InputError(["Ange koldioxidvärdering i nuläget först."])
        return {
            "emissions": kg,
            "cost": kg * carbon,
            "unit": "kg CO₂e",
            "apply": {"construction_co2": kg},
            "note": "Utsläpp förs över i kg. Omräkning till kronor sker i beräkningsmotorn.",
        }
    if kind == "traffic":
        days = number("trenchless_length") / number("trenchless_speed", 1e-9) + number(
            "trench_length"
        ) / number("trench_speed", 1e-9)
        cost = days * number("delay") * number("vehicles") * number("time_cost") / 3600
        return {
            "days": days,
            "cost": cost,
            "unit": "kr",
            "apply": {"traffic": cost},
            "note": "Fast beräkning. Osäkerhetsintervall kan anges efter överföring.",
        }
    if kind == "flood":
        times = v.get("times")
        counts = v.get("counts")
        if (
            not isinstance(times, list)
            or not isinstance(counts, list)
            or len(times) != len(counts)
            or len(times) < 2
            or len(times) > 100
        ):
            raise InputError(
                ["Återkomsttider och skadeantal måste ha samma antal punkter (2–100)."]
            )
        if (
            not all(finite(t) and t > 0 for t in times)
            or not all(finite(c) and c >= 0 for c in counts)
            or any(b <= a for a, b in zip(times, times[1:]))
            or any(b < a for a, b in zip(counts, counts[1:]))
        ):
            raise InputError(
                ["Återkomsttider ska stiga och skadeantal får inte minska."]
            )
        expected = counts[0] / times[0] + sum(
            (counts[i] - counts[i - 1]) * (1 / times[i] + 1 / times[i - 1]) / 2
            for i in range(1, len(times))
        )
        return {
            "expected": expected,
            "unit": "st/år",
            "apply": {"floods": expected},
            "note": "Styckvis integration som i grundfilen. Skadeantal antas konstant bortom längsta återkomsttiden.",
        }
    if kind == "arv":
        share = number("share", 0, 100) / 100
        next_year = number("next_year", 1900, 2300)
        building = number("building_share", 0, 100) / 100
        life_b = number("building_life", 1, 200)
        life_i = number("installation_life", 1, 200)
        rein_b = number("building_reinvestment", 0, 100) / 100
        rein_i = number("installation_reinvestment", 0, 100) / 100
        start, end, rate = (
            settings.get("start"),
            settings.get("end"),
            settings.get("rate"),
        )
        if (
            any(type(x) is not int for x in (start, end))
            or not 1 <= end - start <= 100
            or not finite(rate)
            or not 0 <= rate <= 100
        ):
            raise InputError(["Ange giltig tidshorisont och ränta i nuläget."])
        if not start <= next_year <= end or any(
            int(x) != x for x in (next_year, life_b, life_i)
        ):
            raise InputError(
                [
                    "Investeringsåret måste ligga inom analysen. År och livslängder ska vara heltal."
                ]
            )
        pv = 0
        for year in range(start, end + 1):
            age = year - next_year
            amount = (
                1
                if age == 0
                else (
                    (building * rein_b if age > 0 and age % life_b == 0 else 0)
                    + ((1 - building) * rein_i if age > 0 and age % life_i == 0 else 0)
                )
            )
            pv += amount / (1 + rate / 100) ** (year - start)
        annual_factor = pv * annuity_factor(rate / 100, end - start)
        # Source Inv ARV B/C/D represents 50/30/70 percent. Gamma parameters from MC.
        scenarios = {}
        for col, shape, scale, offset in [
            ("C", 5.06, 1 / 0.012, 275),
            ("B", 5.11, 1 / 0.0112, 300),
            ("D", 4.93, 1 / 0.00997, 320),
        ]:
            ref = REFERENCE[col]
            density = np.array(ref["investmentShares"]) / ref["horizontalVolumes"] * 1e6
            coeff = np.array([np.dot(c, density) / sum(c) for c in ref["components"]])
            scenarios[col] = (
                np.outer(
                    gamma.ppf([0.05, 0.5, 0.95], shape, scale=scale) + offset, coeff
                )
                * annual_factor
            )
        if share <= 0.3:
            values = scenarios["C"]
        elif share >= 0.7:
            values = scenarios["D"]
        elif share <= 0.5:
            values = scenarios["C"] + (share - 0.3) / 0.2 * (
                scenarios["B"] - scenarios["C"]
            )
        else:
            values = scenarios["B"] + (share - 0.5) / 0.2 * (
                scenarios["D"] - scenarios["B"]
            )
        keys = ["sewage", "arv_ground", "arv_slow", "arv_fast"]
        metrics = {
            key: dict(zip(["p05", "p50", "p95"], map(float, values[:, i])))
            for i, key in enumerate(keys)
        }
        return {
            "metrics": metrics,
            "unit": "kr/m³",
            "annual_factor": annual_factor,
            "apply": {k: metrics[k]["p50"] for k in keys[1:]},
            "note": "ARV: rekonstruerad modell, ej slutverifierad mot Excel. Analytiska gamma-percentiler och interpolation vid 30/50/70 %. P50 överförs som fast marginalnytta; osäkerheten överförs inte. Under 30/över 70 % används ändpunkten. Avsedd för små marginalförändringar.",
        }
    raise InputError(["Okänd beräkningshjälp."])
