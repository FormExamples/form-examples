# SOAP Note — plan

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
2. **SQL migrations** — single note table in `sql/`: encounter-context and
   identification fields, the four SOAP sections' fields, the red-flag and
   abnormal-vitals flags, safety-netting, free-text note, timestamps; UUIDv4 PK.
   Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Completeness engine** — `types.ts`, `utils.ts`, `validation-rules.ts`,
   `note-validator.ts`, `flagged-issues.ts` with Vitest tests covering each
   status boundary (Complete / Partial / Incomplete), the conditional
   safety-netting and follow-up requirements, and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form soap-note`, Lily drift checks, spec / changelog
   drift checks.

## Design notes

- This is a **documentation/completeness** form, not a numeric clinical score.
  "Present" is detected by a non-empty field, not by semantic analysis of the
  free-text content — the engine grades the *record*, not the *care*.
- Assessment and Plan are the two **critical** sections: if either is missing the
  note is **Incomplete** regardless of the other sections.
- Safety-netting and follow-up are **conditionally required** — they only count
  toward the completeness tally when the encounter triggers them (red-flag
  symptoms present / a plan is recorded), so short well-documented notes are not
  penalised for components that do not apply.
- Keep the wizard one continuous single-page wizard (7 steps); the four SOAP
  sections map to steps 3–6 with context and summary either side.
