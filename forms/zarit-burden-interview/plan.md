# Zarit Burden Interview (ZBI) — plan

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
2. **SQL migrations** — single assessment table in `sql/`: context and subject
   fields, the 22 integer item ratings, the `instrument_form` selector, and
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `zarit-rules.ts`,
   `zarit-grader.ts`, `flagged-issues.ts` with Vitest tests covering the band
   boundaries, the all-0 / all-4 extremes, missing-item handling, and both
   instrument forms.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form zarit-burden-interview`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- The 22 item ratings are the bulk of the wizard; group them on a single step
  (step 4) as a repeated 0–4 frequency scale, keeping one continuous single-page
  wizard.
- `instrumentForm` selects the active item set: ZBI-22 scores all 22 items
  (0–88); ZBI-12 scores the short-form subset (0–48, high-burden cut-off ≥ 17).
  Store all 22 ratings regardless so a ZBI-12 record can be re-scored later.
- Band boundaries are applied as disjoint ranges (0–21 / 22–40 / 41–60 / 61–88)
  so every total maps to exactly one band.
- Item 22 is the global burden item and drives the carer mental-health and
  high-global-burden flags independently of the total.
- A missing item rating scores 0 and raises a data-completeness flag — the total
  can understate burden.
