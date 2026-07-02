# Nursing Care Plan — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`); the Loco JSON-API back-end; and `CHANGELOG.md` +
`examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — relational schema in `sql/`: parent `nursing_care_plan`
   table plus child `nursing_care_plan_problem`, `nursing_care_plan_goal`,
   `nursing_care_plan_intervention` tables (one migration + one entity per table),
   UUIDv4 PKs, FK links, `created_at` / `updated_at` / `deleted_at`. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Completeness engine** — `types.ts`, `utils.ts`, `validation-rules.ts`,
   `care-plan-validator.ts`, `flagged-issues.ts` with Vitest tests covering each
   problem class, each plan status, the percent calculation (incl. empty-plan),
   and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema mirroring the SQL.
7. **Verify** — `bin/test-form nursing-care-plan`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- This is a **completeness** form, not a scored instrument: the engine returns a
  status (Complete / Partial / Incomplete) and a completeness percent, not a
  numeric grade. Keep the engine pure and side-effect-free.
- The parent/child shape is genuinely relational — problems, goals, and
  interventions are separate tables. Do not collapse them into a JSONB column.
- Completeness is driven by the presence of the three care-process elements
  (goal, intervention, evaluation) per problem; flags are raised independently and
  do not change the percent (but a high-priority flag downgrades a plan from
  Complete to Partial).
- The referenced risk assessments (falls, pressure ulcer, VTE, MUST) are recorded
  as done/level/date/actioned only — this form references them, it does not
  replace the specialist tools.
- The wizard must remain one continuous single-page wizard even though several
  steps repeat per problem.
