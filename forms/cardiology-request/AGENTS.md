# Cardiology Request — agent instructions

Cardiology referral / consult request (referral into cardiology). A clinician
completes a single-page wizard; the engine computes a **four-axis grading**
(referral appropriateness, safety / red-flag, request completeness, triage
priority) plus safety flags, and produces a vetting report. This is the
**request** half of the request/response pair with
[`cardiology-response`](../cardiology-response).

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessBand, safetyBand, completenessPercent, triageTier +
targetTimeframe, recommendation, firedRules[], flags[] }`. Rule IDs are
identical across every front-end and the back-end. Red flags (suspected acute
coronary syndrome, exertional syncope, new-onset heart failure) drive the safety
axis and auto-escalate the triage tier. Choose the least-alarming band only when
no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview.
