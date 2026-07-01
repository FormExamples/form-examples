# Post-Anaesthesia Care Unit (PACU) Record — SQL schema

PostgreSQL schema (source of truth) for the PACU recovery record. Numbered
migrations create the trigger function, shared entities, the main recovery
record, and the computed grade with its rule and flag audit tables. Foreign keys
cascade within the form; references to `patient` and `clinician` are delete
restricted. Foreign-key targets are created before their referencers.

The primary instrument is the Modified Aldrete Score (five parameters, each 0-2,
total 0-10); an Aldrete of >= 9 with the oxygen-saturation parameter scoring 2 is
the discharge-readiness threshold. The optional PADSS (five criteria, each 0-2,
total 0-10, >= 9 = street-fit) covers day-surgery discharge home.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | recording recovery-staff entity |
| 04 | `04_create_table_post_anaesthesia_care_unit_record.sql` | `post_anaesthesia_care_unit_record` | main record: context, identification, five Aldrete parameter inputs, airway / pain / PONV, optional PADSS inputs |
| 05 | `05_create_table_post_anaesthesia_care_unit_record_grade.sql` | `post_anaesthesia_care_unit_record_grade` | computed grade (1:1): five Aldrete sub-scores, total 0-10, discharge-readiness band, optional PADSS total and street-fitness |
| 06 | `06_create_table_post_anaesthesia_care_unit_record_grade_rule.sql` | `post_anaesthesia_care_unit_record_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_post_anaesthesia_care_unit_record_grade_flag.sql` | `post_anaesthesia_care_unit_record_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
