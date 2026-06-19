# DEXA Bone Density Test Result — agent instructions

DEXA / DXA (dual-energy X-ray absorptiometry) bone-density result (report). A
reporting clinician completes a single-page wizard recording the performed
examination's quantitative **findings** (bone mineral density, T-scores,
Z-scores) and a structured **interpretation**; the engine computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, follow-up urgency) plus safety flags, and
produces a structured bone-densitometry report.

This is the **result/report counterpart** to `dexa-bone-density-test-request` (a
referral). Its structure, conventions, four interpretation axes, and grade
tables mirror the gold template `ct-scan-test-result`.

## Result semantics

A result form records *what the test found and what it means* — it is **not** a
referral. The source-of-truth record is `dexa_bone_density_test_result`; the
clinician is the report **author/signer** (radiologist, consultant, reporting
radiographer, rheumatologist, endocrinologist), not a referrer. The engine
**interprets findings** rather than vetting a request.

DEXA results are **quantitative**: bone mineral density (BMD) in g/cm², a
**T-score** (standard deviations from the young-adult reference mean), and a
**Z-score** (standard deviations from the age-matched mean) at each measured
site. The lowest (most negative) T-score drives the **WHO densitometric
classification** (normal / osteopenia / osteoporosis / severe osteoporosis).

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
  **carries the WHO densitometric classification** (normal / osteopenia /
  osteoporosis / severe-osteoporosis).
- **Axis C — report completeness:** 0–100 % of mandatory report sections
  (history, technique/adequacy, quantitative findings, comparison, impression).
- **Axis D — follow-up urgency:** routine / recommended / urgent / critical-alert,
  with a target timeframe and a recommended action.

### T-score → WHO classification → axes (escalation invariant)

| Lowest T-score | WHO classification | Axis A | Axis D |
| --- | --- | --- | --- |
| T ≥ −1.0 | normal | normal | routine |
| −1.0 > T > −2.5 | osteopenia | abnormal | recommended |
| T ≤ −2.5 | osteoporosis | abnormal | urgent |
| T ≤ −2.5 **with** a fragility / vertebral fracture | severe osteoporosis | abnormal/critical | critical-alert (treatment review) |

**Severe osteoporosis** (T ≤ −2.5 with a fragility or vertebral fracture) or an
identified **vertebral fracture** **auto-escalates** Axis D to *urgent /
critical-alert*, raises the `abnormal-requiring-action` / `urgent-referral`
flag, and recommends a fracture-risk treatment review regardless of the other
axes. Choose the least-urgent band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview and [`spec/`](spec) for the
living contract.
