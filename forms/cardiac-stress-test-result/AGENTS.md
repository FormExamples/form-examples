# Cardiac Stress Test Result — agent instructions

Cardiac stress / exercise test result (report). A reporting clinician completes
a single-page wizard recording the performed stress test's **findings** and a
structured **interpretation**; the engine computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, follow-up urgency) plus safety flags, and produces a
structured cardiology report.

This is the **result/report counterpart** to `cardiac-stress-test-request` (a
referral). It mirrors the `ct-scan-test-result` gold template's layout and
conventions. Keep it clean, exemplary, and faithful to the conventions below.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `cardiac_stress_test_result`; the
clinician is the report **author/signer** (cardiologist, cardiac physiologist,
consultant, registrar, reporting-clinician), not a referrer. The engine
**interprets findings** rather than vetting a request.

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
  (none / minor / moderate / major) plus a free `reportingCategory` risk label
  (e.g. a Duke-treadmill-score risk band: low / intermediate / high risk).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, protocol, haemodynamic response, findings, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **critical result** — a strongly positive test, exertional hypotension,
ischaemia induced at low workload, or a high-risk Duke treadmill score —
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
