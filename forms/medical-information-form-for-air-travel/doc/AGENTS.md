# Medical Information Form for Air Travel — reference material

This directory holds the clinical and operational reference documents that
underpin the MEDIF fitness-to-fly engine. The form's authoritative spec lives
in `../index.md` and `../AGENTS.md`; the files here back the specific
thresholds, dates, and recommended-action wording that the rules engine
applies.

## Contents

- [`index.md`](./index.md) — brief overview of the documentation set.
- [`iata-medical-manual.md`](./iata-medical-manual.md) — alignment with the
  IATA *Medical Manual* (13th ed.) and the conservative recovery windows the
  engine uses when carriers diverge.
- [`airline-windows.md`](./airline-windows.md) — comparison table of MEDIF
  recovery windows across Emirates, Qatar Airways, British Airways, LOT
  Polish Airlines, KLM, Air India, ANA, and Starlux.
- [`fitness-band-rules.md`](./fitness-band-rules.md) — rule-by-rule predicate
  table for every airline-aligned rule the engine fires, mirroring the
  *Airline-aligned rules* section in `../AGENTS.md`.

## Conventions for adding new reference docs

- Filenames are lowercase, hyphen-separated, `.md`.
- One topic per file; cross-link rather than nest.
- Cite the public source URL beside any numeric threshold (week count, day
  count, oxygen flow rate, SpO2 percent).
- When carriers disagree, prefer the most conservative window and note the
  outliers in `airline-windows.md`.
- Documents here are read by humans (clinicians, airline-desk reviewers) and
  by agents; keep prose precise and machine-friendly.

## Related

- `../index.md` — form overview and 14-step wizard table.
- `../AGENTS.md` — agent instructions and airline-aligned rules summary.
- `../sql-migrations/` — the authoritative data schema; rule predicates must
  reference column names that exist there.
- `../fhir-r5/`, `../xml-representations/`, `../protobuf/`, `../typespec/` —
  representation schemas derived from the same SQL.
