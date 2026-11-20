# United States Marriage License Application — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs, SQL, generated representations,
both front-ends, the Axum JSON API, `CHANGELOG.md`, and `examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions, research notes. Done.
2. **SQL migrations** — `applicant`, `county_clerk`, the main application table,
   and the grade triad. Done.
3. **Generated representations** — XML, FHIR R5, protobuf, OpenAPI, Axum setup. Done.
4. **HTML front-end** — wizard, dashboard, engine, personas. Done.
5. **SvelteKit front-end** — engine port with vitest tests. Done.
6. **Axum back-end** — relational crate on the fleet standard. Done.
7. **Later** — more states in `STATE_RULES` (each with a cited source), county fee
   schedules, and a remote-appearance rule per state.
