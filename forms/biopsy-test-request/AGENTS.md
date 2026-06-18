# Biopsy Test Request — agent instructions

Tissue biopsy procedure / pathology request (referral). A clinician completes a
single-page wizard; the engine computes a **four-axis grading** (appropriateness,
periprocedural bleeding risk, request completeness, urgency / cancer pathway)
plus safety flags, and produces a vetting report.

## Source of truth

`sql-migrations/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, bleedingRiskBand +
anticoagulantAction, completenessPercent, triageTier + targetTimeframe +
twoWeekWaitEligible, recommendation, firedRules[], flags[] }`. Rule IDs are
identical across every front-end and the back-end. A suspected-malignancy /
cancer-staging indication makes the request two-week-wait eligible and escalates
triage. High bleeding-risk inputs (anticoagulant / antiplatelet, raised INR, low
platelets, bleeding disorder) drive the bleeding-risk axis. Choose the
least-alarming band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
