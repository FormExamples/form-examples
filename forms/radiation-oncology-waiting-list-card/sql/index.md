# radiation-oncology-waiting-list-card — sql

PostgreSQL migrations for this form. See
[`AGENTS/sql.md`](../../../AGENTS/sql.md) for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto).
- `01_create_function_set_updated_at.sql` — trigger function used by every
  `updated_at` column.
- `02_create_table_patient.sql` — patient table.
- `03_create_table_practitioner.sql` — practitioner table.

## Form-specific tables

- `rad_onc_waiting_list_card` — top-level waiting list card.
- `rad_onc_waiting_list_card_appointment` — scheduled / upcoming appointments
  attached to the card.
- `rad_onc_waiting_list_card_grade` — computed grading result.
- `rad_onc_waiting_list_card_grade_rule` — audit trail of fired grading rules.
- `rad_onc_waiting_list_card_grade_flag` — safety / operational flags fired
  independently of the Waiting Time Status.

## Derived artefacts

- `09_schema.sql` — every migration concatenated (generated).
