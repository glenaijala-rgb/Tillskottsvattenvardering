from backend.catalog import blank_project, example_project, EXAMPLES
from backend.engine import calculate

def test_new_project_has_traceable_defaults_and_separate_mutable_values():
    p = blank_project()
    assert p['analysis']['carbon'] == 1
    for key, values in EXAMPLES.items():
        assert [p['baseline'][key][k] for k in ['low', 'mode', 'high']] == values
        assert 'Göteborgsexempel' in p['baseline'][key]['source']
    assert p['baseline']['volume']['mode'] is None
    p['baseline']['treatment']['mode'] = 999
    assert blank_project()['baseline']['treatment']['mode'] == EXAMPLES['treatment'][1]

def test_synthetic_reference_keeps_fixed_values():
    p = example_project()
    assert all(v['low'] is None and v['high'] is None for v in p['baseline'].values())
    assert p['analysis']['carbon'] == 4
    calculate(p)
