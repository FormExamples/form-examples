# Mammography Test Result — agent instructions

Breast mammography result (report). A reporting clinician completes a
single-page wizard recording the performed examination's **findings** and a
structured **interpretation** — centred on the ACR **BI-RADS** final assessment
category; the engine computes a **four-axis interpretation grade** (result
classification, abnormality severity / structured reporting, report
completeness, follow-up urgency) plus safety flags, and produces a structured
breast-imaging report.

This is the **result/report counterpart** to `mammography-test-request` (a
referral). Mammography is the classic BI-RADS use case.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `mammography_test_result`; the clinician
is the report **author/signer** (radiologist, consultant, reporting
radiographer), not a referrer. The engine **interprets findings** rather than
vetting a request.

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
  (none / minor / moderate / major) plus a free `reportingCategory` label that
  carries the BI-RADS final assessment category.
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, technique/adequacy, comparison, findings, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

### BI-RADS → axes mapping (the key rule)

The BI-RADS final assessment category (`bi_rads_category`) drives Axis A and
Axis D: **1–2** = normal / routine; **3** = abnormal / recommended short-interval
follow-up; **4a/4b** = abnormal / urgent biopsy referral; **4c/5** = critical /
urgent biopsy referral; **0** = inconclusive / further-imaging; **6** = abnormal,
known malignancy. A **BI-RADS 4 or 5** assessment **auto-escalates** Axis D and
raises the `abnormal-requiring-action` / `urgent-referral` flags regardless of
the other axes. Choose the least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
