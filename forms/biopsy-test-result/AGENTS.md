# Biopsy Test Result — agent instructions

Biopsy histopathology result (report). A reporting clinician completes a
single-page wizard recording the examined specimen's **diagnosis** and a
structured **interpretation**; the engine computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, follow-up urgency) plus safety flags, and produces a
structured histopathology report.

This is the **result/report counterpart** to `biopsy-test-request` (a referral),
and mirrors the `ct-scan-test-result` gold template. Keep it faithful to the
conventions below.

## Result semantics

A result form records *what the specimen showed and what it means* — it is
**not** a referral. The source-of-truth record is `biopsy_test_result`; the
clinician is the report **author/signer** (consultant histopathologist,
cytopathologist, specialist registrar, biomedical scientist), not a referrer.
The engine **interprets the diagnosis** rather than vetting a request.

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
  (none / minor / moderate / major) plus a free `reportingCategory` label
  (e.g. an RCPath cancer-dataset or TNM8 category). Histological grade drives
  the severity weight.
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, macroscopic, microscopic, diagnosis, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

`malignancy_present`, an unexpected malignancy, or an **involved** resection
margin **auto-escalates** Axis D to *critical-alert* / *urgent MDT* and raises
the `critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
