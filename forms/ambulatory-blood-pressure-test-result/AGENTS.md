# Ambulatory Blood Pressure Test Result — agent instructions

Ambulatory blood pressure monitoring (ABPM) result (report). A reporting
clinician completes a single-page wizard recording a 24-hour ABPM (or home
blood pressure monitoring) period's averaged **findings** and a structured
**interpretation**; the engine computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, follow-up urgency) plus safety flags, and produces a structured
report.

This is the **result/report counterpart** to `ambulatory-blood-pressure-test-request`
(a referral). It mirrors the gold template `ct-scan-test-result`.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `ambulatory_blood_pressure_test_result`;
the clinician is the report **author/signer** (GP, cardiologist, nurse,
pharmacist, reporting-clinician), not a referrer. The engine **interprets the
averaged blood pressures** rather than vetting a request.

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
  (the hypertension stage: normotensive / stage 1 / stage 2 / severe).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, averages, dipping, findings, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

**Severe hypertension** (ABPM average ≥150/95 mmHg, equivalent to clinic
≥180/120 mmHg) **auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes (NICE NG136 same-day
specialist review). Choose the least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
