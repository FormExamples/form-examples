# WHO Surgical Safety Checklist — SQL migrations

PostgreSQL migrations defining the canonical schema for the WHO Surgical
Safety Checklist form. All other representations (FHIR R5, XML/DTD, protobuf,
TypeSpec, Rust entities) derive from these files.

## Files

| File | Purpose |
| --- | --- |
| `00_create_extensions.sql` | Enable `pgcrypto` and `pg_trgm`. |
| `01_create_function_set_updated_at.sql` | Reusable `updated_at` trigger function. |
| `02_create_table_patient.sql` | Patient demographics. |
| `03_create_table_clinician.sql` | Operating-team clinicians (surgeon, anaesthetist, nurse). |
| `04_create_table_who_surgical_safety_checklist.sql` | Main case record with all three phases. |
| `05_create_table_team_member.sql` | Operating-team roster captured during the Time Out. |
