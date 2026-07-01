# Ottawa Knee Rule — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, five criterion inputs (age plus four enum findings),
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Decision engine** — `types.ts`, `utils.ts`, `ottawa-knee-rules.ts`,
   `ottawa-knee-grader.ts`, `flagged-issues.ts` with Vitest tests covering the
   age boundary, each single-criterion trigger, the isolated-patellar
   distinction, and the all-absent negative case.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form ottawa-knee-rule`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- **Decision rule, not a score.** The engine returns a boolean `xrayIndicated`
  and a `decision` enum, with no numeric total. Do not introduce a summed score;
  ANY-of logic is the whole rule.
- **Isolated patellar tenderness is a two-input criterion.** It fires only when
  patellar tenderness is present **and** there is no other bony tenderness.
  Model both `patellarTenderness` and `otherBonyTenderness` inputs; do not
  collapse them into one.
- **Weight-bearing means both immediately and in the ED** (four steps). The
  single `unableToBearWeight` input must capture the compound clinical
  definition; make this explicit in the wizard help text.
- **Adults only.** Surface an applicability caution rather than blocking; the
  form does not gate on age, but the rule is validated for adults with acute
  injury.
- A missing criterion input does not fire its criterion and raises a
  data-completeness flag — the decision can understate the need for imaging.
