# parkland-formula-for-burns — sql

PostgreSQL migrations for this form; the source of truth for its data shape.
The XML, FHIR R5, protobuf, and OpenAPI representations are generated from
these files.

## Canonical files

- `00_create_extensions.sql` — required extensions (`pgcrypto`, `pg_trgm`).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — shared patient table.
- `03_create_table_clinician.sql` — shared clinician table (emergency, burns, and critical-care roles).

## Form-specific tables

- `parkland_formula_for_burns` — assessment header: context and identification,
  plus the body weight, %TBSA, and time-of-injury inputs and the injury-feature
  flags (inhalation, circumferential/deep, mechanism).
- `parkland_formula_for_burns_grade` — computed result: total 24-hour volume,
  first-8-hour and next-16-hour phase volumes and infusion rates (offset for
  elapsed time since injury), and the urine-output titration band, 1:1 with the
  header.
- `parkland_formula_for_burns_grade_rule` — audit trail of every rule that fired
  during computation.
- `parkland_formula_for_burns_grade_flag` — safety-critical red flags with
  priority and a suggested action.

## Derived artefacts

- `schema.sql` — every migration concatenated (generated).
