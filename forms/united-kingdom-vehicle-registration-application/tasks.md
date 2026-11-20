# United Kingdom Vehicle Registration Application — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Researched GOV.UK and DVLA guidance; recorded sources and assumptions in
      `doc/index.md`.
- [x] Authored `index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`, and `tasks.md`.
- [x] Authored SQL migrations in `sql/` (applicant, keeper, application, grade,
      grade rule, grade flag; UUIDv4 PKs, timestamps, CHECKs, comments).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Axum setup, changelog, examples,
      llms.txt, and skills.
- [x] Built the validation engine (HTML and Svelte) with Vitest tests.
- [x] Authored 17 personas covering every validity class and flag category.
- [x] Built `front-end-with-html` (Lily wizard + dashboard).
- [x] Built `front-end-with-svelte` (Lily wizard + dashboard; lint and format).
- [x] Built `back-end-with-axum` (Rust axum + axa JSON API) and brought it to
      fleet standard.

## To do

- [x] `bin/test-form united-kingdom-vehicle-registration-application` passes.
- [ ] Check the assumptions in `doc/index.md` against the V62, V55/4, V55/5, and
      V627/1 forms themselves.
