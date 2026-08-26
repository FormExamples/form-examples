# Medical Certificate of Cause of Death (MCCD) — plan

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
2. **SQL migrations** — single certificate table in `sql/`: certification
   context, deceased identification, death details, Part I causal-sequence
   lines (I(a)/I(b)/I(c) condition + interval), Part II contributory conditions,
   coroner / medical-examiner referral fields, timestamps; UUIDv4 PK. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Validation engine** — `types.ts`, `utils.ts`, `validation-rules.ts`,
   `certificate-validator.ts`, `flagged-issues.ts` with Vitest tests covering
   each validity class, coroner-referral precedence, the unacceptable-sole-cause
   set, and the illogical-sequence cases.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list +
   `/<plural>/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form medical-certificate-of-cause-of-death`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- The engine classifies (Valid / Incomplete / Refer to coroner); it does not
  compute a numeric score. `refer-to-coroner` takes precedence over completeness
  — a met referral criterion blocks issue regardless of how complete the form is.
- The unacceptable "mode of death" list (cardiac arrest, respiratory arrest,
  old age alone, organ failure without a stated cause, and similar) lives in
  `validation-rules.ts` and is normalized (lower-cased, trimmed) before matching;
  it only fires when the mode is the **sole** cause given.
- Part I must read top-down: a completed I(b) or I(c) below an empty line above
  is an illogical sequence. The underlying cause is the lowest completed line.
- Medical-examiner scrutiny is a statutory step for every non-coroner death, so
  the scrutiny flag is always raised for a non-referred certificate that has not
  yet been scrutinized — independent of the validity class.
- Wizard is 7 steps but must remain one continuous single-page wizard. Treat the
  form as a statutory instrument: precise British English, no diagnostic claims.
