# Neurodiversity Adjustment Response — agent instructions

Workplace reasonable-adjustments response for neurodiversity. An employer (line
manager, HR, or occupational health) completes a single-page wizard; the engine
computes a **four-axis grade** (outcome classification, legal / discrimination
risk, response completeness, follow-up / review urgency) plus compliance-and-risk
flags, and produces a structured confirmation-and-review record. This is the
**response** half of the request/response pair with
[`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request).

## Domain

UK workplace, not clinical. Anchored to ACAS reasonable-adjustments guidance
(confirmation + review templates) and the Equality Act 2010 duty to make
reasonable adjustments. The person is a **worker**; the author is a **manager /
HR contact** (the decision-maker). This form is retrospective — it records a
decision and its legal risk, not a triage of a request.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.

## Scoring engine contract

Pure function over the response returning:
`{ outcomeClassification, legalRiskBand, completenessPercent, followUpUrgency +
targetTimeframe, recommendation, firedRules[], flags[] }`. Rule IDs are identical
across every front-end and the back-end. Declining adjustments for a worker
likely covered by the Equality Act without an adequate reasonableness
justification or alternatives drives the legal-risk axis to high-risk, raises the
`discrimination-risk` flag, and auto-escalates follow-up urgency. Choose the
least-alarming band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.
- Neurodivergence details are special category (health) data — process with
  consent and a lawful basis.

See [`index.md`](index.md) for the domain overview.
