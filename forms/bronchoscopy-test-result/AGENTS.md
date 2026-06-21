# Bronchoscopy Test Result — agent instructions

Bronchoscopy (airway endoscopy) result (procedure report). An operating clinician
completes a single-page wizard recording the performed procedure's **findings**
and a structured **interpretation**; the engine computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, follow-up urgency) plus safety flags, and
produces a structured bronchoscopy report.

This is the **result/report counterpart** to `bronchoscopy-test-request` (a
referral). It mirrors the conventions of the gold template
`ct-scan-test-result`.

## Result semantics

A result form records *what the procedure found and what it means* — it is
**not** a referral. The source-of-truth record is `bronchoscopy_test_result`; the
clinician is the report **author/signer** (respiratory physician, thoracic
surgeon, other operating clinician), not a referrer. The engine **interprets
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
  (e.g. a lung-cancer-pathway or endobronchial-findings category).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, procedure / extent, findings, samples, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **critical finding** (suspected endobronchial tumour, massive haemoptysis,
procedural pneumothorax) **auto-escalates** Axis D to *critical-alert*, raises the
`critical-result-alert` flag, and triggers an urgent lung-cancer MDT referral
where appropriate, regardless of the other axes. Choose the least-urgent band
only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
