# Epilepsy Annual Review — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built (2026-07-02): foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`, Lily-clean); and the `back-end-with-loco` Rust
JSON-API crate. `CHANGELOG.md` and `examples/` are in place.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single review table in `sql/`: context and epilepsy
   profile, seizure and medication fields, risk / safety / review-domain fields,
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `review-rules.ts`,
   `review-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   seizure-control class, each completeness grade, and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form epilepsy-review`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- This is a **documentation-completeness and control-classification** form, not a
  numeric score: the engine emits a seizure-control class, a completeness grade,
  and flags — no total points.
- Seizure control is worst-finding: an increasing trend, weekly/daily frequency,
  or any status epilepticus classifies as `uncontrolled` regardless of other
  fields.
- The valproate / pregnancy-prevention, folic acid, and contraception domains are
  **conditional** — required for completeness and eligible to fire flags only
  when `womanOfChildbearingPotential == 'yes'`.
- Safety flags mirror the NICE NG217 / MHRA / DVLA safety priorities: specialist
  review, urgent valproate PPP, status epilepticus, DVLA driving, mental health,
  SUDEP documentation.
- The wizard must remain one continuous single-page wizard.
