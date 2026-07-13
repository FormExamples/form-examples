# Tutorial 4 — The generator pipeline

SQL is the single source of truth. From each form's `sql/` migrations the repo
generates XML + DTD, FHIR R5 JSON, Protocol Buffers, OpenAPI 3.1, the Loco setup
script, and the per-form CHANGELOG + examples. This tutorial adds one column to
a real form, regenerates everything, inspects the diffs, and then reverts —
using **`apgar-score`** as the guinea pig.

> **This edits a committed form.** The final step reverts every change with
> `git checkout`. Do not commit the intermediate state.

Run from the repository root.

## 1. Confirm a clean tree

So you can see exactly what the generators touch:

```sh
git status --short
```

## 2. Add a SQL column

The parent table is `forms/apgar-score/sql/04_create_table_apgar_score.sql`.
Open it and add a column to the parent record — for example a free-text
`birth_attendant` beside the other context columns:

```sql
    birth_attendant VARCHAR(255) NOT NULL DEFAULT '',
```

Save the file. This one edit is the only hand change; every representation below
is regenerated from it.

## 3. Run the generators

Each generator reads the SQL and rewrites its derived artefacts. They are
idempotent — a run with no schema change produces no diff.

```sh
python3 bin/sql/generate-sql-combined.py apgar-score
python3 bin/xml-representations/generate-xml-representations.py
python3 bin/fhir-r5/generate-fhir-r5-representations.py
python3 bin/protobuf/generate-protobuf-representations.py
python3 bin/openapi/generate-openapi-representations.py
python3 bin/back-end-with-loco/generate-back-end-with-loco-setup.py
python3 bin/generate-changelog-and-examples.py apgar-score
```

## 4. Read the diffs

The new column has propagated into every machine representation:

```sh
git status --short
git diff -- forms/apgar-score/sql/schema.sql
git diff -- forms/apgar-score/xml
git diff -- forms/apgar-score/fhir
git diff -- forms/apgar-score/protobuf
git diff -- forms/apgar-score/openapi/apgar_score.yaml
```

What each artefact is:

| Directory | Generator | What it holds |
| --- | --- | --- |
| `sql/schema.sql` | `bin/sql/generate-sql-combined.py` | The numbered migrations combined into one file. |
| `xml/` | `bin/xml-representations/generate-xml-representations.py` | An XML instance + DTD per table entity. |
| `fhir/r5/` | `bin/fhir-r5/generate-fhir-r5-representations.py` | FHIR HL7 R5 JSON per entity. |
| `protobuf/` | `bin/protobuf/generate-protobuf-representations.py` | A `.proto` message per entity. |
| `openapi/` | `bin/openapi/generate-openapi-representations.py` | An OpenAPI 3.1 spec per entity (the `Patient`/`ApgarScore` schemas). |
| `back-end-with-loco-setup` | `bin/back-end-with-loco/generate-back-end-with-loco-setup.py` | The `cargo loco generate scaffold` script. |
| `CHANGELOG.md`, `examples/` | `bin/generate-changelog-and-examples.py` | Keep-a-Changelog file + filled fixtures. |

## 5. What the `--check` gates catch

Every generator has a `--check` mode that regenerates into a scratch area and
fails if the committed output differs — i.e. it detects **drift** between the
SQL and its derived artefacts. This is what CI runs. With your uncommitted
column still in place but the generators already run, the checks pass; if you
had edited the SQL and *forgotten* to regenerate, they would fail:

```sh
python3 bin/xml-representations/generate-xml-representations.py --check
python3 bin/fhir-r5/generate-fhir-r5-representations.py --check
python3 bin/protobuf/generate-protobuf-representations.py --check
python3 bin/openapi/generate-openapi-representations.py --check
python3 bin/generate-changelog-and-examples.py --check
python3 bin/generate-llms-txt.py --check
```

The same pattern powers the repo-wide gates in the root `AGENTS.md`
("Verify" section) and `bin/test-tools`, which drives every generator and Lily
`--check` in one shot. The rule the gates enforce: **never hand-edit a generated
artefact, and always regenerate in the same commit as the schema change.**

## 6. Revert

Throw away the experiment — the SQL edit and every regenerated file:

```sh
git checkout -- forms/apgar-score
git status --short
```

The tree is clean again.

## Verify you got here

```sh
# Every generator this tutorial runs exists:
ls bin/sql/generate-sql-combined.py
ls bin/xml-representations/generate-xml-representations.py
ls bin/fhir-r5/generate-fhir-r5-representations.py
ls bin/protobuf/generate-protobuf-representations.py
ls bin/openapi/generate-openapi-representations.py
ls bin/back-end-with-loco/generate-back-end-with-loco-setup.py
ls bin/generate-changelog-and-examples.py
ls bin/generate-llms-txt.py
# The SQL source and one generated target for apgar-score exist:
ls forms/apgar-score/sql/04_create_table_apgar_score.sql
ls forms/apgar-score/openapi/apgar_score.yaml
# The repo-wide generator gate:
ls bin/test-tools
```
