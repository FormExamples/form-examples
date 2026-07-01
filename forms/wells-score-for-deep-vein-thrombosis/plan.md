# Wells Score for Deep Vein Thrombosis (DVT) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, nine criterion inputs, alternative-diagnosis input,
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `wells-dvt-rules.ts`,
   `wells-dvt-grader.ts`, `flagged-issues.ts` with Vitest tests covering the
   two-level and three-level boundaries, the `−2` adjustment, and the −2 / 9
   extremes.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form wells-score-for-deep-vein-thrombosis`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- The wizard is a short (6 steps) but must remain one continuous single-page
  wizard.
- Each criterion is a `yes` / `no` / `''` enum; only `yes` scores. The
  alternative-diagnosis criterion subtracts 2, so the total can be negative
  (range −2 to 9).
- The two-level band (≥ 2 likely / ≤ 1 unlikely) drives the recommended
  investigation and is the primary NICE pathway; the three-level band
  (low / moderate / high) is recorded for continuity with the original rule.
- A blank criterion scores 0 and raises a data-completeness flag — the total can
  understate or overstate probability, so completeness matters.
