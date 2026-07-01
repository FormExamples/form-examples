# estimated-glomerular-filtration-rate-calculator — sql

PostgreSQL migrations for this form; the source of truth for its data shape.
The XML, FHIR R5, protobuf, and OpenAPI representations are generated from
these files.

## Canonical files

- `00_create_extensions.sql` — required extensions (`pgcrypto`, `pg_trgm`).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — shared patient table.
- `03_create_table_clinician.sql` — shared clinician table.

## Form-specific tables

- `estimated_glomerular_filtration_rate_calculator` — assessment header:
  context and identification, plus the serum creatinine, age, sex, specimen
  date, and steady-state inputs and the chosen estimating equation.
- `estimated_glomerular_filtration_rate_calculator_grade` — computed result:
  the derived serum creatinine in mg/dL, the eGFR in mL/min/1.73 m^2, and its
  CKD G-stage classification (G1–G5), 1:1 with the header.
- `estimated_glomerular_filtration_rate_calculator_grade_rule` — audit trail of
  every rule that fired during computation.
- `estimated_glomerular_filtration_rate_calculator_grade_flag` —
  safety-critical flags with priority and a suggested action.

## Derived artefacts

- `schema.sql` — every migration concatenated (generated).
