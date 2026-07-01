# Child-Pugh Score (Child-Turcotte-Pugh) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, five parameter inputs (bilirubin, albumin, INR /
   PT prolongation, ascites enum, encephalopathy enum), timestamps; UUIDv4 PK.
   Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `child-pugh-rules.ts`,
   `child-pugh-grader.ts`, `flagged-issues.ts` with Vitest tests covering
   threshold boundaries and every class boundary.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form child-pugh-score`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- Five ordinal parameters, each 1-3; the wizard is short (8 steps) but must
  remain one continuous single-page wizard.
- Coagulation parameter accepts an INR value (preferred) or a prothrombin-time
  prolongation in seconds, so it works when only PT is reported.
- Bilirubin and albumin are captured in SI units (µmol/L, g/L); the summary may
  display conventional units (mg/dL) for reference.
- The class banding (A 5-6, B 7-9, C 10-15) fixes the survival and surgical-risk
  estimates; these are banded strings, not per-patient predictions.
- A missing parameter yields a provisional (partial) score plus a
  data-completeness flag — a valid total requires all five parameters.
