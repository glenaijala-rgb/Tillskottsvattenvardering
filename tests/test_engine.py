import copy, math
import numpy as np
import pytest
from backend.catalog import example_project
from backend.engine import calculate, InputError, annuity_factor, summary, sample
from backend.helpers import calculate_helper


def empty():
    p = example_project()
    for x in p["baseline"].values():
        x["mode"] = 0
    for a in p["alternatives"]:
        for x in a["params"].values():
            x["mode"] = 0
    p["baseline"]["volume"]["mode"] = 1000
    return p


def set_base(p, **values):
    for k, v in values.items():
        p["baseline"][k]["mode"] = v


def set_alt(p, index=0, **values):
    for k, v in values.items():
        p["alternatives"][index]["params"][k]["mode"] = v


def first(p):
    return calculate(p)["alternatives"][0]


@pytest.mark.parametrize(
    "baseline,alternative,category,before,after",
    [
        ({"treatment": 2}, {"volume_reduction": 100}, "treatment", 2000, 1800),
        (
            {"energy": 0.1, "electricity": 2},
            {"volume_reduction": 100},
            "pumping",
            200,
            180,
        ),
        ({"treatment_co2": 0.2}, {"volume_reduction": 100}, "treatment_co2", 800, 720),
        (
            {"energy": 0.1, "electricity_co2": 0.2},
            {"volume_reduction": 100},
            "pumping_co2",
            80,
            72,
        ),
        (
            {"floods": 2, "damage_small": 10000},
            {"flood_reduction": 1},
            "flood_damage",
            20000,
            10000,
        ),
        (
            {"floods": 2, "social_small": 100},
            {"flood_reduction": 1},
            "flood_social",
            200,
            100,
        ),
        (
            {"overflow": 100, "overflow_internal": 3},
            {"overflow_reduction": 10},
            "overflow_internal",
            300,
            270,
        ),
        (
            {"overflow": 100, "overflow_external": 5},
            {"overflow_reduction": 10},
            "overflow_external",
            500,
            450,
        ),
    ],
)
def test_isolated_typical_cases(baseline, alternative, category, before, after):
    p = empty()
    set_base(p, **baseline)
    set_alt(p, **alternative)
    result = calculate(p)
    a = result["alternatives"][0]
    assert result["baseline"][category]["p50"] == pytest.approx(before)
    assert a["after"][category]["p50"] == pytest.approx(after)
    # 2033..2040 inclusive: 8 annual payments, years t=3..10.
    expected = (before - after) * sum(1 / 1.03**t for t in range(3, 11))
    assert a["npv"]["p50"] == pytest.approx(expected)
    assert a["npv"]["p05"] == a["npv"]["p95"]


def test_zero_case():
    assert first(empty())["npv"]["p50"] == 0


def test_investment_inclusive_building_years():
    p = empty()
    set_alt(p, investment=1000)
    expected = -500 / 1.03 - 500 / 1.03**2
    assert first(p)["npv"]["p50"] == pytest.approx(expected)
    p["alternatives"][0]["end"] = 2031
    assert first(p)["npv"]["p50"] == pytest.approx(-1000 / 1.03)


def test_zero_rate_annuity_and_horizons():
    p = example_project()
    p["analysis"]["rate"] = 0
    a = first(p)
    assert a["npv"]["p50"] == 1600
    assert a["annuity"]["p50"] == 160
    for years in [1, 100]:
        p["analysis"]["end"] = 2030 + years
        p["alternatives"][0].update(start=2030, end=2030)
        a = first(p)
        assert a["npv"]["p50"] == years * 200
        assert a["annuity"]["p50"] == 200


def test_annuity_present_value():
    for r in [0, 0.00000001, 0.03, 1]:
        for n in [1, 10, 100]:
            assert annuity_factor(r, n) * sum(
                (1 + r) ** -t for t in range(1, n + 1)
            ) == pytest.approx(1)


def test_other_cost_not_benefit():
    p = empty()
    set_alt(p, other_cost=100)
    a = first(p)
    assert a["npv"]["p50"] < 0
    set_alt(p, other_cost=0, other_benefit=100)
    b = first(p)
    assert b["npv"]["p50"] == pytest.approx(-a["npv"]["p50"])
    set_base(p, other=100)
    set_alt(p, other_benefit=0)
    assert first(p)["npv"]["p50"] == pytest.approx(b["npv"]["p50"])


def test_alternatives_and_climate_units():
    p = empty()
    for i, a in enumerate(p["alternatives"]):
        a["active"] = True
        set_alt(p, i, construction_co2=100 * (i + 1))
    r = calculate(p)
    assert [
        a["construction"]["construction_co2"]["p50"] for a in r["alternatives"]
    ] == [400, 800, 1200]


def test_uncertainty_reproducible_and_stable_alternative_streams():
    p = example_project()
    p["baseline"]["treatment"].update(low=1, high=4)
    p["alternatives"][0]["params"]["investment"].update(low=0, mode=100, high=300)
    a = calculate(p)
    b = calculate(copy.deepcopy(p))
    assert a == b
    p["alternatives"][1]["active"] = True
    assert calculate(p)["alternatives"][0] == a["alternatives"][0]
    p["alternatives"].reverse()
    assert (
        next(x for x in calculate(p)["alternatives"] if x["id"] == "1")
        == a["alternatives"][0]
    )
    s = a["alternatives"][0]["npv"]
    assert s["p05"] < s["p50"] < s["p95"]


def test_percentile_exc():
    # n=99 gives exact order positions 5,25,50,75,95.
    assert summary(np.arange(1, 100)) == dict(
        p05=5.0, p25=25.0, p50=50.0, p75=75.0, p95=95.0
    )
    assert summary([1, 2, 3, 4])["p25"] == pytest.approx(1.25)


def test_pert_support_and_equal_values():
    x = sample({"low": 1, "mode": 2, "high": 4}, np.random.default_rng(42), 100000)
    assert x.min() >= 1 and x.max() <= 4
    assert x.mean() == pytest.approx((1 + 4 * 2 + 4) / 6, abs=0.02)
    assert np.all(
        sample({"low": 2, "mode": 2, "high": 2}, np.random.default_rng(42), 100) == 2
    )


@pytest.mark.parametrize(
    "change",
    [
        lambda p: p["baseline"]["treatment"].update(mode=None),
        lambda p: p["baseline"]["treatment"].update(low=4, high=1),
        lambda p: p["baseline"]["treatment"].update(low=1),
        lambda p: p["analysis"].update(rate=-1),
        lambda p: p["analysis"].update(end=2131),
        lambda p: p["alternatives"][0].update(shares=[30, 30, 30]),
        lambda p: p["alternatives"][0]["params"]["volume_reduction"].update(mode=1001),
        lambda p: p["baseline"]["volume"].update(low=50, high=1500),
        lambda p: p["analysis"].update(carbon=float("nan")),
    ],
)
def test_reject_invalid(change):
    p = example_project()
    change(p)
    with pytest.raises(InputError):
        calculate(p)


def test_inactive_missing_fields_do_not_block():
    p = example_project()
    p["alternatives"][1]["params"]["investment"]["mode"] = None
    assert first(p)["npv"]["p50"] > 0


def test_helpers_t11_t12_t13():
    settings = {"carbon": 4}
    r = calculate_helper(
        "climate",
        dict(
            trenchless_length=10, trenchless_factor=2, trench_length=5, trench_factor=4
        ),
        settings,
    )
    assert (
        r["emissions"] == 40
        and r["cost"] == 160
        and r["apply"]["construction_co2"] == 40
    )
    r = calculate_helper(
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
        settings,
    )
    assert r["cost"] == 1000
    r = calculate_helper(
        "flood",
        dict(times=[1, 2, 5, 10, 20, 100], counts=[0, 0, 0, 0, 0, 10]),
        settings,
    )
    assert r["expected"] == pytest.approx(0.3)


def test_arv_interpolation_zero_rate_reinvestment():
    settings = {"start": 2030, "end": 2130, "rate": 0}
    v = dict(
        share=30,
        next_year=2030,
        building_share=70,
        building_life=50,
        installation_life=25,
        building_reinvestment=30,
        installation_reinvestment=50,
    )
    results = {
        s: calculate_helper("arv", {**v, "share": s}, settings)
        for s in [30, 40, 50, 60, 70]
    }
    for k in ["arv_ground", "arv_slow", "arv_fast"]:
        assert results[40]["apply"][k] == pytest.approx(
            (results[30]["apply"][k] + results[50]["apply"][k]) / 2
        )
        assert results[60]["apply"][k] == pytest.approx(
            (results[50]["apply"][k] + results[70]["apply"][k]) / 2
        )
    # Original + 2 building reinvestments + 4 installation reinvestments over 100 years.
    assert results[50]["annual_factor"] == pytest.approx(
        (1 + 2 * 0.7 * 0.3 + 4 * 0.3 * 0.5) / 100
    )


def test_negative_flood_curve_and_zero_speed():
    with pytest.raises(InputError):
        calculate_helper("flood", {"times": [1, 2], "counts": [2, 1]}, {})
    with pytest.raises(InputError):
        calculate_helper("traffic", {"trenchless_length": 1, "trenchless_speed": 0}, {})


def test_helper_uncertainty_propagates_without_refitting():
    values = dict(
        trenchless_length=10,
        trench_length=0,
        trenchless_factor={"low": 1, "mode": 2, "high": 4},
        trench_factor=0,
    )
    h = calculate_helper("climate", values, {"carbon": 4, "seed": 42})
    derived = h["apply"]["construction_co2"]
    assert derived["low"] == 10 and derived["mode"] == 20 and derived["high"] == 40
    p = empty()
    p["alternatives"][0]["params"]["construction_co2"].update(derived)
    r = first(p)
    assert (
        r["construction"]["construction_co2"]["p05"] >= 40
        and r["construction"]["construction_co2"]["p95"] <= 160
    )
    assert (
        r["construction"]["construction_co2"]["p05"]
        < r["construction"]["construction_co2"]["p95"]
    )
    assert r == first(p)
    p["alternatives"][0]["params"]["construction_co2"]["mode"] = 22
    with pytest.raises(InputError):
        calculate(p)


def test_uncertain_traffic_support():
    values = dict(
        trenchless_length=100,
        trenchless_speed={"low": 50, "mode": 100, "high": 200},
        trench_length=0,
        trench_speed=5,
        delay=36,
        vehicles=1000,
        time_cost=100,
    )
    h = calculate_helper("traffic", values, {"seed": 42})
    assert h["apply"]["traffic"]["low"] == 500 and h["apply"]["traffic"]["high"] == 2000
