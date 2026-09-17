"""Generate a single input manifest for the program and spreadsheet runners."""

import sys, json, copy
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.catalog import example_project, BASE, ALT
from backend.engine import calculate
from backend.helpers import calculate_helper


def project():
    p = example_project()
    for v in p["baseline"].values():
        v["mode"] = 0
    for a in p["alternatives"]:
        for v in a["params"].values():
            v["mode"] = 0
    p["baseline"]["volume"]["mode"] = 1000
    return p


def cells(p):
    n = {
        "C5": p["analysis"]["start"],
        "C6": p["analysis"]["end"],
        "C7": p["analysis"]["rate"] / 100,
        "C8": p["analysis"]["carbon"],
        "D30": p["small_share"] / 100,
        "D31": 1 - p["small_share"] / 100,
    }
    for key, _, _, _, row in BASE:
        value = p["baseline"][key]
        n.update(
            {
                f"C{row}": value["low"],
                f"D{row}": value["mode"],
                f"E{row}": value["high"],
            }
        )
    a = {}
    for i, alt in enumerate(p["alternatives"]):
        lo, mode, hi = [chr(67 + 3 * i + j) for j in range(3)]
        a.update(
            {
                mode + "6": "ja" if alt["active"] else "nej",
                lo + "7": alt["name"],
                mode + "10": alt["start"],
                mode + "11": alt["end"],
            }
        )
        for key, _, _, _, row in ALT:
            val = alt["params"][key]
            a.update(
                {
                    lo + str(row): val["low"],
                    mode + str(row): val["mode"],
                    hi + str(row): val["high"],
                }
            )
        for j, share in enumerate(alt["shares"]):
            a[mode + str(23 + j)] = share / 100
    h = {
        "D4": 0.5,
        "D6": 2032,
        "E8": 0.7,
        "F8": 0.3,
        "E9": 50,
        "F9": 25,
        "E10": 0.3,
        "F10": 0.5,
        "E63": 0,
        "E66": 100,
        "E67": 5,
        "E68": 0,
        "E69": 0,
        "E48": 0,
        "E49": 0,
    }
    for row in [43, 44, 45, 59, 60, 61]:
        h.update({f"D{row}": 0, f"E{row}": 0})
    for row in [48, 49, 66, 67, 68, 69]:
        h.update({f"D{row}": None, f"F{row}": None})
    for row in range(28, 34):
        h[f"D{row}"] = 0
    return {"Nuläge": n, "Åtgärder": a, "Beräkningshjälp": h}


def generate():
    result = []
    cases = [
        ("T01", {}, {}),
        ("T02", {"treatment": 2}, {"volume_reduction": 100}),
        ("T03", {"energy": 0.1, "electricity": 2}, {"volume_reduction": 100}),
        ("T04", {"treatment_co2": 0.2}, {"volume_reduction": 100}),
        ("T05", {"floods": 2, "damage_small": 10000}, {"flood_reduction": 1}),
        (
            "T06",
            {"overflow": 100, "overflow_internal": 3, "overflow_external": 5},
            {"overflow_reduction": 10},
        ),
        ("T07", {}, {"investment": 1000}),
        ("T08-cost", {}, {"other_cost": 100}),
        ("T08-benefit", {}, {"other_benefit": 100}),
        ("T09", {}, {}),
        ("T10-zero", {"treatment": 2}, {"volume_reduction": 100}),
        ("T10-one", {"treatment": 2}, {"volume_reduction": 100}),
        ("T10-hundred", {"treatment": 2}, {"volume_reduction": 100}),
    ]
    for id, b, a in cases:
        p = project()
        p["name"] = id
        for k, v in b.items():
            p["baseline"][k]["mode"] = v
        for k, v in a.items():
            p["alternatives"][0]["params"][k]["mode"] = v
        if id == "T09":
            for i, alt in enumerate(p["alternatives"]):
                alt["active"] = True
                alt["params"]["construction_co2"]["mode"] = 100 * (i + 1)
        if id.startswith("T10"):
            p["analysis"]["rate"] = 0
            if id != "T10-zero":
                p["analysis"]["end"] = 2031 if id.endswith("one") else 2130
                p["alternatives"][0].update(start=2030, end=2030)
        result.append(
            {"id": id, "project": p, "cells": cells(p), "program": calculate(p)}
        )
    helper_cases = [
        (
            "T11",
            "climate",
            dict(
                trenchless_length=10,
                trenchless_factor=2,
                trench_length=5,
                trench_factor=4,
            ),
            {"D43": 10, "E43": 5, "E48": 2, "E49": 4},
        ),
        (
            "T12",
            "traffic",
            dict(
                trenchless_length=100,
                trenchless_speed=100,
                trench_length=0,
                trench_speed=5,
                delay=36,
                vehicles=1000,
                time_cost=100,
            ),
            {
                "D59": 100,
                "E59": 0,
                "E66": 100,
                "E67": 5,
                "E68": 36,
                "E69": 1000,
                "E63": 100,
            },
        ),
        (
            "T13",
            "flood",
            dict(times=[1, 2, 5, 10, 20, 100], counts=[0, 0, 0, 0, 0, 10]),
            {"D33": 10},
        ),
    ]
    for share in [30, 40, 50, 60, 70]:
        helper_cases.append(
            (
                f"T14-{share}",
                "arv",
                dict(
                    share=share,
                    next_year=2032,
                    building_share=70,
                    building_life=50,
                    installation_life=25,
                    building_reinvestment=30,
                    installation_reinvestment=50,
                ),
                {"D4": share / 100},
            )
        )
    for id, kind, values, changes in helper_cases:
        p = project()
        p["name"] = id
        mapping = cells(p)
        mapping["Beräkningshjälp"].update(changes)
        result.append(
            {
                "id": id,
                "project": p,
                "cells": mapping,
                "helper": kind,
                "helper_values": values,
                "program": calculate_helper(kind, values, p["analysis"]),
            }
        )
    return result


if __name__ == "__main__":
    dest = (
        Path(sys.argv[1])
        if len(sys.argv) > 1
        else Path(__file__).resolve().parents[1]
        / "tests"
        / "fixtures"
        / "typical_cases.json"
    )
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(
        json.dumps(generate(), ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Wrote {dest}")
