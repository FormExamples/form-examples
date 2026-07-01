# body-mass-index-and-body-surface-area-calculator — sql

PostgreSQL migrations for this form; the source of truth for its data shape.
The XML, FHIR R5, protobuf, and OpenAPI representations are generated from
these files.

## Canonical files

- `00_create_extensions.sql` — required extensions (`pgcrypto`, `pg_trgm`).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — shared patient table.
- `03_create_table_clinician.sql` — shared clinician table.

## Form-specific tables

- `body_mass_index_and_body_surface_area_calculator` — assessment header:
  context and identification, plus the measured height and weight inputs and
  the preferred BSA formula.
- `body_mass_index_and_body_surface_area_calculator_grade` — computed result:
  body mass index and its WHO adult category (underweight / normal /
  overweight / obese-class-1 / obese-class-2 / obese-class-3), plus both
  body-surface-area values (Mosteller and Du Bois), 1:1 with the header.
- `body_mass_index_and_body_surface_area_calculator_grade_rule` — audit trail
  of every rule that fired during computation.
- `body_mass_index_and_body_surface_area_calculator_grade_flag` —
  safety-critical flags with priority and a suggested action.

## Derived artefacts

- `schema.sql` — every migration concatenated (generated).
