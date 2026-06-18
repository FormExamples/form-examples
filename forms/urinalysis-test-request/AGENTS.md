# Urinalysis Test Request — agent instructions

Urine pathology test request (order). A clinician completes a single-page
wizard; the engine computes a **four-axis grading** (appropriateness,
preanalytical specimen suitability, request completeness, triage priority) plus
safety flags, and produces a vetting report. The request ORDERS multiple urine
tests, modelled as BOOLEAN columns on the main table.

## Source of truth

`sql-migrations/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, preanalyticalBand,
fastingOrSpecimen, completenessPercent, triageTier + targetTimeframe,
recommendation, firedRules[], flags[] }`. Rule IDs are identical across every
front-end and the back-end. Red flags (visible haematuria; fever + loin pain →
suspected pyelonephritis) auto-escalate the triage tier. Choose the
least-alarming band only when no rule fires. The 1–9 appropriateness scale is
anchored on indication-to-test match + guideline appropriateness (NICE NG109,
NICE NG12, UK SMI B41); there is no single published 1–9 urinalysis score.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
