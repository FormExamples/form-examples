# Eye Vision Test Request — agent instructions

Ophthalmic / optometric eye examination request (referral). A clinician
completes a single-page wizard; the engine computes a **four-axis grading**
(appropriateness, urgency / triage priority, request completeness, clinical
priority) plus safety flags, and produces a vetting report.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, triageTier +
targetTimeframe, completenessPercent, priorityBand, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. Red-flags (sudden visual loss, retinal-detachment symptoms, acute
painful red eye, suspected giant cell arteritis) auto-escalate the triage tier
to emergency. Choose the least-alarming band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
