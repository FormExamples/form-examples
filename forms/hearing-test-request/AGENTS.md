# Hearing Test Request — agent instructions

Audiology / hearing-assessment request (referral). A clinician completes a
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
back-end. Red flags (sudden sensorineural hearing loss, unilateral / asymmetric
symptoms, ear discharge) auto-escalate the triage tier. Choose the
least-alarming band only when no rule fires.

There is no single published 1–9 audiology appropriateness score; the
appropriateness axis adapts the ordinal-rating convention to indication
appropriateness derived from the British Society of Audiology recommended
procedures and NICE NG98. State this anchoring wherever the score is surfaced.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`plan.md`](plan.md)
for the implementation roadmap.
