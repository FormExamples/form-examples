# Eye Prescription — SQL Migrations

Liquibase-formatted PostgreSQL 18 schema for the eye-prescription form.
See [`../AGENTS.md`](../AGENTS.md) for the form-wide design and
[`../doc/refractive-classification-rules.md`](../doc/refractive-classification-rules.md)
for the rules that consume this schema.

## Migration order

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00_create_extensions.sql` | `pgcrypto` for `gen_random_uuid()` |
| 01 | `01_create_function_set_updated_at.sql` | Reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | Patient demographic record |
| 03 | `03_create_table_prescriber.sql` | GOC-registered prescriber |
| 04 | `04_create_table_eye_prescription.sql` | Prescription header |
| 05 | `05_create_table_eye_prescription_eye.sql` | Per-eye refraction (one row per eye) |
| 06 | `06_create_table_eye_prescription_visual_acuity.sql` | Visual acuity per eye + binocular |
| 07 | `07_create_table_eye_prescription_pupillary_distance.sql` | PD measurements |
| 08 | `08_create_table_eye_prescription_lens_recommendation.sql` | Lens design + material + coatings |
| 09 | `09_create_table_eye_prescription_ocular_health_finding.sql` | Optional ocular health findings |
| 90 | `90_create_table_eye_prescription_grade.sql` | Computed grading result |
| 91 | `91_create_table_eye_prescription_grade_rule.sql` | Audit trail of fired rules |
| 92 | `92_create_table_eye_prescription_grade_flag.sql` | Safety flags |

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` on every table.
- snake_case column names.
- Sphere / cylinder / addition / prism stored as `NUMERIC(5,2)` to preserve
  the 0.25-diopter step exactly.
- Cylinder stored in **minus-cylinder convention** (always ≤ 0).
- Axis stored as `INTEGER` (1–180; 0 is invalid).
- Per-eye rows are uniquely keyed on `(eye_prescription_id, eye)`.
- 1:1 child tables (visual_acuity, pupillary_distance, lens_recommendation,
  ocular_health_finding, grade) are uniquely keyed on `eye_prescription_id`.

## Generated artefacts

After modifying the SQL migrations, regenerate downstream representations:

```sh
bin/sql/generate-sql-comments.py
bin/sql/generate-sql-combined.py
bin/xml-representations/generate-xml-representations.py
bin/fhir-r5/generate-fhir-r5-representations.py
bin/protobuf/generate-protobuf-representations.py
```

## Verify

```sh
bin/test-form eye-prescription
```
