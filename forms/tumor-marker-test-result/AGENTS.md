# Tumor Marker Test Result — agent instructions

Serum tumour-marker test result (report). A reporting clinician completes a
single-page wizard recording the **measured result values** for one or more
serum tumour markers and a structured **interpretation**; the engine computes a
**four-axis interpretation grade** (result classification, abnormality severity /
structured reporting, report completeness, follow-up urgency) plus safety flags,
and produces a structured laboratory-medicine report.

This is the **result/report counterpart** to `tumor-marker-test-request` (a
referral). The gold template it mirrors is `ct-scan-test-result`.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `tumor_marker_test_result`; the clinician
is the report **author/signer** (clinical biochemist, oncologist, reporting
clinician), not a requester. Each measured marker is a `NUMERIC` value (`NULL`
when not measured), not a boolean order. The engine **interprets measured
values** in clinical context rather than vetting a request — tumour markers are
poor screening tests, so a single mildly raised value rarely means cancer.

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
  (e.g. a germ-cell-marker pattern or monitoring-trend category).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, specimen condition, measured values, comparison, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **markedly elevated** value or a **rising trend on treatment** classifies the
result as *abnormal* and escalates toward *urgent* oncology review. A **very high
AFP / beta-hCG** (suggesting a germ-cell tumour) **auto-escalates** Axis D to
*critical-alert* and raises the `critical-result-alert` flag regardless of the
other axes. Choose the least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
