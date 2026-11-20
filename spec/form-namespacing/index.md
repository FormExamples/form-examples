# Form namespacing

Each form subproject is fully namespaced by its slug. A form's names never
collide with another form's names. Any form's SQL, HTTP API, and front-end
routes can therefore be combined with every other form's in one database,
one API gateway, or one site without renaming.

The slug is the form's directory name under `forms/`, in kebab-case, for
example `pre-operative-assessment-by-clinician`. Its snake_case form, for
example `pre_operative_assessment_by_clinician`, comes from
[`forms.tsv`](../../forms.tsv).

## Requirements

Examples use the form `forms/pre-operative-assessment-by-clinician/`.

### SQL tables

Every table that `forms/<slug>/sql/` creates starts with the slug in
snake_case:

- `pre_operative_assessment_by_clinician` (the main table)
- `pre_operative_assessment_by_clinician_patient`
- `pre_operative_assessment_by_clinician_clinician`
- `pre_operative_assessment_by_clinician_grade`,
  `pre_operative_assessment_by_clinician_grade_rule`,
  `pre_operative_assessment_by_clinician_grade_flag`

The prefix applies to every table, including shared-shape entities such as
`patient`, `clinician`, `practitioner`, `allergy` and `medication`. It also
applies to the names derived from tables: indexes, constraints, triggers,
sequences, and the foreign-key columns that name a table.

### Axum back-end API routes

Every HTTP route that `forms/<slug>/back-end-with-axum/` serves for the
form's domain starts with `/api/<slug>/`:

- `/api/pre-operative-assessment-by-clinician/patients`
- `/api/pre-operative-assessment-by-clinician/patients/{id}`
- `/api/pre-operative-assessment-by-clinician/grades`

Only the crate's operational routes stay outside the namespace. These are
the axa health checks (`/_health/*`) and the served OpenAPI document. The
served OpenAPI document moves to `/api/<slug>/openapi.yaml`.

`openapi/combined/openapi.yaml` documents the same namespaced paths, and
`bin/openapi/generate-openapi-combined.py --check` keeps the two in step.

### Svelte front-end routes

Every page route in `forms/<slug>/front-end-with-svelte/` starts with
`/<slug>/`. The route tree lives under `src/routes/<slug>/`:

- `/pre-operative-assessment-by-clinician/` (the welcome page)
- `/pre-operative-assessment-by-clinician/pre-operative-assessments-by-clinician/`
- `/pre-operative-assessment-by-clinician/pre-operative-assessments-by-clinician/[id]`

Only SvelteKit's own root files (`src/routes/+layout.svelte`,
`+page.svelte`, `+server.ts` and similar) may sit at the root, and they only
redirect to or wrap `/<slug>/`.

## Conformance

The fleet had 379 forms when this spec was written (2026-11-20). Their status:

| Layer | Conforming | Notes |
| --- | --- | --- |
| Svelte routes | 379 / 379 | Already nested under `src/routes/<slug>/` (`bin/route-svelte-layout`) |
| Axum API routes | 379 / 379 | Moved from `/api/<plural>` by `bin/axum-api-namespace` (2026-11-20) |
| SQL tables | 3 / 379 | 376 forms create unprefixed tables, most often `patient`, `clinician`, `practitioner`, `grade`, `grading_fired_rule`, `grading_additional_flag`, `assessment` |

New forms must conform from the start. `cargo run -- generate scaffold --api`
emits un-namespaced `.prefix("api/<plural>/")` routes, so run
`bin/axum-api-namespace <slug>` on a newly scaffolded crate. Its `--check`
mode is the CI drift detector for the API layer.

The SQL tables still need a fleet-wide migration tool with a `--check` CI
drift detector, following the same pattern as the other `bin/axum-*` tools.
Renaming a SQL table has knock-on effects, and the migration must carry each
one in step:

- the generated XML, FHIR, protobuf and OpenAPI representations;
- the Axum crate's migrations, entities, controllers and tests;
- `examples/assessment.json`, which `bin/test-examples-conformance` checks;
- `examples/personas.json`;
- the HTML and Svelte API clients.

## Verification

- `bin/test-sql-apply <slug>` and a check that every `CREATE TABLE` name
  starts with the snake_case slug.
- `bin/axum-api-namespace --check <slug>`, the CI drift detector for the
  API routes.
- `bin/openapi/generate-openapi-combined.py --check <slug>`, with every
  domain path under `/api/<slug>/`.
- `bin/test-axum-routes`, and the crate's `cargo test`.
- A check that `front-end-with-svelte/src/routes/` contains only `<slug>/`
  and SvelteKit root files.
