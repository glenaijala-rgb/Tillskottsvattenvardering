import copy
import hashlib
import json
import pytest
from backend.catalog import example_project
from backend.engine import calculate, validate, InputError

def test_excluded_group_skips_missing_values_and_preserves_original():
    p = example_project()
    p['excluded_groups'] = ['Källaröversvämningar']
    p['baseline']['floods']['mode'] = None
    p['baseline']['damage_small']['mode'] = 12345
    p['alternatives'][0]['params']['flood_reduction']['mode'] = 999
    original = copy.deepcopy(p)
    result = calculate(p)
    assert result['baseline']['flood_damage']['p50'] == 0
    assert p == original
    assert result['input_hash'] == hashlib.sha256(json.dumps(p, sort_keys=True, ensure_ascii=False, allow_nan=False).encode()).hexdigest()
    p['excluded_groups'] = []
    with pytest.raises(InputError): validate(p)
    assert p['baseline']['damage_small']['mode'] == 12345

def test_explicit_exclusion_is_required_for_empty_post():
    p = example_project()
    item = p['alternatives'][0]['params']['traffic']
    item['mode'] = None
    with pytest.raises(InputError): validate(p)
    item['excluded'] = True
    calculate(p)
    assert item['mode'] is None
    item['excluded'] = False
    with pytest.raises(InputError): validate(p)

def test_excluded_cost_matches_explicit_zero_without_losing_value():
    p = example_project()
    expected = calculate(p)['alternatives']
    p['alternatives'][0]['params']['traffic'].update(mode=100000, excluded=True)
    assert calculate(p)['alternatives'] == expected
    assert p['alternatives'][0]['params']['traffic']['mode'] == 100000

def test_required_volume_cannot_be_excluded():
    p = example_project()
    p['baseline']['volume']['excluded'] = True
    with pytest.raises(InputError): validate(p)
