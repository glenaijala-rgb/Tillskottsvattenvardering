"""Stable parameter keys, Swedish labels and units, traced to the source workbook."""

BASE = [
    ("volume", "Volym tillskottsvatten", "m³/år", "Volymer", 14),
    ("treatment", "Rening – kommunens utgift", "kr/m³", "Rening", 17),
    ("treatment_co2", "Klimatpåverkan rening", "kg CO₂e/m³", "Rening", 18),
    (
        "arv_ground",
        "Investering reningsverk – grundvattenpåverkan",
        "kr/m³",
        "Rening",
        19,
    ),
    ("arv_slow", "Investering reningsverk – trög regnpåverkan", "kr/m³", "Rening", 20),
    ("arv_fast", "Investering reningsverk – snabb regnpåverkan", "kr/m³", "Rening", 21),
    ("energy", "Energi för pumpning", "kWh/m³", "Pumpning", 24),
    ("electricity", "Elpris inklusive nätavgift och skatt", "kr/kWh", "Pumpning", 25),
    ("electricity_co2", "Klimatpåverkan elanvändning", "kg CO₂e/kWh", "Pumpning", 26),
    ("floods", "Antal källaröversvämningar", "st/år", "Källaröversvämningar", 29),
    (
        "damage_small",
        "Fysiska skador – mindre byggnader",
        "kr/st",
        "Källaröversvämningar",
        32,
    ),
    (
        "damage_large",
        "Fysiska skador – större byggnader",
        "kr/st",
        "Källaröversvämningar",
        33,
    ),
    (
        "social_small",
        "Övriga konsekvenser – mindre byggnader",
        "kr/st",
        "Källaröversvämningar",
        34,
    ),
    (
        "social_large",
        "Övriga konsekvenser – större byggnader",
        "kr/st",
        "Källaröversvämningar",
        35,
    ),
    ("overflow", "Bräddad avloppsvolym", "m³/år", "Bräddning", 38),
    ("overflow_internal", "Intern kostnad bräddning", "kr/m³", "Bräddning", 39),
    ("overflow_external", "Extern kostnad bräddning", "kr/m³", "Bräddning", 40),
    ("other", "Övriga kostnader i nuläget", "kr/år", "Övrigt", 43),
]
ALT = [
    ("investment", "Total investeringsutgift", "kr", "Byggnation", 12),
    (
        "construction_co2",
        "Total klimatpåverkan anläggning",
        "kg CO₂e",
        "Byggnation",
        13,
    ),
    ("traffic", "Total trafikkostnad under byggnation", "kr", "Byggnation", 16),
    ("renewal", "Nytta av minskat förnyelsebehov", "kr/år", "Efter åtgärd", 17),
    ("other_cost", "Övriga kostnader efter åtgärd", "kr/år", "Efter åtgärd", 18),
    ("other_benefit", "Övriga nyttor efter åtgärd", "kr/år", "Efter åtgärd", 19),
    ("volume_reduction", "Minskning tillskottsvatten", "m³/år", "Effekter", 22),
    ("flood_reduction", "Minskning källaröversvämningar", "st/år", "Effekter", 26),
    ("overflow_reduction", "Minskning bräddning", "m³/år", "Effekter", 27),
]
CATEGORIES = {
    "treatment": "Rening, internt",
    "treatment_co2": "Rening, klimat",
    "pumping": "Pumpning, internt",
    "pumping_co2": "Pumpning, klimat",
    "flood_damage": "Översvämning, fysiska skador",
    "flood_social": "Översvämning, övriga konsekvenser",
    "overflow_internal": "Bräddning, internt",
    "overflow_external": "Bräddning, externt",
    "other": "Övriga löpande kostnader",
    "arv": "Minskad investering reningsverk",
    "renewal": "Minskat förnyelsebehov",
    "other_benefit": "Övriga nyttor",
    "investment": "Investering",
    "construction_co2": "Klimatkostnad byggnation",
    "traffic": "Trafikpåverkan byggnation",
}
EXAMPLES = {
    "treatment": [0.63, 0.95, 4.7],
    "treatment_co2": [0.03, 0.12, 0.22],
    "energy": [0.1, 0.13, 0.16],
    "electricity": [0.56, 1.25, 4],
    "electricity_co2": [None, 0.35, None],
    "damage_small": [65000, 70000, 80000],
    "damage_large": [450000, 530000, 640000],
    "social_small": [4000, 11000, 15000],
    "social_large": [31000, 83000, 121000],
    "overflow_internal": [2, 5, 650],
    "overflow_external": [3, 15, 87],
}


def parameter(value=None):
    return dict(low=None, mode=value, high=None, source="", note="")


def blank_project():
    return {
        "name": "Nytt värderingsprojekt",
        "area": "",
        "notes": "",
        "analysis": {
            "start": 2030,
            "end": 2040,
            "rate": 3.0,
            "carbon": None,
            "seed": 20260917,
            "iterations": 1000,
        },
        "small_share": 100.0,
        "baseline": {x[0]: parameter() for x in BASE},
        "alternatives": [
            {
                "id": str(i),
                "name": f"Åtgärd {i}",
                "active": i == 1,
                "start": 2031,
                "end": 2032,
                "shares": [100.0, 0.0, 0.0],
                "params": {x[0]: parameter() for x in ALT},
            }
            for i in range(1, 4)
        ],
        "helpers": [],
    }


def example_project():
    p = blank_project()
    p["name"] = "Typfall – endast rening"
    p["notes"] = "Syntetiskt testfall T02. Inga verkliga projektdata."
    p["analysis"]["carbon"] = 4
    for group in [p["baseline"]] + [a["params"] for a in p["alternatives"]]:
        for item in group.values():
            item.update(mode=0, source="Syntetiskt typfall T02")
    p["baseline"]["volume"]["mode"] = 1000
    p["baseline"]["treatment"]["mode"] = 2
    p["alternatives"][0]["params"]["volume_reduction"]["mode"] = 100
    return p
