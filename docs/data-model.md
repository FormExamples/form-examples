# Data model

The `sql/` directory of each form is the **source of truth for data shape**.
Every downstream representation (XML, FHIR, Protobuf, OpenAPI, the Loco crate) is
derived from it. This page describes the relational schema every form shares and
walks a real example.

See [`AGENTS/sql.md`](../AGENTS/sql.md) for authoring rules, and
[Generator pipeline](generator-pipeline.md) for what the SQL feeds.

## Migration layout

Migrations are numbered and applied in order to a fresh database
(`bin/test-sql-apply` is the gate). Two preamble files come first in every form:

- `00_create_extensions.sql` — enables `pgcrypto` (for `gen_random_uuid()`) and
  `pg_trgm` (trigram GIN indexes for free-text search).
- `01_create_function_set_updated_at.sql` — the reusable trigger function
  `set_updated_at()` that stamps `updated_at = now()` on every `UPDATE`.

Then the tables: `NN_create_table_<name>.sql`. The generated combined file
`schema.sql` is the concatenation of the numbered migrations and is not
hand-edited.

## Every table's spine

Each table carries a UUID primary key and the three timestamps:

```sql
id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at TIMESTAMPTZ DEFAULT NULL,
```

`deleted_at` is a soft-delete marker. Every table also gets a
`trigger_<table>_updated_at` trigger wired to `set_updated_at()`.

## Shared entities

Two tables appear in essentially every form:

- **`patient`** — demographics: `name`, `birth_date`, `sex` (enum), contact,
  `united_kingdom_nhs_number` (unique), `hospital_mrn`, height/weight/BMI,
  `allergies_summary`, plus a `patient_name_trgm_idx` GIN index for search.
- **`clinician`** — the assessing clinician.

## Domain and grading tables

Beyond the shared entities, each form has:

1. A **root assessment** table (`<slug>`), and often **child** tables for
   repeating structures (e.g. per-timepoint rows).
2. A **grade** table (`<slug>_grade`) — the 1:1 computed result the engine
   emits: derived totals, bands, summary, trend.
3. A **grade-rule** table (`<slug>_grade_rule`) — the audit trail of every
   scoring rule that fired, with a stable `rule_id`, points, category, and
   human-readable description.
4. A **grade-flag** table (`<slug>_grade_flag`) — safety red flags that fire
   independently of the totals, each with a `flag_id`, a `category`, a
   `priority` (`low` / `medium` / `high`), a `description`, and a
   `suggested_action`.

The scoring engine reads the assessment, fires rules → writes one grade row plus
its rule and flag children. See [Scoring engines](scoring-engines.md).

## Worked example: `apgar-score`

`forms/apgar-score/sql/` contains exactly:

```
00_create_extensions.sql
01_create_function_set_updated_at.sql
02_create_table_patient.sql
03_create_table_clinician.sql
04_create_table_apgar_score.sql             root assessment
05_create_table_apgar_score_timepoint.sql   child: one row per scored timepoint
06_create_table_apgar_score_grade.sql        1:1 computed grade
07_create_table_apgar_score_grade_rule.sql   fired-rule audit trail
08_create_table_apgar_score_grade_flag.sql   safety flags
```

`apgar_score_grade` stores the per-timepoint totals and bands
(`reassuring` / `moderately-low` / `low`), a `summary_band` (worst band
observed), and a `trend` (`improving` / `static` / `falling` / `insufficient`).
It references its parent with `apgar_score_id UUID NOT NULL UNIQUE` — the `UNIQUE`
enforces the 1:1 relationship. `apgar_score_grade_flag` categories are
constrained by a `CHECK`, e.g. `resuscitation-needed`, `continue-scoring`,
`falling-trend`.

(For a form without a child table, compare `stroke-assessment`, whose flag
migration is numbered `92_…` — numbering need not be gapless, only ordered.)

## Empty-value sentinels

So a front-end can submit an in-progress draft without violating `NOT NULL` or
diverging from the grader (spec.md §3.3):

- Unanswered **text / enum** → empty string `''`. Enum `CHECK` lists always
  include `''`, e.g. `CHECK (sex IN ('female','male','intersex','unknown',''))`.
- Unanswered **numeric / date / time** → `NULL`.

## camelCase ↔ snake_case

SQL columns are `snake_case`. The front-end (TypeScript) and the Rust structs
shared with it are `camelCase`. The boundary is bridged by
`serde(rename_all = "camelCase")` on the Rust request/response structs
(spec.md §3.2). So `birth_date` in SQL is `birthDate` in JSON and TypeScript;
`united_kingdom_nhs_number` becomes `unitedKingdomNhsNumber`. Rust internals stay
`snake_case`. The example fixtures in `examples/assessment.json` use the
camelCase form and are checked against the SQL columns by
`bin/test-examples-conformance` (see [Verification](verification.md)).

## Interchange

Every form imports and exports its data as JSON, XML, CSV, and TSV. The XML and
FHIR representations are generated from this same SQL — see
[Generator pipeline](generator-pipeline.md).
