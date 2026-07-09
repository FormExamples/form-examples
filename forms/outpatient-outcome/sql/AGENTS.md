# Outpatient Outcome Report — sql/

Numbered PostgreSQL migrations (Liquibase-style). One table per file. Run in order: `00` extensions, `01` trigger function, `02` patient, `03` clinician, `04` assessment, `05`-`13` assessment_* children (one per questionnaire step), `14`-`16` grade / fired_rule / additional_flag.

Child `assessment_*` tables are one-to-one with `assessment` and are folded into a single flat `assessment` table by `bin/generate-sql-flat.py`.

See root [AGENTS/sql.md](../../../AGENTS/sql.md) for conventions.
