# Ward Round Note — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single note table in `sql/`: review-header and
   identification fields, the ten review-component fields, timestamps; UUIDv4
   PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Completeness engine** — `types.ts`, `utils.ts`, `validation-rules.ts`,
   `note-validator.ts`, `flagged-issues.ts` with Vitest tests covering each
   status boundary (complete / partial / incomplete) and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/ward-round-notes/` list +
   `/ward-round-notes/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form ward-round-note`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- This is a **completeness / documentation** form, not a numeric score. The
  engine grades whether required components are documented, not clinical
  severity.
- Explicit negative flags ("no events overnight", "no changes", "none
  outstanding", "not yet estimable") count as documented — a deliberate negative
  is a valid, auditable clinical record and must not downgrade the status.
- `partial` requires the review header **and** the plan to be present: an entry
  with no attributable clinician or no plan is treated as `incomplete`
  regardless of how many other components are filled.
- Flags are safety signals computed independently of the status — a `complete`
  entry can still raise a high-priority deteriorating-NEWS2 flag.
- One note records one review; a patient accrues one note per ward round. The
  wizard stays one continuous single-page wizard (11 steps).
