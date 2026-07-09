# Blood Test Request — agent instructions

Pathology / phlebotomy blood-test order (request). A clinician completes a
single-page wizard that orders one or more blood-test **panels** (modelled as
BOOLEAN columns); the engine computes a **four-axis grading**
(appropriateness, pre-analytical / specimen safety, request completeness, triage
priority) plus safety flags, and produces a vetting report.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, preanalyticalBand,
fastingViolation, completenessPercent, triageTier + targetTimeframe,
recommendation, firedRules[], flags[] }`. Rule IDs are identical across every
front-end and the back-end. A `stat` urgency or a critical test (troponin,
d-dimer, blood culture, crossmatch) escalates triage. A fasting-required test
collected non-fasting forces `fasting_violation` and lowers the pre-analytical
band. Choose the least-alarming band only when no rule fires.

> The 1–9 appropriateness scale is **not** a single published instrument for
> bloods; it is anchored on RCPath National Minimum Retesting Intervals
> appropriateness + indication match. Treat it as decision support.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
