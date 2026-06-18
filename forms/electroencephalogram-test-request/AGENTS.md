# Electroencephalogram Test Request — agent instructions

Electroencephalogram (EEG) test request (referral). A clinician completes a
single-page wizard; the engine computes a **four-axis grading**
(appropriateness, urgency, request completeness, clinical priority) plus safety
flags, and produces a vetting report.

## Source of truth

`sql-migrations/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, triageTier +
targetTimeframe, completenessPercent, priorityBand, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. Suspected status epilepticus auto-escalates the triage tier to
emergency. Per NICE NG217, EEG **supports** an epilepsy diagnosis and helps
classify seizure type / syndrome but must **not** be used to exclude epilepsy or
in isolation. Choose the least-alarming band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
