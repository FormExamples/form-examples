# Toxicology Test Request — agent instructions

Toxicology / poisons / therapeutic-drug-level blood-test request (referral). A
clinician completes a single-page wizard that orders one or more toxicology
**assays** (modelled as BOOLEAN columns); the engine computes a **four-axis
grading** (appropriateness, ingestion-timing validity, request completeness,
triage priority) plus safety flags, and produces a vetting report.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate
derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
`spec.md`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Scoring engine contract

Pure function over the request returning:
`{ appropriatenessScore (1–9) + appropriatenessBand, timingBand,
completenessPercent, triageTier + targetTimeframe, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. A deliberate overdose or a symptomatic patient escalates triage to
`stat`. A paracetamol level requested with `time_since_ingestion_hours < 4`
forces `timing_band = invalid` and fires `paracetamol-timing-critical`. A
deliberate overdose fires `deliberate-self-harm-safeguarding`. Choose the
least-alarming band only when no rule fires.

> The 1–9 appropriateness scale is **not** a single published instrument for
> toxicology ordering; it is anchored on TOXBASE / NPIS indication-to-assay
> match and ingestion-timing validity. Treat it as decision support.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec.md`](spec.md)
for the living contract.
