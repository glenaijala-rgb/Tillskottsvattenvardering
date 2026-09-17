"""Start one local instance and open the browser. No external services."""

import json, os, subprocess, sys, time, urllib.request, webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
URL = "http://127.0.0.1:8765"


def running():
    try:
        with urllib.request.urlopen(URL + "/api/health", timeout=1) as response:
            return (
                json.loads(response.read()).get("application")
                == "tillskottsvattenvardering"
            )
    except Exception:
        return False


if __name__ == "__main__":
    if not (ROOT / "frontend" / "dist" / "index.html").exists():
        sys.exit("Webbgränssnittet saknas. Kör Installera.ps1 först.")
    if not running():
        logdir = ROOT / "data"
        logdir.mkdir(exist_ok=True)
        with (logdir / "server.log").open("ab") as log:
            process = subprocess.Popen(
                [
                    sys.executable,
                    "-m",
                    "uvicorn",
                    "backend.app:create_app",
                    "--factory",
                    "--host",
                    "127.0.0.1",
                    "--port",
                    "8765",
                ],
                cwd=ROOT,
                stdout=log,
                stderr=log,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
            )
        (logdir / "server.pid").write_text(str(process.pid))
        for _ in range(50):
            if running():
                break
            if process.poll() is not None:
                sys.exit(
                    "Servern kunde inte starta. Kontrollera data/server.log och att port 8765 är ledig."
                )
            time.sleep(0.2)
        else:
            sys.exit("Servern svarade inte. Se data/server.log.")
    if '--no-browser' not in sys.argv:
        webbrowser.open(URL)
    print("Programmet är öppet i webbläsaren. Dina projekt sparas lokalt.")
