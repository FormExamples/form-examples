# Lumbar Puncture Test Request — agent instructions

Lumbar puncture (LP) request (referral) for CSF sampling and/or manometry. A
clinician completes a single-page wizard; the engine computes a **four-axis
grading** (appropriateness, safety / contraindication, request completeness,
triage priority) plus safety flags, and produces a vetting report.

## Source of truth

`sql-migrations/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, contraindicationBand,
completenessPercent, triageTier + targetTimeframe, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. Suspected meningitis and suspected subarachnoid haemorrhage
auto-escalate the triage tier to emergency. Raised ICP (suspected ICP, focal
neurological signs, or reduced consciousness) without prior imaging drives the
contraindication band to caution / contraindicated and flags "obtain CT head
before LP". Choose the least-alarming band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview.
