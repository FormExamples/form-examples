# Holter Monitor Test Result — agent instructions

Ambulatory ECG (Holter) monitor result (report). A reporting clinician completes
a single-page wizard recording the recording's **findings** and a structured
**interpretation**; the engine computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, follow-up urgency) plus safety flags, and produces a structured
ambulatory ECG report.

This is the **result/report counterpart** to `holter-monitor-test-request` (a
referral), and mirrors the `ct-scan-test-result` gold template. Keep it clean,
exemplary, and faithful to the conventions below.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `holter_monitor_test_result`; the
clinician is the report **author/signer** (cardiologist, cardiac physiologist,
other), not a referrer. The engine **interprets findings** rather than vetting a
request.

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
  (e.g. a rhythm or AF-burden category).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, rhythm summary, rate summary, findings, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **critical finding** — ventricular tachycardia, a pause > 3 seconds,
high-grade (Mobitz II / third-degree) AV block, or fast atrial fibrillation —
**auto-escalates** Axis D to *critical-alert* and raises the
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
