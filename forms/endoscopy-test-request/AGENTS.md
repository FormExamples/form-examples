# Endoscopy Test Request — agent instructions

GI endoscopy procedure request (referral). A clinician completes a single-page
wizard; the engine computes a **four-axis grading** (appropriateness,
cancer-pathway urgency, request completeness, pre-procedure risk) plus safety
flags, and produces a vetting report.

## Source of truth

`sql-migrations/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, triageTier +
targetTimeframe, twoWeekWaitEligible + rationale, completenessPercent,
glasgowBlatchfordScore (0–23) + rockallScore (0–11) + riskBand +
anticoagulantAction, recommendation, firedRules[], flags[] }`. Rule IDs are
identical across every front-end and the back-end. Acute red-flags (active GI
bleeding, haemodynamic instability) auto-escalate to emergency; NICE NG12 / DG56
suspected-cancer criteria escalate to two-week-wait. Choose the least-alarming
band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
