#!/usr/bin/env python3
"""bin/generate-tools-doc.py — Generate docs/tools.md from bin/ tool headers.

Every tool in bin/ documents itself in a leading header: a module docstring
(Python) or a run of `#` comment lines (shell). This script harvests that
header — WITHOUT executing the tool, since some tools have side effects — and
renders a single reference page, docs/tools.md.

Generated artefact: do not hand-edit. Idempotent.

Usage:
  bin/generate-tools-doc.py          # write docs/tools.md
  bin/generate-tools-doc.py --check  # exit non-zero if docs/tools.md is stale
"""

from __future__ import annotations

import argparse
import ast
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
BIN_DIR = REPO_ROOT / "bin"
OUT_PATH = REPO_ROOT / "docs" / "tools.md"

# Nested generator dirs whose scripts are also user-facing tools.
EXTRA_DIRS = [
    "xml-representations",
    "fhir-r5",
    "protobuf",
    "openapi",
    "back-end-with-loco",
    "sql",
]


def is_tool(path: Path) -> bool:
    if not path.is_file() or not os.access(path, os.X_OK):
        return False
    if path.name.startswith("."):
        return False
    return True


def extract_doc(path: Path) -> str:
    text = path.read_text(errors="ignore")
    # Python: the module docstring.
    if path.suffix == ".py" or text.startswith("#!/usr/bin/env python"):
        try:
            mod = ast.parse(text)
            doc = ast.get_docstring(mod)
            if doc:
                return doc.strip()
        except SyntaxError:
            pass
    # Shell / other: the leading run of `#` comment lines after the shebang
    # and any `set -...` lines.
    lines = text.splitlines()
    out: list[str] = []
    started = False
    for line in lines:
        s = line.strip()
        if s.startswith("#!"):
            continue
        if s.startswith("set "):
            continue
        if s.startswith("#"):
            started = True
            out.append(s.lstrip("#").rstrip())
            continue
        if started:
            break
        if s == "":
            continue
        break
    # Trim leading/trailing blank comment lines.
    while out and out[0] == "":
        out.pop(0)
    while out and out[-1] == "":
        out.pop()
    return "\n".join(out).strip()


def tool_paths() -> list[tuple[str, Path]]:
    found: list[tuple[str, Path]] = []
    for path in sorted(BIN_DIR.iterdir()):
        if is_tool(path):
            found.append((path.name, path))
    for sub in EXTRA_DIRS:
        d = BIN_DIR / sub
        if d.is_dir():
            for path in sorted(d.iterdir()):
                if is_tool(path):
                    found.append((f"{sub}/{path.name}", path))
    return found


def render() -> str:
    out: list[str] = []
    out.append("# bin/ tools reference")
    out.append("")
    out.append(
        "Auto-generated from each tool's source header by "
        "`bin/generate-tools-doc.py` — do not hand-edit. Run the generator "
        "after adding or re-documenting a tool."
    )
    out.append("")
    tools = tool_paths()
    out.append(f"{len(tools)} tools.")
    out.append("")
    # Table of contents.
    for name, _ in tools:
        anchor = name.replace("/", "").replace(".", "").replace("_", "-")
        out.append(f"- [`bin/{name}`](#{anchor})")
    out.append("")
    for name, path in tools:
        anchor = name.replace("/", "").replace(".", "").replace("_", "-")
        out.append(f'<h2 id="{anchor}"><code>bin/{name}</code></h2>')
        out.append("")
        doc = extract_doc(path)
        if doc:
            out.append("```text")
            out.append(doc)
            out.append("```")
        else:
            out.append("_No header documentation._")
        out.append("")
    return "\n".join(out).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    want = render()
    if args.check:
        have = OUT_PATH.read_text() if OUT_PATH.exists() else ""
        if have != want:
            print("docs/tools.md is stale — run bin/generate-tools-doc.py", file=sys.stderr)
            return 1
        return 0
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(want)
    print(f"Wrote {OUT_PATH.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
