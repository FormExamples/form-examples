# Tutorial 2 — Build a new form end to end

This is the standard workflow from the root `AGENTS.md`, walked through on a
small worked example: **`example-screening-score`**, a five-question screen.

> **This form is disposable.** `example-screening-score` is a throwaway you
> build to learn the pipeline. Do **not** commit it. The last step deletes it
> with `rm -rf forms/example-screening-score`. Nothing else in the repo depends
> on it.

Run everything from the repository root.

## 1. Scaffold the directory

```sh
bin/create-form example-screening-score
```

`bin/create-form` copies `etc/skeleton/` into `forms/example-screening-score/`
and writes the Loco bootstrap script. You now have the full directory layout
(`index.md`, `spec/`, `sql/`, `front-end-with-html/`, `back-end-with-loco/`, …)
with empty or placeholder content.

## 2. Fill in the design docs

Edit these by hand to describe the form. Keep the spec ahead of the code — the
repo is spec-driven (`spec.md` §10):

- `forms/example-screening-score/index.md` — overview and the assessment-step
  table (the five questions, their options, and the score each contributes).
- `forms/example-screening-score/spec/index.md` — the living domain spec: the
  scoring algorithm, bands, and flagged-issue rules.
- `forms/example-screening-score/AGENTS.md`, `plan.md`, `tasks.md` — agent
  notes, roadmap, and task list.

For a worked reference of what "good" looks like, read the equivalent files in
`forms/apgar-score/` (a real five-sign score with the same shape).

## 3. Author the SQL schema

SQL under `forms/example-screening-score/sql/` is the **source of truth**; every
other machine representation is generated from it. Follow the canonical numbered
layout (`NN_create_table_<name>.sql`). A minimal schema mirrors `apgar-score`:

- `00_create_extensions.sql`, `01_create_function_set_updated_at.sql` — shared
  preamble (copy from `forms/apgar-score/sql/`).
- `02_create_table_patient.sql`, `03_create_table_clinician.sql` — shared
  subject entities.
- `04_create_table_example_screening_score.sql` — the parent record: UUID PK via
  `gen_random_uuid()`, `created_at` / `updated_at` / `deleted_at`, a
  `patient_id` FK, the five answers, and the computed `total` and `band`.

Every table needs the three timestamps and a UUID primary key (see the
`Conventions` section of the root `AGENTS.md`). Study
`forms/apgar-score/sql/04_create_table_apgar_score.sql` as a template.

## 4. Regenerate the derived artefacts

The SQL drives XML, FHIR, protobuf, OpenAPI, the Loco setup script, and the
per-form CHANGELOG + examples. Run the generators (they are idempotent — safe to
re-run):

```sh
python3 bin/sql/generate-sql-combined.py example-screening-score
python3 bin/xml-representations/generate-xml-representations.py
python3 bin/fhir-r5/generate-fhir-r5-representations.py
python3 bin/protobuf/generate-protobuf-representations.py
python3 bin/openapi/generate-openapi-representations.py
python3 bin/back-end-with-loco/generate-back-end-with-loco-setup.py
python3 bin/generate-changelog-and-examples.py example-screening-score
python3 bin/generate-llms-txt.py example-screening-score
```

Tutorial 4 (`04-generator-pipeline.md`) explains exactly what each generator
emits and what its `--check` gate catches.

## 5. Build the front-ends and back-end

This is the hand-written part (the generators do not write UI or business
logic):

- **HTML** — mirror `forms/pre-operative-assessment-by-clinician/front-end-with-html/`
  (the HTML reference form): a single-page `index.html` wizard plus
  `dashboard.html`, using the Lily Design System classes.
- **Svelte** — mirror `forms/cardiology-request/front-end-with-svelte/` (the
  Svelte reference form): a pure engine in `src/lib/engine/`, `StepNName.svelte`
  wizard steps, and RESTful routes. Tutorial 3 covers the engine.
- **Loco** — mirror `forms/medical-operation-note/back-end-with-loco/` (the Loco
  reference crate): one migration and one `_entity` per SQL table.

## 6. Validate the structure

```sh
bin/test-form example-screening-score
```

Fix anything it reports (missing files, symlink gaps, naming), then record the
work in `forms/example-screening-score/tasks.md`.

## 7. Clean up — delete the throwaway

```sh
rm -rf forms/example-screening-score
```

If you were building a real form you would instead commit it (schema and its
regenerated artefacts in the same commit) and update the form index in
`forms/AGENTS.md`.

## Verify you got here

```sh
# The scaffolder, the validator, and every generator this tutorial calls exist:
ls bin/create-form bin/test-form
ls bin/sql/generate-sql-combined.py
ls bin/openapi/generate-openapi-representations.py
# The three reference forms this tutorial points at all exist:
ls forms/pre-operative-assessment-by-clinician/front-end-with-html
ls forms/cardiology-request/front-end-with-svelte
ls forms/medical-operation-note/back-end-with-loco
```
