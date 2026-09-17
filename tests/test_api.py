import copy, sqlite3
import pytest
from fastapi.testclient import TestClient
from backend.app import create_app
from backend.catalog import example_project, blank_project


@pytest.fixture
def client(tmp_path):
    with TestClient(create_app(tmp_path / "data" / "test.sqlite3")) as c:
        yield c


def test_draft_save_reopen_conflict_and_isolation(client):
    first = client.post("/api/projects", json=blank_project()).json()
    second = client.post("/api/projects", json=example_project()).json()
    assert (
        client.post(
            f"/api/projects/{first['id']}/calculate", json={"revision": 1}
        ).status_code
        == 422
    )
    data = first["data"]
    data["name"] = "Ändrat"
    data["notes"] = "Åäö svenska"
    response = client.put(
        "/api/projects/" + first["id"], json={"data": data, "revision": 1}
    )
    assert response.status_code == 200
    assert (
        client.put(
            "/api/projects/" + first["id"], json={"data": data, "revision": 1}
        ).status_code
        == 409
    )
    reopened = client.get("/api/projects/" + first["id"]).json()
    assert reopened["revision"] == 2 and reopened["data"]["notes"] == "Åäö svenska"
    assert (
        client.get("/api/projects/" + second["id"]).json()["data"]["name"] != "Ändrat"
    )


def test_history_copy_archive_and_backup_restore(client):
    p = client.post("/api/projects", json=example_project()).json()
    url = "/api/projects/" + p["id"]
    run = client.post(url + "/calculate", json={"revision": 1}).json()
    assert run["status"] == "complete"
    old = copy.deepcopy(run["result"])
    data = p["data"]
    data["baseline"]["treatment"]["mode"] = 3
    assert client.put(url, json={"data": data, "revision": 1}).status_code == 200
    assert client.get("/api/runs/" + run["id"]).json()["result"] == old
    assert (
        client.get("/api/runs/" + run["id"]).json()["input"]["baseline"]["treatment"][
            "mode"
        ]
        == 2
    )
    copied = client.post(url + "/copy", json={}).json()
    assert copied["id"] != p["id"]
    assert client.get("/api/projects/" + copied["id"] + "/runs").json() == []
    client.post(url + "/archive", json={"archived": True})
    assert client.get(url).json()["archived"] == 1
    client.post(url + "/archive", json={"archived": False})
    assert client.get(url).json()["archived"] == 0
    backup = client.post("/api/backup", json={}).json()["file"]
    response = client.post("/api/restore", json={"file": backup})
    assert response.status_code == 200 and response.json()["restored"] == 2
    projects = client.get("/api/projects").json()
    assert len(projects) == 4
    restored = next(
        x for x in projects if "återställd" in x["name"] and "kopia" not in x["name"]
    )
    assert (
        client.get("/api/projects/" + restored["id"]).json()["data"]["baseline"][
            "treatment"
        ]["mode"]
        == 3
    )
    rs = client.get("/api/projects/" + restored["id"] + "/runs").json()
    assert len(rs) == 1
    assert client.get("/api/runs/" + rs[0]["id"]).json()["result"] == old
    assert client.get("/api/runs/" + rs[0]["id"]).json()["input"] == run["input"]


def test_restart_preserves_projects_and_marks_interrupted(tmp_path):
    path = tmp_path / "data" / "test.sqlite3"
    app = create_app(path)
    p = app.state.store.create(example_project())
    run = app.state.store.begin_run(p["id"], 1, "test")
    restarted = create_app(path)
    assert restarted.state.store.get(p["id"])["data"] == p["data"]
    assert restarted.state.store.run(run)["status"] == "failed"


def test_local_access_controls_and_restore_path(client):
    assert (
        client.post(
            "/api/backup", json={}, headers={"origin": "https://evil.example"}
        ).status_code
        == 403
    )
    assert client.post("/api/backup", data="x").status_code == 415
    assert (
        client.get("/api/health", headers={"host": "evil.example"}).status_code == 400
    )
    assert (
        client.post("/api/restore", json={"file": "../test.sqlite3"}).status_code == 422
    )
    assert client.get("/api/projects/no-such-id").status_code == 404


def test_invalid_run_revision(client):
    p = client.post("/api/projects", json=example_project()).json()
    assert (
        client.post(
            "/api/projects/" + p["id"] + "/calculate", json={"revision": 0}
        ).status_code
        == 409
    )
