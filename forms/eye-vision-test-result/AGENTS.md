# Eye Vision Test Result — agent instructions

Ophthalmic / optometric eye examination result (report). A reporting clinician
completes a single-page wizard recording the performed test's **findings** and a
structured **interpretation**; the engine computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, follow-up urgency) plus safety flags, and produces a
structured ophthalmic report.

This is the **result/report counterpart** to `eye-vision-test-request` (a
referral). It mirrors the conventions of the gold result template
`ct-scan-test-result`.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `eye_vision_test_result`; the clinician
is the report **author/signer** (ophthalmologist, optometrist, orthoptist,
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
  (e.g. an NHS diabetic eye screening grade such as R2M1).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, measurements, findings, impression, follow-up).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **critical finding** (sudden visual loss, acutely raised intraocular pressure,
signs of giant cell arteritis, retinal detachment, proliferative diabetic
retinopathy) **auto-escalates** Axis D to *critical-alert*, sets the
recommendation to *urgent-review* (urgent ophthalmology), and raises the
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
