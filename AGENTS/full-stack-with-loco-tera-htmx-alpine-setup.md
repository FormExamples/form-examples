# Full-stack scaffold generator (setup script)

Generates the per-form `full-stack-with-loco-tera-htmx-alpine-setup` shell
script: an idempotent, ordered list of `cargo loco generate scaffold`
invocations derived from each form's SQL migrations (the source of truth —
see `spec.md` §3.1). Do not hand-edit; re-run the generator after schema
changes.

Slug: full-stack-with-loco-tera-htmx-alpine-setup

- Search pattern: `forms/*/full-stack-with-loco-tera-htmx-alpine-setup`
- Generator: `bin/full-stack-with-loco-tera-htmx-alpine/generate-full-stack-with-loco-tera-htmx-alpine-setup.py`

## What the generator does

For each form's `sql-migrations/` directory, the script parses every
`CREATE TABLE` statement and emits a single setup shell script
containing:

1. A header comment that names the source generator and warns against
   hand edits.
2. One `cargo loco generate scaffold <table> <col>:<type> ... --htmx`
   command per table, in the same order as the SQL migrations so that
   foreign-key targets exist before referencing tables.

## Loco field-type syntax

The generator translates SQL column types to Loco's scaffold field-type
DSL:

| SQL                                        | Loco                |
| ------------------------------------------ | ------------------- |
| `UUID`                                     | `uuid`              |
| `TEXT`                                     | `text`              |
| `VARCHAR`, `CHAR`                          | `string`            |
| `INTEGER`, `INT`, `SMALLINT`               | `int`               |
| `BIGINT`                                   | `bigint`            |
| `REAL`, `FLOAT`                            | `float`             |
| `DOUBLE PRECISION`, `NUMERIC`              | `double`            |
| `BOOLEAN`                                  | `bool`              |
| `DATE`                                     | `date`              |
| `TIMESTAMPTZ`, `TIMESTAMP`                 | `ts`                |
| `JSON`, `JSONB`                            | `json` / `jsonb`    |
| `BYTEA`                                    | `blob`              |
| FK columns (`<name>_id UUID REFERENCES …`) | `<name>:references` |

Suffix conventions:

- `!` — NOT NULL
- `^` — UNIQUE
- (no suffix) — nullable

Loco-managed columns are skipped because Loco scaffolds them
automatically: `id`, `created_at`, `updated_at`.

## Output layout

Each form ends up with one file at the top of its directory:

```
forms/<slug>/
  full-stack-with-loco-tera-htmx-alpine-setup    # generated, executable
```

The file is a `#!/bin/sh` script with `set -euf`. It does **not** create
databases or users; it only emits scaffold-generation commands. Run it
from inside the form's `full-stack-with-loco-tera-htmx-alpine/` crate
after the Loco app has been initialised and a database is reachable.

## Bootstrapping a new Loco app (one-time, manual)

Before the generated setup script can be useful, a new form needs a
running Loco app and databases. These are not produced by the generator;
they are one-time manual steps:

```sh
createuser  --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb    --host=localhost --port=5432 --username=postgres --owner=loco <slug_snake>_development || :
createdb    --host=localhost --port=5432 --username=postgres --owner=loco <slug_snake>_test || :
createdb    --host=localhost --port=5432 --username=postgres --owner=loco <slug_snake>_production || :
loco new --name <slug-kebab> --db postgres --bg async --assets serverside
```

Substitute `<slug_snake>` (snake_case) and `<slug-kebab>` (kebab-case)
for the form. Example for `pre-operative-assessment-by-clinician`:

```sh
createdb --host=localhost --port=5432 --username=postgres --owner=loco \
    pre_operative_assessment_by_clinician_development || :
loco new --name pre-operative-assessment-by-clinician --db postgres --bg async --assets serverside
```

Once the Loco app exists, run the generated setup script inside it to
scaffold all resources at once.

## Verify

The setup file is asserted to exist by `bin/test-form`:

```sh
file_size_or_err "$form_dir/full-stack-with-loco-tera-htmx-alpine-setup"
```

To regenerate every form's setup script after editing SQL migrations:

```sh
bin/full-stack-with-loco-tera-htmx-alpine/generate-full-stack-with-loco-tera-htmx-alpine-setup.py
```
