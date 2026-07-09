# Colonoscopy Test Request — agent instructions

Lower-GI endoscopy (colonoscopy) procedure request (referral). A clinician
completes a single-page wizard; the engine computes a **four-axis grading**
(appropriateness, cancer-pathway urgency, request completeness, pre-procedure
risk) plus safety flags, and produces a vetting report.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, triageTier +
targetTimeframe, twoWeekWaitEligible + rationale, completenessPercent,
riskBand + anticoagulantAction, recommendation, firedRules[], flags[] }`. Rule
IDs are identical across every front-end and the back-end. A positive FIT
(≥10 µg Hb/g, NICE DG56) or a NICE NG12 lower-GI red-flag combination escalates
to two-week-wait; an acute emergency presentation auto-escalates to emergency.
Choose the least-alarming band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
