# Neurodiversity Adjustment Request — agent instructions

Workplace reasonable-adjustments request for neurodiversity. A worker (or a
manager on their behalf) completes a single-page wizard; the engine computes a
**four-axis grade** (Equality Act 2010 eligibility, impact / wellbeing risk,
request completeness, handling priority) plus compliance-and-wellbeing flags, and
produces a structured request. This is the **request** half of the
request/response pair with
[`neurodiversity-adjustment-response`](../neurodiversity-adjustment-response).

## Domain

UK workplace, not clinical. Anchored to ACAS
[reasonable adjustments for neurodiversity](https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity)
and the Equality Act 2010 duty to make reasonable adjustments. The person is a
**worker** (not a patient); the handler is a **manager / HR contact** (not a
clinician). A formal diagnosis is not required for the duty to apply.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.

## Scoring engine contract

Pure function over the request returning:
`{ eligibilityBand, impactBand, completenessPercent, priorityTier +
targetTimeframe, recommendation, firedRules[], flags[] }`. Rule IDs are identical
across every front-end and the back-end. A substantial and long-term adverse
effect drives eligibility; being at risk of absence / burnout drives the impact
axis and auto-escalates the priority tier. Choose the least-alarming band only
when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.
- Neurodivergence details are special category (health) data — process with
  consent and a lawful basis.

See [`index.md`](index.md) for the domain overview.
