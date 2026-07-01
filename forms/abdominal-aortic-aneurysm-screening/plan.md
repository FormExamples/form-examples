# Abdominal Aortic Aneurysm (AAA) Screening — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single screening-scan table in `sql/`: context,
   identification and eligibility, consent, ultrasound measurement, and clinical
   observation fields, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `aaa-rules.ts`,
   `aaa-grader.ts`, `flagged-issues.ts` with Vitest tests covering the diameter
   thresholds (2.9/3.0, 4.4/4.5, 5.4/5.5 cm), the non-visualised guard, every
   category, and the growth calculation.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form abdominal-aortic-aneurysm-screening`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- Classification is driven entirely by the single `maxAorticDiameterCm` value
  against three fixed thresholds (3.0 / 4.5 / 5.5 cm); bands are lower-bound
  inclusive and upper-bound exclusive.
- A non-visualised aorta must never fall through to `normal`: guard on
  `aortaVisualised == 'no'` or a null diameter and route to a re-scan.
- Growth (`current − prior` diameter) is computed only for surveillance
  re-scans where both values exist, and feeds the rapid-growth flag.
- The wizard is short (6 steps) but must remain one continuous single-page
  wizard.
- Documentation-plus-classification form: it records the scan and derives the
  action; it never makes the surgical-repair decision.
