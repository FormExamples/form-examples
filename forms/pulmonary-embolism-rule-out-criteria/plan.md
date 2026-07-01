# Pulmonary Embolism Rule-out Criteria (PERC) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, the pre-test probability gate, the eight criterion
   inputs, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `perc-rules.ts`,
   `perc-grader.ts`, `flagged-issues.ts` with Vitest tests covering threshold
   boundaries (age 49/50, HR 99/100, SpO₂ 94/95), each criterion failing in
   isolation, the all-satisfied case, and the not-low pre-test override.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form pulmonary-embolism-rule-out-criteria`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- The output is a **binary classification** (PERC-negative / PERC-positive), not
  a numeric score. Do not model it as a count — it is a boolean conjunction where
  one failed criterion is decisive.
- PERC is **only applicable** when the clinician's gestalt pre-test probability is
  low. The wizard gates on this: a `not-low` pre-test probability forces
  PERC-positive and the summary states the criteria are informational only.
- A missing criterion input is treated as **failed** (the reassuring state must be
  positively documented), so an incomplete assessment errs toward PERC-positive
  and raises a data-completeness flag — it never silently rules out PE.
- Criterion 1 (age) derives from the shared `age` identification field rather than
  a separate criterion input.
- The wizard is short (6 steps) but must remain one continuous single-page wizard.
