"""Review must agree with calculation validation without changing saved history."""
import copy
import pytest
from fastapi.testclient import TestClient
from backend.app import create_app
from backend.catalog import example_project


@pytest.mark.parametrize("invalid", [False, True])
def test_review_matches_calculation_and_does_not_save(tmp_path, invalid):
    client = TestClient(create_app(tmp_path / "projects.sqlite3"))
    data = example_project()
    saved = client.post("/api/projects", json=data).json()
    if invalid:
        data["alternatives"][0]["params"]["volume_reduction"]["mode"] = 1e12
    original = copy.deepcopy(data)
    response = client.post("/api/validate", json=data)
    assert response.status_code == 200
    review = response.json()
    assert review["valid"] is (not invalid)
    assert data == original
    assert client.get("/api/projects/" + saved["id"]).json() == saved
    assert client.get("/api/projects/" + saved["id"] + "/runs").json() == []
    draft = client.put("/api/projects/" + saved["id"], json={"data": data, "revision": 1}).json()
    calculated = client.post("/api/projects/" + saved["id"] + "/calculate", json={"revision": draft["revision"]})
    if invalid:
        assert calculated.status_code == 422
        assert review["fields"] == calculated.json()["fields"]
        assert review["errors"] == calculated.json()["detail"]
    else:
        assert calculated.status_code == 200
        assert review["fields"] == review["errors"] == []


def test_review_exclusions_and_inactive_alternative(tmp_path):
    client = TestClient(create_app(tmp_path / "projects.sqlite3"))
    data = example_project()
    data["excluded_groups"] = ["Rening"]
    data["baseline"]["treatment"]["mode"] = None
    data["alternatives"][1]["active"] = False
    data["alternatives"][1]["params"]["investment"]["mode"] = None
    result = client.post("/api/validate", json=data).json()
    assert result["valid"] is True
    assert client.get("/api/projects").json() == []
