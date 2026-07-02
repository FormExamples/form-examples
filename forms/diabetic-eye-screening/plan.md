# Diabetic Eye Screening record — plan

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
2. **SQL migrations** — single screening table in `sql/`: grading context and
   patient identification fields, a right-eye and left-eye grading block
   (R grade, M grade, P marker, U marker, visual acuity), previous-screen
   fields, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Grading engine** — `types.ts`, `utils.ts`, `des-rules.ts`, `des-grader.ts`,
   `flagged-issues.ts` with Vitest tests covering every R grade, both M grades,
   the U and P markers, worst-eye selection across mismatched eyes, and each
   recall / referral pathway.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/diabetic-eye-screenings/` list +
   `/diabetic-eye-screenings/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form diabetic-eye-screening`, Lily drift checks, spec
   / changelog drift checks.

## Design notes

- Two graded eyes; each eye is R grade + M grade + P marker + U marker. The
  wizard has a right-eye step and a left-eye step so the two are graded
  independently before the worst-eye outcome is computed.
- Outcome is worst-eye across both eyes, resolved by clinical urgency
  (`R3A` > referable `M1`/`R3S` > ungradable > `R2` surveillance > routine
  recall). The most urgent applicable pathway wins.
- Low-risk 24-monthly recall is only offered when this and the previous screen
  are both `R0`/`M0`; otherwise routine recall is 12-monthly.
- Ungradable is a per-eye marker, not a retinopathy level: an ungradable eye
  contributes no R grade and routes to slit-lamp biomicroscopy unless the other
  eye already routes to HES.
- `P` (photocoagulation) is contextual and never changes the pathway by itself.
