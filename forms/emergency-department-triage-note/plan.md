# Emergency Department Triage Note — plan

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
2. **SQL migrations** — single triage table in `sql/`: context, arrival,
   identification, presenting complaint, vital signs, pain, and discriminator
   flags; timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `triage-rules.ts`,
   `triage-grader.ts`, `flagged-issues.ts` with Vitest tests covering each MTS
   level 1–5, NEWS2 escalation thresholds, pain-score bands, and the
   "highest discriminator wins" selection.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form emergency-department-triage-note`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- This is a **classification** form: the engine selects the most urgent MTS level
  justified by the findings; it never sums a numeric total. "Highest
  discriminator wins."
- Each level maps to a fixed colour, name, and target time (0 / 10 / 60 / 120 /
  240 minutes) — these are constants, not computed.
- NEWS2 is a *supporting* aggregate: it can escalate the category (≥ 7 or any
  parameter 3 → at least Level 2; 5–6 → at least Level 3) but never de-escalates.
- Missing vital signs are treated as *not measured* — they never lower the
  category and always raise a data-completeness flag.
- Paediatric red-flag discriminators are recognized, but paediatric early-warning
  scoring (PEWS) is out of scope.
- The wizard must remain one continuous single-page wizard (8 steps).
