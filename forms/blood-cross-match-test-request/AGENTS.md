# Blood Cross-Match Test Request — agent instructions

Blood cross-match / transfusion compatibility request (referral). A clinician
completes a single-page wizard; the engine computes a **four-axis grading**
(appropriateness, identity / sample safety, request completeness, triage
priority) plus safety flags, and produces a vetting report.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, identitySafetyBand,
completenessPercent, triageTier + targetTimeframe, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. Red-flags (declared major / massive haemorrhage, haemodynamic
instability, active uncontrolled bleeding) auto-escalate the triage tier.
Choose the least-alarming band only when no rule fires.

The 1–9 appropriateness axis has **no single published transfusion-ordering
score**; it is anchored on NICE NG24 restrictive thresholds and indication
appropriateness, and must be labelled as such.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
