# Rockall Score for Upper Gastrointestinal Bleeding — plan

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
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, clinical parameter inputs (heart rate, systolic BP,
   comorbidity, age), endoscopic parameter inputs (endoscopy performed,
   diagnosis, stigmata), timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `rockall-rules.ts`,
   `rockall-grader.ts`, `flagged-issues.ts` with Vitest tests covering threshold
   boundaries and the clinical-only vs full path.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form rockall-score-for-upper-gastrointestinal-bleeding`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- Two scores share the three clinical parameters; the full score adds the two
  endoscopic parameters and is computed only when `endoscopyPerformed == 'yes'`.
- Shock is derived from heart rate and systolic BP, not entered directly:
  hypotension (SBP < 100) scores 2 and takes precedence over tachycardia
  (HR ≥ 100) scoring 1.
- Age is captured as years and mapped to bands (< 60 / 60–79 / ≥ 80) by the
  engine, so the raw value is retained for audit.
- Risk band is taken from the full score when available, otherwise the clinical
  score stands and the band is `clinical-only` (a clinical 0 is `low`).
- Missing numeric inputs score 0 for their parameter and raise a
  data-completeness flag — the score can understate risk.
- The wizard must remain one continuous single-page wizard; the endoscopy step
  reveals its two endoscopic fields only when endoscopy has been performed.
