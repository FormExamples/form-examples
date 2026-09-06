#!/usr/bin/env python3
"""Generate dashboard sample-report rows from examples/personas.json.

Each *-test-result form's clinician dashboard shows synthetic sample rows
(front-end-with-html/js/data.js and the parallel
front-end-with-svelte/src/lib/data/sample-reports.ts) so it has something
to display when the back end is offline. Those rows were previously
hand-authored independently of examples/personas.json, so they could (and
occasionally did) disagree with what the actual scoring engine would grade
for a similarly-described case. This generator derives one dashboard row
per persona directly from that persona's `state` and computed `expected`
grade, so the dashboard and the persona oracle can never disagree.

Scope: the *-test-result form family (see generate-persona-fhir-bundles.py
for the fleet-wide shape verification this reuses). Both stacks' ReportRow
shape is read from front-end-with-svelte/.../engine/types.ts (the
authoritative source; front-end-with-html/js/dashboard-types.js's JSDoc
`@typedef` is a hand-kept mirror of the same interface) — field order is
preserved exactly as declared there, since a few forms interleave a
domain-specific field (e.g. dexa-bone-density-test-result's `lowestTScore`,
`whoClassification`) between the generic ones rather than appending it.

Field mapping:
  id                          synthetic <PREFIX>-2026-NNNN, PREFIX read from
                               the form's own existing data.js (no fleet-wide
                               naming rule; every form picked its own)
  patientName                 cycled from a shared synthetic name pool
  reportStatus / reportedDate persona.state (present in every form in this
                               family)
  resultClassification / abnormalitySeverity / followUpUrgency /
  reportCompletenessPercent   persona.expected (the four-axis grade)
  flagCount                   len(persona.expected.flags)
  any other field             persona.state[<same camelCase name>] — every
                               form in the family was confirmed to carry a
                               same-named key in its persona state

Usage:
    bin/generate-persona-dashboard-samples.py [--check] [--all|<slug>...]

With no slugs and no --all, defaults to every *-test-result form under
forms/. --check reports drift without writing (CI drift detector).
"""

import argparse
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"

CANONICAL_DEFAULTS = {
    "id",
    "patientName",
    "reportStatus",
    "reportedDate",
    "resultClassification",
    "abnormalitySeverity",
    "followUpUrgency",
    "reportCompletenessPercent",
    "flagCount",
}

# A shared pool of distinct synthetic patient names, one per letter, already
# used verbatim across most of this family's hand-authored data.js files;
# extended here (I.../J...) for the two forms with more than 8 personas.
NAME_POOL = [
    "Aisha Khan",
    "Brian O’Connor",
    "Carmen Diaz",
    "David Müller",
    "Evelyn Wright",
    "Farid Hassan",
    "Grace Thompson",
    "Hiroshi Tanaka",
    "Ingrid Larsen",
    "Jamal Osei",
]

FIELD_RE = re.compile(r"^\s*(\w+)\??:", re.MULTILINE)
INTERFACE_RE = re.compile(r"export interface ReportRow \{(.*?)\n\}", re.DOTALL)
ID_PREFIX_RE = re.compile(r"id: '([A-Za-z0-9]+)-")


def read_report_row_fields(form_dir: Path) -> list[str]:
    types_path = form_dir / "front-end-with-svelte" / "src" / "lib" / "engine" / "types.ts"
    text = types_path.read_text()
    m = INTERFACE_RE.search(text)
    if not m:
        raise ValueError(f"no ReportRow interface found in {types_path}")
    return FIELD_RE.findall(m.group(1))


def read_id_prefix(form_dir: Path) -> str:
    data_js = form_dir / "front-end-with-html" / "js" / "data.js"
    text = data_js.read_text() if data_js.is_file() else ""
    m = ID_PREFIX_RE.search(text)
    if not m:
        raise ValueError(f"no existing 'id: PREFIX-...' row found in {data_js}")
    return m.group(1)


def build_row(fields: list[str], idx: int, persona: dict, prefix: str) -> dict:
    state = persona.get("state", {})
    expected = persona.get("expected", {})
    row: dict = {}
    for field in fields:
        if field == "id":
            row[field] = f"{prefix}-2026-{idx:04d}"
        elif field == "patientName":
            row[field] = NAME_POOL[(idx - 1) % len(NAME_POOL)]
        elif field == "reportStatus":
            row[field] = state.get("reportStatus", "")
        elif field == "reportedDate":
            row[field] = state.get("reportedDate", "")
        elif field == "resultClassification":
            row[field] = expected.get("resultClassification", "")
        elif field == "abnormalitySeverity":
            row[field] = expected.get("abnormalitySeverity", "")
        elif field == "followUpUrgency":
            row[field] = expected.get("followUpUrgency", "")
        elif field == "reportCompletenessPercent":
            row[field] = expected.get("reportCompletenessPercent", 0)
        elif field == "flagCount":
            row[field] = len(expected.get("flags") or [])
        else:
            row[field] = state.get(field)
    return row


def js_literal(value) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return repr(value)
    text = str(value).replace("\\", "\\\\").replace("'", "\\'")
    return f"'{text}'"


HTML_HEADER = """// Sample graded-report data for the clinician dashboard.
//
// One row per entry in ../../examples/personas.json, built from that
// persona's actual filled state and computed expected grade, so this
// dashboard and the persona oracle can never disagree. Mirrors the
// SvelteKit dashboard's `src/lib/data/sample-reports.ts`.
//
// Generated by bin/generate-persona-dashboard-samples.py — never hand-edit.

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
"""

HTML_FOOTER = """];

export { sampleReports };
"""

TS_HEADER = """import type { ReportRow } from '#lib/engine/types.js';

/**
 * One row per entry in ../../../examples/personas.json, built from that
 * persona's actual filled state and computed expected grade, so this
 * dashboard and the persona oracle can never disagree.
 *
 * Generated by bin/generate-persona-dashboard-samples.py — never hand-edit.
 */
export const sampleReports: ReportRow[] = [
"""

TS_FOOTER = """];
"""


def render_html(rows: list[dict], fields: list[str]) -> str:
    parts = [HTML_HEADER]
    for row in rows:
        parts.append("  {\n")
        lines = [f"    {field}: {js_literal(row[field])}" for field in fields]
        parts.append(",\n".join(lines))
        parts.append("\n  },\n")
    body = "".join(parts)
    if body.endswith("},\n"):
        body = body[: -len("},\n")] + "}\n"
    return body + HTML_FOOTER


def render_ts(rows: list[dict], fields: list[str]) -> str:
    parts = [TS_HEADER]
    for row in rows:
        parts.append("\t{\n")
        lines = [f"\t\t{field}: {js_literal(row[field])}" for field in fields]
        parts.append(",\n".join(lines))
        parts.append("\n\t},\n")
    body = "".join(parts)
    if body.endswith("},\n"):
        body = body[: -len("},\n")] + "}\n"
    return body + TS_FOOTER


def write_if_changed(path: Path, content: str, check: bool, drifted: list) -> None:
    existing = path.read_text() if path.is_file() else None
    if existing == content:
        return
    drifted.append(path)
    if not check:
        path.write_text(content)


def process_form(form_dir: Path, check: bool, drifted: list) -> int:
    slug = form_dir.name
    personas_path = form_dir / "examples" / "personas.json"
    if not personas_path.is_file():
        return 0
    data_js = form_dir / "front-end-with-html" / "js" / "data.js"
    sample_reports_ts = form_dir / "front-end-with-svelte" / "src" / "lib" / "data" / "sample-reports.ts"
    if not data_js.is_file() or not sample_reports_ts.is_file():
        return 0

    try:
        fields = read_report_row_fields(form_dir)
        prefix = read_id_prefix(form_dir)
    except ValueError as e:
        print(f"SKIP {slug}: {e}", file=sys.stderr)
        return 0

    personas = json.loads(personas_path.read_text()).get("personas", [])
    if not personas:
        return 0

    rows = [build_row(fields, i, p, prefix) for i, p in enumerate(personas, start=1)]

    write_if_changed(data_js, render_html(rows, fields), check, drifted)
    write_if_changed(sample_reports_ts, render_ts(rows, fields), check, drifted)
    return len(rows)


def iter_family_forms():
    return sorted(p for p in FORMS_DIR.glob("*-test-result") if p.is_dir())


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slugs", nargs="*", help="form slugs (default: every *-test-result form)")
    parser.add_argument("--all", action="store_true", help="same as no slugs: every *-test-result form")
    parser.add_argument("--check", action="store_true", help="report drift without writing; exit 1 if any found")
    args = parser.parse_args()

    if args.slugs:
        form_dirs = [FORMS_DIR / s for s in args.slugs]
        for d in form_dirs:
            if not d.is_dir():
                print(f"error: no such form directory: {d}", file=sys.stderr)
                return 2
    else:
        form_dirs = iter_family_forms()

    drifted: list[Path] = []
    total = 0
    for form_dir in form_dirs:
        total += process_form(form_dir, args.check, drifted)

    if args.check:
        if drifted:
            print(f"DRIFT: {len(drifted)} file(s) out of date:", file=sys.stderr)
            for p in drifted:
                print(f"  {p.relative_to(REPO_ROOT)}", file=sys.stderr)
            return 1
        print(f"OK: {total} dashboard row(s) up to date across {len(form_dirs)} form(s).")
        return 0

    print(f"Generated {total} dashboard row(s) across {len(form_dirs)} form(s) "
          f"({len(drifted)} file(s) written/updated).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
