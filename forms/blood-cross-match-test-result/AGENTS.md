# Blood Cross-Match Test Result — agent instructions

Blood cross-match / transfusion compatibility result (report). A reporting
clinician (biomedical scientist, transfusion practitioner, or consultant
haematologist) completes a single-page wizard recording the **findings** of
pre-transfusion testing — ABO/RhD group, antibody screen and identification, the
crossmatch / compatibility outcome and component availability, identity-safety
checks (two-sample rule, historical-group concordance), and special component
requirements — plus a structured **interpretation**; the engine computes a
**four-axis interpretation grade** (result classification, abnormality severity /
structured reporting, report completeness, follow-up urgency) plus safety flags,
and produces a structured transfusion-compatibility report.

This is the **result/report counterpart** to `blood-cross-match-test-request` (a
referral). Where the request asks *should we do this test, and is it safe?*, the
result records *what did the test find, and what does it mean for issue?*.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `blood_cross_match_test_result`; the
clinician is the report **author/signer** (biomedical scientist, transfusion
practitioner, consultant haematologist), not a referrer. The engine
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
  (e.g. an antibody-significance or compatibility-status category).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (clinical history, grouping, antibody screen, crossmatch, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

A **critical result** — an **incompatible crossmatch**, **clinically-significant
antibodies**, an **ABO discrepancy** (historical-group non-concordance), or an
**unmet two-sample rule** — **auto-escalates** Axis D to *critical-alert*,
classifies the result *abnormal* or *critical*, and raises the
`critical-result-alert` plus `discrepancy-with-request` flags regardless of the
other axes. Choose the least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
