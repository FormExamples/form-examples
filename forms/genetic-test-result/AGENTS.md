# Genetic Test Result — agent instructions

Genetic / genomic test result (report). A reporting clinician completes a
single-page wizard recording the performed test's **findings** (detected
variants and their ACMG/AMP-ACGS classification) and a structured
**interpretation**; the engine computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, follow-up urgency) plus safety flags, and produces a structured
genomic report.

This is the **result/report counterpart** to `genetic-test-request` (a
referral). It mirrors the gold-template `ct-scan-test-result` layout, SQL
conventions, four interpretation axes, and grade-rule / grade-flag categories.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `genetic_test_result`; the clinician is
the report **author/signer** (clinical geneticist, genetic counsellor, clinical
scientist), not a referrer. The engine **interprets findings** rather than
vetting a request.

## ACMG/AMP variant classification

Variants are classified on the ACMG/AMP (ACGS) five-tier scale: pathogenic,
likely-pathogenic, variant-uncertain-significance, likely-benign, benign — plus
no-variant-detected for a negative result. The classification drives the grade:

- **Pathogenic / likely-pathogenic** actionable variant → result classification
  *abnormal* or *critical*, Axis D *urgent / critical-alert*, with urgent
  genetics MDT / counselling and cascade-testing flags.
- **VUS** → result classification *inconclusive*, follow-up *recommended*
  (re-contact / reclassification), VUS flag.
- **Benign / likely-benign / no-variant-detected** → *normal* / *none* /
  *routine*.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts (XML, FHIR R5, protobuf, TypeSpec, OpenAPI, Loco setup, examples,
`spec/`, `CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit
generated files.

## Four-axis grading contract

Pure function over the result returning:
`{ resultClassification, abnormalitySeverity + reportingCategory,
reportCompletenessPercent, followUpUrgency + targetTimeframe +
recommendedAction, recommendation, firedRules[], flags[] }`. Rule IDs are
identical across every front-end and the back-end.

- **Axis A — result classification:** normal / abnormal / critical / inconclusive.
- **Axis B — severity & structured reporting:** abnormalitySeverity
  (none / minor / moderate / major) plus a free `reportingCategory` ACMG class
  label.
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (clinical history, test details, variants, interpretation, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **pathogenic / likely-pathogenic actionable variant** (or a secondary
actionable finding) **auto-escalates** Axis D to *urgent / critical-alert* and
raises the `critical-result-alert` / `pathogenic-variant-found` flags regardless
of the other axes. Choose the least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
