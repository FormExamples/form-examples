# Ottawa Ankle Rules (and Ottawa Foot Rules) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, applicability flag, eight criterion inputs,
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Decision engine** — `types.ts`, `utils.ts`, `ottawa-ankle-rules.ts`,
   `ottawa-ankle-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   ankle/foot criterion in isolation, the zone-pain precondition gating, the
   `unableToBearWeight` truth table, and the four decision combinations.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form ottawa-ankle-rules`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- This is a **decision-rule** form, not a numeric score: the engine returns two
  independent booleans (ankle, foot), never a total or a risk band. Do not add a
  points column.
- The zone-of-pain fields are **preconditions**: tenderness or inability to bear
  weight without the corresponding zone pain does **not** indicate imaging.
- `unableToBearWeight` requires **both** weight-bearing questions to be `'no'`
  (immediately after injury and now); it feeds both the ankle and foot
  decisions.
- Bedside findings are `yes`/`no` enums (default `''`) so an unanswered finding
  is distinct from a negative one; `''` is treated as negative for the decision
  but raises a data-completeness flag.
- Applicability: the rule is validated for adults (≥ 18) and assumes a reliable
  exam; age < 18 or an unreliable assessment raises a caution flag rather than
  blocking the decision.
- The wizard is short (8 steps) but must remain one continuous single-page
  wizard.
