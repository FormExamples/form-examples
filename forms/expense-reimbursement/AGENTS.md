# Expense Reimbursement — agent instructions

Workplace expense reimbursement claim. A worker (e.g. a clinician) who paid a
work-related expense from their own money completes a single-page wizard; the
engine computes a **three-axis grade** (policy compliance, completeness,
approval tier) plus fraud-prevention and policy flags.

## Domain

Administrative, not clinical. The person is a **worker**; the handler is a
**manager** (line manager, budget holder or finance). There is no `patient` or
`clinician` table. Policy thresholds are defaults documented in
`spec/index.md`; keep them in one constants module per stack.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Axum setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.

## Scoring engine contract

Pure function over the claim returning:
`{ complianceBand, completenessPercent, approvalTier, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. Money is decimal (never binary float arithmetic across lines without
rounding to the currency's minor unit). Choose the least-alarming band only when
no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date fields.
- Bank details: store only the account name and the last four digits; never a
  full account number.

## Verify

```sh
bin/test-form expense-reimbursement
bin/test-sql-apply expense-reimbursement
```
