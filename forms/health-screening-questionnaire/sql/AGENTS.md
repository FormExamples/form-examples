# Health Screening Questionnaire — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4
primary keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at` + `deleted_at TIMESTAMPTZ` with a `set_updated_at()` trigger,
`snake_case` columns, `''` default for unanswered text and enum columns with a
`CHECK` constraint that admits `''`, `NULL` for unanswered numeric, date, and
time columns, and `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and
column.

`health_screening_questionnaire_grade` references
`health_screening_questionnaire(id) ON DELETE CASCADE` with a UNIQUE
constraint on the foreign key to enforce 1:1. The
`health_screening_questionnaire_grade_flag` child references the grade and is
1:many.

The `assessor` table (not `clinician`) represents the person conducting the
screen, who is often not a clinician — see [`../AGENTS.md`](../AGENTS.md)
§"`assessor`, not `clinician`".

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the full conventions
and the table-naming pattern.
