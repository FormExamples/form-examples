# Neurodiversity Adjustment Review — agent instructions

Workplace reasonable-adjustments review for neurodiversity. A manager / HR
contact completes a single-page wizard with the worker; the engine computes a
**four-axis grade** (overall effectiveness, wellbeing risk, review completeness,
next-step urgency) plus review flags, and produces a structured review record.
This is the **review** third of the ACAS cycle with
[`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request) and
[`neurodiversity-adjustment-response`](../neurodiversity-adjustment-response).

## Domain

UK workplace, not clinical. Anchored to ACAS reasonable-adjustments guidance
(review template) and the Equality Act 2010 principle that adjustments must be
reviewed regularly. The person is a **worker**; the author is a **manager / HR
contact** (the reviewer). Retrospective — it interprets effectiveness and
outcomes, not eligibility or a decision.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts with the repo generators in `bin/` — never hand-edit generated files.

## Scoring engine contract

Pure function over the review returning:
`{ effectivenessBand, wellbeingRiskBand, completenessPercent, nextStepUrgency +
targetTimeframe, recommendation, firedRules[], flags[] }`. Rule IDs are identical
across every front-end and the back-end. Any adjustment reported not-working, a
dissatisfied worker, declining wellbeing, or an escalation drives the
wellbeing-risk axis and next-step urgency and raises the corresponding flag.
Choose the least-alarming band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.
- Neurodivergence details are special category (health) data.

See [`index.md`](index.md) for the domain overview.
