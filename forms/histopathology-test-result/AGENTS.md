# Histopathology Test Result — agent instructions

Histopathology result (report). A reporting clinician completes a single-page
wizard recording the examined specimen's **findings** and a structured
**interpretation**; the engine computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, follow-up urgency) plus safety flags, and produces a structured
pathology report.

This is the **result/report counterpart** to `histopathology-test-request` (a
referral), and mirrors the `*-test-result` gold template `ct-scan-test-result`.

## Result semantics

A result form records *what the examination found and what it means* — it is
**not** a referral. The source-of-truth record is `histopathology_test_result`;
the clinician is the report **author/signer** (consultant histopathologist,
biomedical scientist, specialist registrar, other), not a requester. The engine
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
  (none / minor / moderate / major) plus a free `reportingCategory` label
  (an RCPath cancer-dataset grade/stage summary).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (clinical history, macroscopic, microscopic, diagnosis, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

An **unexpected malignancy**, an **involved resection margin** on a curative
resection, or any unexpected significant abnormality **auto-escalates** Axis D to
*critical-alert* and raises the `critical-result-alert` flag regardless of the
other axes. Confirmed malignancy classifies the result as abnormal (critical when
unexpected), drives urgent MDT follow-up, and raises the
`abnormal-requiring-action`, `urgent-referral`, and `unexpected-finding` flags as
applicable. Choose the least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
