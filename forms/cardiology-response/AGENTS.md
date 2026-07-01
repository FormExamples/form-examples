# Cardiology Response — agent instructions

Cardiology response (consult reply). A cardiology clinician completes a
single-page wizard in answer to a cardiology referral; the engine computes a
**four-axis interpretation grade** (response classification, condition severity,
response completeness, follow-up urgency) plus safety flags, and produces a
structured response letter. This is the **response** half of the request/response
pair with [`cardiology-request`](../cardiology-request).

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.

## Scoring engine contract

Pure function over the response returning:
`{ responseClassification, severity + severityCategory, completenessPercent,
followUpUrgency + targetTimeframe + recommendedAction, recommendation,
firedRules[], flags[] }`. Rule IDs are identical across every front-end and the
back-end. A critical result (critical arrhythmia, severe symptomatic aortic
stenosis, acute coronary syndrome) auto-escalates the follow-up urgency to
critical-alert and raises the `critical-finding` flag. Choose the least-urgent
band only when no rule fires.

## Conventions

- camelCase in TypeScript / front-end serde; snake_case in SQL.
- Empty string `''` for unanswered text / enum; `null` for unanswered numeric /
  date / time.
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table.
- Single continuous single-page wizard — no multi-page forms.

See [`index.md`](index.md) for the clinical overview.
