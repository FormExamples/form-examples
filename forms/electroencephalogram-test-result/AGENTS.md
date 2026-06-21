# Electroencephalogram Test Result — agent instructions

EEG (electroencephalogram) result (report). A reporting clinician completes a
single-page wizard recording the performed recording's **findings** and a
structured **interpretation**; the engine computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, follow-up urgency) plus safety flags, and produces a
structured neurophysiology report.

This is the **result/report counterpart** to `electroencephalogram-test-request`
(a referral). Its layout and conventions mirror the gold template
`ct-scan-test-result`.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `electroencephalogram_test_result`; the
clinician is the report **author/signer** (neurologist, clinical
neurophysiologist, physiologist), not a referrer. The engine **interprets
findings** rather than vetting a request.

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
  (e.g. a SCORE category or epileptiform-classification label).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, technique, comparison, findings, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **critical finding** — status epilepticus (including non-convulsive status), a
recorded seizure, or frequent epileptiform discharges — **auto-escalates** Axis D
to *critical-alert*, classifies the result *critical* on Axis A, and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
