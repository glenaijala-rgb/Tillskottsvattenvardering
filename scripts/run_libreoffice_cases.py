"""Run using LibreOffice's bundled Python and a dedicated local UNO listener.
This is a LibreOffice compatibility test, not a Microsoft Excel certification.
"""

import sys, json, shutil, hashlib, time
from pathlib import Path
import uno
from com.sun.star.beans import PropertyValue


def prop(name, value):
    p = PropertyValue()
    p.Name = name
    p.Value = value
    return p


source = Path(sys.argv[1]).resolve()
manifest = Path(sys.argv[2])
out = Path(sys.argv[3]).resolve()
out.mkdir(parents=True, exist_ok=True)
ctx = uno.getComponentContext()
resolver = ctx.ServiceManager.createInstanceWithContext(
    "com.sun.star.bridge.UnoUrlResolver", ctx
)
remote = resolver.resolve(
    "uno:socket,host=127.0.0.1,port=2010;urp;StarOffice.ComponentContext"
)
desktop = remote.ServiceManager.createInstanceWithContext(
    "com.sun.star.frame.Desktop", remote
)
results = []
cases = json.loads(manifest.read_text(encoding="utf-8"))
for case in cases:
    path = out / (case["id"] + ".xlsb")
    shutil.copyfile(source, path)
    stamp = time.time()
    print("Starting " + case["id"], flush=True)
    doc = desktop.loadComponentFromURL(
        uno.systemPathToFileUrl(str(path)),
        "_blank",
        0,
        (prop("Hidden", True), prop("UpdateDocMode", 0), prop("MacroExecutionMode", 0)),
    )
    try:
        doc.enableAutomaticCalculation(False)
        for name, values in case["cells"].items():
            sheet = doc.Sheets.getByName(name)
            for addr, value in values.items():
                cell = sheet.getCellRangeByName(addr)
                if value is None:
                    cell.clearContents(23)
                elif isinstance(value, str):
                    cell.setString(value)
                else:
                    cell.setValue(float(value))
        doc.calculateAll()
        addresses = {
            "Resultat": [
                "D4",
                "E4",
                "F4",
                "D5",
                "E5",
                "F5",
                "D109",
                "G109",
                "D110",
                "G110",
                "D111",
                "G111",
                "D112",
                "G112",
                "D113",
                "G113",
                "D115",
                "G115",
                "D116",
                "G116",
                "D117",
                "G117",
                "G122",
                "G125",
                "G126",
                "J126",
                "M126",
            ],
            "Beräkningshjälp": [
                "D35",
                "D53",
                "E53",
                "F53",
                "D73",
                "E73",
                "F73",
                "D19",
                "E19",
                "F19",
                "D20",
                "E20",
                "F20",
                "D21",
                "E21",
                "F21",
            ],
            "Inv ARV": ["T30", "B10"],
            "MC": ["AU6", "BG6"],
            "Ber": ["BD23", "BG23", "BJ23", "DZ21"],
        }
        outputs = {}
        for name, addrs in addresses.items():
            for addr in addrs:
                c = doc.Sheets.getByName(name).getCellRangeByName(addr)
                outputs[name + "!" + addr] = {
                    "value": c.getValue(),
                    "text": c.getString(),
                    "error": c.getError(),
                    "formula": c.getFormula(),
                }
        # Preserve the recalculated test copy as ODS; source XLSB copy remains unchanged on disk.
        doc.storeAsURL(
            uno.systemPathToFileUrl(str(out / (case["id"] + ".ods"))),
            (prop("FilterName", "calc8"), prop("Overwrite", True)),
        )
        row = {
            "id": case["id"],
            "engine": "LibreOffice 26.2.4",
            "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "seconds": time.time() - stamp,
            "outputs": outputs,
        }
        results.append(row)
        (out / "results.json").write_text(
            json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(
            case["id"] + " completed in " + str(round(time.time() - stamp, 1)) + "s",
            flush=True,
        )
    finally:
        doc.close(True)
print("All cases completed", flush=True)
