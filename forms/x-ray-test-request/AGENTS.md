# X-Ray Test Request — agent instructions

Plain-radiograph (X-ray) imaging request (referral). A clinician completes a
single-page wizard; the engine computes a **four-axis grading**
(appropriateness, radiation safety, request completeness, triage priority) plus
safety flags, and produces a vetting report.

## Source of truth

`sql-migrations/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, radiationSafetyBand,
radiationDoseBand, completenessPercent, triageTier + targetTimeframe,
recommendation, firedRules[], flags[] }`. Rule IDs are identical across every
front-end and the back-end. A radiation-safety concern (pregnancy / possible
pregnancy, unjustified exposure, repeat recent imaging) forces the *caution* or
*contraindicated* band and raises a flag. Choose the least-alarming band only
when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
