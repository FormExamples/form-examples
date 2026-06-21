# Colonoscopy Test Result — agent instructions

Colonoscopy procedure result (report). A reporting clinician (endoscopist)
completes a single-page wizard recording the performed procedure's **findings**
and a structured **interpretation**; the engine computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, follow-up urgency) plus safety flags, and
produces a structured endoscopy report.

This is the **result/report counterpart** to `colonoscopy-test-request` (a
referral), modelled on the `ct-scan-test-result` gold template. Keep it clean and
faithful to the conventions below.

## Result semantics

A result form records *what the procedure found and what it means* — it is **not**
a referral. The source-of-truth record is `colonoscopy_test_result`; the
clinician is the report **author/signer** (endoscopist: gastroenterologist,
colorectal-surgeon, nurse-endoscopist, other), not a referrer. The engine
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
  (e.g. a BSG / ACPGBI / PHE polyp-surveillance risk band).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, procedure / extent, findings, impression, follow-up).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **critical finding** (obstructing or suspicious mass, perforation)
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes — typically an urgent
MDT / colorectal-surgical referral. Choose the least-urgent band only when no
rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
