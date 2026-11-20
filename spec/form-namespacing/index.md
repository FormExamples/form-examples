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

Examples use the form `forms/pre-operative-assessment-by-clinician/`:

| Subproject directory | Every name starts with |
| --- | --- |
| `sql/` | `pre_operative_assessment_by_clinician.` (the form's schema), e.g. `pre_operative_assessment_by_clinician.patient` |
| `back-end-with-axum/` | `/api/pre-operative-assessment-by-clinician/`, e.g. `/api/pre-operative-assessment-by-clinician/patients` |
| `front-end-with-svelte/` | `/pre-operative-assessment-by-clinician/`, e.g. `/pre-operative-assessment-by-clinician/pre-operative-assessments-by-clinician/` |

So every data table's fully qualified name starts with the form's snake-case
slug. The separator is the schema's `.`, not `_`, so that table names stay
unique within PostgreSQL's 63-character limit (see below and
[`spec/postgresql-name-length/`](../postgresql-name-length/)).

### SQL schema

Every table, function and domain that `forms/<slug>/sql/` creates lives in
a Postgres schema named for the form: the slug in snake_case.
`sql/00_create_schema.sql` creates it, and every other file qualifies its
names with it:

```sql
CREATE SCHEMA IF NOT EXISTS pre_operative_assessment_by_clinician;

CREATE TABLE pre_operative_assessment_by_clinician.patient (...);
CREATE TABLE pre_operative_assessment_by_clinician.patient_medication (
    ...
    patient_id UUID NOT NULL
        REFERENCES pre_operative_assessment_by_clinician.patient(id),
    ...
);
COMMENT ON COLUMN pre_operative_assessment_by_clinician.patient.id IS '...';
CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON pre_operative_assessment_by_clinician.patient
    FOR EACH ROW
    EXECUTE FUNCTION pre_operative_assessment_by_clinician.set_updated_at();
```

Table names inside the schema stay short (`patient`, `clinician`, `grade`).
Indexes, constraints and triggers belong to their table, so they share its
schema. Extensions (`pgcrypto`, `pg_trgm`) stay in `public`.

The namespace is a schema, not a `<slug>_` name prefix, because Postgres caps
every identifier at 63 bytes and silently truncates longer ones. A
`<slug>_<table>` prefix would have pushed 265 tables in 59 forms over that
limit, and 46 groups of them would no longer be unique within it (10 even
after dropping table names' duplicated stems, including every table of the
two Lasting Power of Attorney forms, whose slugs are 64 and 70 characters). A schema name is the slug alone. It may itself be longer than 63
bytes, as two are, in which case Postgres truncates it. Every form's schema
name must be unique within its first 63 bytes, and `bin/sql-schema-namespace`
refuses to run otherwise. See
[`spec/postgresql-name-length/`](../postgresql-name-length/).

The generators that read `sql/` accept the qualifier and name each entity by
its bare table name. The XML, FHIR, protobuf and OpenAPI files, the examples,
and the Axum crates' mapping from `sql/` to their own tables therefore did not
change when the schemas were introduced.

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

### Browser storage keys

Every key a form's front-ends save in `localStorage` or `sessionStorage` has the
shape `<slug>.<name>.v<N>`, for example
`pre-operative-assessment-by-clinician.theme.v1`. Every form on the public site
shares one origin, and therefore one storage area, so a key under another
form's slug would change that form's settings.

The only exceptions are family hand-off keys, which related forms share on
purpose to pass data from one form to the next. They're namespaced by the
family name: `pre-operative-assessment.{a11y,handoff}.v1` (the pre-anaesthesia
and two pre-operative assessment forms) and
`neurodiversity-adjustment.{a11y,handoff}.v1` (the request, response and review
forms). `bin/browser-storage-namespace` lists them in `FAMILY_KEYS`.

## Conformance

The fleet had 379 forms when this spec was written (2026-11-20). Their status:

| Layer | Conforming | Notes |
| --- | --- | --- |
| Svelte routes | 379 / 379 | Already nested under `src/routes/<slug>/` (`bin/route-svelte-layout`) |
| Axum API routes | 379 / 379 | Moved from `/api/<plural>` by `bin/axum-api-namespace` (2026-11-20) |
| Browser storage keys | 379 / 379 | 63 copied keys in 32 forms fixed by `bin/browser-storage-namespace` (2026-11-20) |
| SQL schema | 379 / 379 | Moved from `public` into a per-form schema by `bin/sql-schema-namespace` (2026-11-20) |

New forms must conform from the start. `cargo run -- generate scaffold --api`
emits un-namespaced `.prefix("api/<plural>/")` routes, so run
`bin/axum-api-namespace <slug>` on a newly scaffolded crate. Its `--check`
mode is the CI drift detector for the API layer.

`bin/create-form` scaffolds unqualified SQL, so run
`bin/sql-schema-namespace <slug>` on a new form's `sql/`. Its `--check` mode is
the CI drift detector for the SQL layer.

The Axum crates keep their own tables (`patients`, `clinicians`, ...) in
their own per-crate database, unchanged. Moving those into a schema is
separate, later work.

## Verification

- `bin/sql-schema-namespace --check <slug>`, the CI drift detector for the
  SQL schema, and `bin/test-sql-apply <slug>`, which applies the qualified
  migrations to a fresh database.
- `bin/axum-api-namespace --check <slug>`, the CI drift detector for the
  API routes.
- `bin/openapi/generate-openapi-combined.py --check <slug>`, with every
  domain path under `/api/<slug>/`.
- `bin/test-axum-routes`, and the crate's `cargo test`.
- A check that `front-end-with-svelte/src/routes/` contains only `<slug>/`
  and SvelteKit root files.
