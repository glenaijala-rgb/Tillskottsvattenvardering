from pathlib import Path
from urllib.parse import urlsplit
import os, json, sqlite3, threading
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.trustedhost import TrustedHostMiddleware
from .catalog import BASE, ALT, CATEGORIES, EXAMPLES, blank_project, example_project
from .engine import calculate, validate, InputError, VERSION
from .helpers import calculate_helper
from .storage import Store, Conflict

ROOT = Path(__file__).resolve().parent.parent


def create_app(database=None):
    app = FastAPI(title="Tillskottsvattenvärdering", version=VERSION)
    store = Store(
        database or os.environ.get("TSV_DATABASE", ROOT / "data" / "projects.sqlite3")
    )
    app.state.store = store
    lock = threading.Lock()
    app.add_middleware(
        TrustedHostMiddleware, allowed_hosts=["127.0.0.1", "localhost", "testserver"]
    )

    @app.middleware("http")
    async def local_only(request, call_next):
        if request.method not in ("GET", "HEAD", "OPTIONS"):
            origin = request.headers.get("origin")
            if origin and (
                urlsplit(origin).netloc != request.headers.get("host")
                or urlsplit(origin).scheme != "http"
            ):
                return JSONResponse(
                    {"detail": "Endast anrop från programmets eget fönster tillåts."},
                    403,
                )
            if (
                request.headers.get("content-type", "").split(";")[0]
                != "application/json"
            ):
                return JSONResponse({"detail": "JSON krävs."}, 415)
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'"
        )
        return response

    @app.exception_handler(InputError)
    async def invalid(request, e):
        return JSONResponse({"detail": e.errors, "fields": e.fields}, 422)

    @app.exception_handler(KeyError)
    async def missing(request, e):
        return JSONResponse({"detail": "Projektet eller körningen finns inte."}, 404)

    @app.exception_handler(Conflict)
    async def conflict(request, e):
        return JSONResponse({"detail": str(e)}, 409)

    def draft(data):
        if (
            not isinstance(data, dict)
            or not isinstance(data.get("name"), str)
            or not data["name"].strip()
        ):
            raise InputError(["Ange projektnamn."], [{"path": "name", "message": "Ange projektnamn."}])
        if len(json.dumps(data)) > 2_000_000:
            raise InputError(["Projektet är för stort."])
        if (
            not isinstance(data.get("baseline"), dict)
            or not isinstance(data.get("alternatives"), list)
            or not isinstance(data.get("analysis"), dict)
        ):
            raise InputError(["Projektets struktur är ogiltig."])
        try:
            json.dumps(data, allow_nan=False)
        except ValueError:
            raise InputError(["Ogiltigt numeriskt värde."])
        return data

    @app.get("/api/health")
    def health():
        return {
            "application": "tillskottsvattenvardering",
            "version": VERSION,
            "application_version": (ROOT / "VERSION").read_text(encoding="utf-8").strip(),
            "database": "SQLite",
            "method": "lokal-1",
            "excel_verified": False,
        }

    @app.get("/api/catalog")
    def catalog():
        return {
            "baseline": BASE,
            "alternative": ALT,
            "categories": CATEGORIES,
            "examples": EXAMPLES,
        }

    @app.get("/api/template")
    def template(example: bool = False):
        return example_project() if example else blank_project()

    @app.post("/api/validate")
    def review(data: dict):
        # Reuse calculation validation without saving a revision or starting a run.
        try:
            validate(data)
        except InputError as error:
            return {"valid": False, "errors": error.errors, "fields": error.fields}
        return {"valid": True, "errors": [], "fields": []}

    @app.get("/api/projects")
    def projects():
        return store.list()

    @app.post("/api/projects")
    def create(data: dict):
        return store.create(draft(data))

    @app.get("/api/projects/{id}")
    def get(id: str):
        return store.get(id)

    @app.put("/api/projects/{id}")
    def save(id: str, body: dict):
        return store.save(id, draft(body.get("data")), body.get("revision"))

    @app.post("/api/projects/{id}/copy")
    def copy(id: str):
        data = store.get(id)["data"]
        data["name"] += " – kopia"
        return store.create(data)

    @app.post("/api/projects/{id}/archive")
    def archive(id: str, body: dict):
        store.archive(id, body.get("archived") is True)
        return {"ok": True}

    @app.post("/api/projects/{id}/calculate")
    def run(id: str, body: dict):
        if not lock.acquire(blocking=False):
            raise HTTPException(409, "En beräkning pågår. Vänta tills den är klar.")
        run_id = None
        try:
            project = store.get(id)
            if body.get("revision") != project["revision"]:
                raise Conflict("Projektet ändrades före beräkningen. Öppna det igen.")
            validate(project["data"])
            run_id = store.begin_run(id, project["revision"], VERSION)
            result = calculate(project["data"])
            store.finish_run(run_id, result)
            return store.run(run_id)
        except Exception as e:
            if run_id:
                store.finish_run(run_id, error=str(e))
            raise
        finally:
            lock.release()

    @app.get("/api/projects/{id}/runs")
    def runs(id: str):
        return store.runs(id)

    @app.get("/api/runs/{id}")
    def get_run(id: str):
        return store.run(id)

    @app.post("/api/helpers/{kind}")
    def helper(kind: str, body: dict):
        return calculate_helper(kind, body.get("values", {}), body.get("settings", {}))

    @app.post("/api/backup")
    def backup():
        path = store.backup(store.path.parent.parent / "backups")
        return {"file": path.name}

    @app.get("/api/backups")
    def backups():
        return [
            p.name
            for p in sorted(
                (store.path.parent.parent / "backups").glob("*.sqlite3"), reverse=True
            )
        ]

    @app.post("/api/restore")
    def restore(body: dict):
        name = body.get("file", "")
        if (
            not isinstance(name, str)
            or Path(name).name != name
            or not name.endswith(".sqlite3")
        ):
            raise InputError(["Ogiltigt namn på säkerhetskopia."])
        path = store.path.parent.parent / "backups" / name
        if not path.is_file():
            raise HTTPException(404, "Säkerhetskopian finns inte.")
        # Import into independent projects; never replace current projects or history.
        source = sqlite3.connect(f"{path.as_uri()}?mode=ro", uri=True)
        source.row_factory = sqlite3.Row
        try:
            if source.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                raise InputError(["Säkerhetskopian är skadad."])
            if source.execute("PRAGMA user_version").fetchone()[0] != 1:
                raise InputError(["Fel databasversion."])
            rows = source.execute("SELECT * FROM projects").fetchall()
            # Preflight every snapshot before mutation, then import everything transactionally.
            for row in source.execute("SELECT payload FROM project_revisions"):
                draft(json.loads(row["payload"]))
            import uuid

            with store.connect() as dest:
                for row in rows:
                    id = str(uuid.uuid4())
                    dest.execute(
                        "INSERT INTO projects VALUES(?,?,?,?,?,?)",
                        (
                            id,
                            row["name"] + " – återställd",
                            row["area"],
                            row["updated"],
                            row["archived"],
                            row["revision"] + 1,
                        ),
                    )
                    for rev in source.execute(
                        "SELECT * FROM project_revisions WHERE project_id=?",
                        (row["id"],),
                    ):
                        dest.execute(
                            "INSERT INTO project_revisions VALUES(?,?,?,?,?)",
                            (
                                id,
                                rev["revision"],
                                rev["created"],
                                rev["schema_version"],
                                rev["payload"],
                            ),
                        )
                    latest = json.loads(
                        source.execute(
                            "SELECT payload FROM project_revisions WHERE project_id=? AND revision=?",
                            (row["id"], row["revision"]),
                        ).fetchone()["payload"]
                    )
                    latest["name"] += " – återställd"
                    dest.execute(
                        "INSERT INTO project_revisions VALUES(?,?,?,?,?)",
                        (
                            id,
                            row["revision"] + 1,
                            row["updated"],
                            1,
                            json.dumps(latest, ensure_ascii=False),
                        ),
                    )
                    for run in source.execute(
                        "SELECT * FROM calculation_runs WHERE project_id=?",
                        (row["id"],),
                    ):
                        dest.execute(
                            "INSERT INTO calculation_runs VALUES(?,?,?,?,?,?,?,?)",
                            (
                                str(uuid.uuid4()),
                                id,
                                run["revision"],
                                run["created"],
                                run["status"],
                                run["engine_version"],
                                run["result"],
                                run["error"],
                            ),
                        )
            return {"restored": len(rows)}
        except sqlite3.DatabaseError:
            raise InputError(["Filen är inte en giltig säkerhetskopia för programmet."])
        finally:
            source.close()

    dist = ROOT / "frontend" / "dist"
    if dist.exists():
        app.mount("/assets", StaticFiles(directory=dist / "assets"), name="assets")

        @app.get("/")
        def index():
            return FileResponse(dist / "index.html")

    return app
