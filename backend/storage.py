"""SQLite revisions and immutable runs. JSON documents are schema-versioned snapshots."""

from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
import json, sqlite3, uuid


def now():
    return datetime.now(timezone.utc).isoformat()


def dumps(v):
    return json.dumps(v, ensure_ascii=False, allow_nan=False, separators=(",", ":"))


class Conflict(Exception):
    pass


class Store:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.connect() as c:
            if c.execute("PRAGMA user_version").fetchone()[0] not in (0, 1):
                raise ValueError(
                    "Databasen har en annan schemaversion. Migrering krävs före start."
                )
            c.executescript("""
            CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY,name TEXT NOT NULL,area TEXT NOT NULL,updated TEXT NOT NULL,archived INTEGER NOT NULL DEFAULT 0,revision INTEGER NOT NULL);
            CREATE TABLE IF NOT EXISTS project_revisions(project_id TEXT NOT NULL REFERENCES projects(id),revision INTEGER NOT NULL,created TEXT NOT NULL,schema_version INTEGER NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(project_id,revision));
            CREATE TABLE IF NOT EXISTS calculation_runs(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,revision INTEGER NOT NULL,created TEXT NOT NULL,status TEXT NOT NULL,engine_version TEXT NOT NULL,result TEXT,error TEXT,FOREIGN KEY(project_id,revision) REFERENCES project_revisions(project_id,revision));
            CREATE INDEX IF NOT EXISTS run_project ON calculation_runs(project_id,created);
            PRAGMA user_version=1;
            """)
            c.execute(
                "UPDATE calculation_runs SET status='failed',error='Körningen avbröts när servern stoppades.' WHERE status='running'"
            )

    @contextmanager
    def connect(self):
        c = sqlite3.connect(self.path, timeout=15)
        c.row_factory = sqlite3.Row
        c.execute("PRAGMA foreign_keys=ON")
        try:
            yield c
            c.commit()
        except Exception:
            c.rollback()
            raise
        finally:
            c.close()

    def list(self):
        with self.connect() as c:
            return [
                dict(r)
                for r in c.execute("SELECT * FROM projects ORDER BY updated DESC")
            ]

    def get(self, id):
        with self.connect() as c:
            r = c.execute("SELECT * FROM projects WHERE id=?", (id,)).fetchone()
            if not r:
                raise KeyError(id)
            rev = c.execute(
                "SELECT payload FROM project_revisions WHERE project_id=? AND revision=?",
                (id, r["revision"]),
            ).fetchone()
            return {**dict(r), "data": json.loads(rev["payload"])}

    def create(self, data):
        id = str(uuid.uuid4())
        stamp = now()
        with self.connect() as c:
            c.execute(
                "INSERT INTO projects VALUES(?,?,?,?,0,1)",
                (id, data["name"], data.get("area", ""), stamp),
            )
            c.execute(
                "INSERT INTO project_revisions VALUES(?,1,?,1,?)",
                (id, stamp, dumps(data)),
            )
        return self.get(id)

    def save(self, id, data, expected):
        stamp = now()
        with self.connect() as c:
            c.execute("BEGIN IMMEDIATE")
            r = c.execute("SELECT revision FROM projects WHERE id=?", (id,)).fetchone()
            if not r:
                raise KeyError(id)
            if r["revision"] != expected:
                raise Conflict(
                    "Projektet har ändrats i ett annat fönster. Öppna det igen innan du sparar."
                )
            rev = expected + 1
            c.execute(
                "INSERT INTO project_revisions VALUES(?,?,?,1,?)",
                (id, rev, stamp, dumps(data)),
            )
            c.execute(
                "UPDATE projects SET revision=?,name=?,area=?,updated=? WHERE id=?",
                (rev, data["name"], data.get("area", ""), stamp, id),
            )
        return self.get(id)

    def archive(self, id, value):
        self.get(id)
        with self.connect() as c:
            c.execute(
                "UPDATE projects SET archived=?,updated=? WHERE id=?",
                (int(value), now(), id),
            )

    def begin_run(self, id, revision, version):
        run = str(uuid.uuid4())
        with self.connect() as c:
            c.execute(
                "INSERT INTO calculation_runs VALUES(?,?,?,?,?,?,NULL,NULL)",
                (run, id, revision, now(), "running", version),
            )
        return run

    def finish_run(self, id, result=None, error=None):
        with self.connect() as c:
            c.execute(
                "UPDATE calculation_runs SET status=?,result=?,error=? WHERE id=?",
                (
                    "failed" if error else "complete",
                    dumps(result) if result else None,
                    error,
                    id,
                ),
            )

    def runs(self, id):
        self.get(id)
        with self.connect() as c:
            return [
                dict(r)
                for r in c.execute(
                    "SELECT id,revision,created,status,engine_version,error FROM calculation_runs WHERE project_id=? ORDER BY created DESC",
                    (id,),
                )
            ]

    def run(self, id):
        with self.connect() as c:
            r = c.execute("SELECT * FROM calculation_runs WHERE id=?", (id,)).fetchone()
            if not r:
                raise KeyError(id)
            p = c.execute(
                "SELECT payload FROM project_revisions WHERE project_id=? AND revision=?",
                (r["project_id"], r["revision"]),
            ).fetchone()
            return {
                **dict(r),
                "result": json.loads(r["result"]) if r["result"] else None,
                "input": json.loads(p["payload"]),
            }

    def backup(self, directory):
        path = Path(directory)
        path.mkdir(parents=True, exist_ok=True)
        dest = path / (
            datetime.now().strftime("%Y%m%d-%H%M%S-")
            + uuid.uuid4().hex[:6]
            + ".sqlite3"
        )
        with self.connect() as c:
            target = sqlite3.connect(dest)
            try:
                c.backup(target)
            finally:
                target.close()
        return dest
