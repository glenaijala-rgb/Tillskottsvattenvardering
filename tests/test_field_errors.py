import pytest
from backend.catalog import blank_project
from backend.engine import validate, InputError


def test_missing_fields_have_stable_paths():
    p = blank_project()
    p['name'] = 'Test'
    p['alternatives'][0]['active'] = True
    p['alternatives'][1]['active'] = True
    p['alternatives'][0]['name'] = p['alternatives'][1]['name'] = 'Samma namn'
    with pytest.raises(InputError) as caught:
        validate(p)
    paths = {f['path'] for f in caught.value.fields}
    assert 'baseline.volume' in paths
    assert 'alternatives.0.params.investment' in paths
    assert 'alternatives.1.params.investment' in paths
    assert 'alternatives.2.params.investment' not in paths
    assert all(f['message'] in caught.value.errors for f in caught.value.fields)


def test_analysis_and_shares_paths():
    p = blank_project()
    p['name'] = ''
    p['analysis']['rate'] = -1
    p['analysis']['start'] = p['analysis']['end']
    p['alternatives'][0]['active'] = True
    p['alternatives'][0]['shares'] = [0, 0, 0]
    with pytest.raises(InputError) as caught:
        validate(p)
    paths = {f['path'] for f in caught.value.fields}
    assert {'name', 'analysis.start', 'analysis.end', 'analysis.rate', 'alternatives.0.shares'} <= paths
