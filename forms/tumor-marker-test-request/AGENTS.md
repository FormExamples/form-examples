# Tumor Marker Test Request — agent instructions

Serum tumour-marker blood-test request (referral). A clinician completes a
single-page wizard that orders one or more serum tumour **markers** (modelled as
BOOLEAN columns); the engine computes a **four-axis grading** (appropriateness,
interpretation safety, request completeness, urgency / triage priority) plus
safety flags, and produces a vetting report.

## Source of truth

`sql-migrations/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, interpretationBand,
completenessPercent, triageTier + targetTimeframe, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. A `two-week-wait` urgency or a CA125-for-suspected-ovarian-cancer
pattern escalates triage. A marker that does not match its indication lowers the
appropriateness band; tumour markers ordered as broad screening force the
`misuse-risk` interpretation band and an `inappropriate-screening-use` flag.
Choose the least-alarming band only when no rule fires.

> The 1–9 appropriateness scale is **not** a single published instrument for
> tumour markers; it is anchored on marker-to-indication fit per NICE
> (CA125 CG122 / NG12; PSA guidance) and ACB / RCPath tumour-marker
> recommendations. Treat it as decision support.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
