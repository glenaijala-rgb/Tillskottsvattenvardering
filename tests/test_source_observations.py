"""Fixed source observations are cross-checked, never represented as fresh Excel runs."""
import json,math
from pathlib import Path
import pytest

FIXTURES=Path(__file__).parent/'fixtures'
OBS={x['id']:x['outputs'] for x in json.loads((FIXTURES/'libreoffice_observations.json').read_text(encoding='utf-8'))}

def test_original_time_and_annuity_defects_explain_recorded_t02():
    # Independently reproduce precisely the original formula, without using the new engine.
    original=200*sum(1/1.03**t for t in range(2,101))
    assert OBS['T02']['Resultat!D4']['value']==pytest.approx(original)
    assert OBS['T02']['Resultat!D5']['value']==pytest.approx(original*(.03-1.03**-10))

def test_original_other_cost_crosswire():
    assert OBS['T08-cost']['MC!AU6']['value']==0
    assert OBS['T08-benefit']['MC!AU6']['value']==100
    expected=100*sum(1/1.03**t for t in range(2,101))-100/1.03
    assert OBS['T08-benefit']['Resultat!D4']['value']==pytest.approx(expected)

def test_source_climate_crosswire_and_units():
    assert OBS['T09']['MC!BG6']['value']==300
    assert OBS['T09']['Resultat!D4']['value']==pytest.approx(-100/1.03)

def test_source_helpers_match_hand_cases():
    assert OBS['T11']['Beräkningshjälp!E53']['value']==160
    assert OBS['T12']['Beräkningshjälp!E73']['value']==1000
    assert OBS['T13']['Beräkningshjälp!D35']['value']==pytest.approx(.3)

def test_source_same_year_error_is_not_zero():
    for id in ['T10-one','T10-hundred']:
        assert OBS[id]['Ber!BJ23']['error']!=0
        assert OBS[id]['Resultat!D4']['text']==''

def test_independent_reader_resolves_arv_reference():
    assert 'R30:S30' in OBS['T01']['Inv ARV!T30']['formula']
    assert 'XFV' not in OBS['T01']['Inv ARV!T30']['formula']
