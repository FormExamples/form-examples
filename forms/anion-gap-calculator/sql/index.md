# anion-gap-calculator — sql

PostgreSQL migrations for this form; the source of truth for its data shape.
The XML, FHIR R5, protobuf, and OpenAPI representations are generated from
these files.

## Canonical files

- `00_create_extensions.sql` — required extensions (`pgcrypto`, `pg_trgm`).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — shared patient table.
- `03_create_table_clinician.sql` — shared clinician table.

## Form-specific tables

- `anion_gap_calculator` — calculation header: context and identification,
  plus the electrolyte-panel inputs (sodium, chloride, bicarbonate, optional
  potassium) and the optional albumin used for the correction.
- `anion_gap_calculator_grade` — computed result: the raw anion gap, the
  albumin-corrected anion gap, and its classification band (low / normal /
  high / very-high), 1:1 with the header.
- `anion_gap_calculator_grade_rule` — audit trail of every rule that fired
  during computation.
- `anion_gap_calculator_grade_flag` — safety-critical flags with priority and
  a suggested action.

## Derived artefacts

- `schema.sql` — every migration concatenated (generated).
