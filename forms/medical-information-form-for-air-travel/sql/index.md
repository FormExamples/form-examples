# SQL migrations — Medical Information Form for Air Travel

PostgreSQL 18 Liquibase-format migrations for the MEDIF schema.

See [`AGENTS.md`](./AGENTS.md) for the full file inventory and conventions.

The schema has six application tables:

- `patient` — passenger demographics
- `clinician` — attending physician
- `medical_information_form_for_air_travel` — main MEDIF row (one per submission)
- `medical_information_form_for_air_travel_grade` — computed fitness band
- `medical_information_form_for_air_travel_grade_rule` — fired rules audit
- `medical_information_form_for_air_travel_grade_flag` — safety flags

plus two infrastructure migrations:

- `00_create_extensions.sql` — `pgcrypto` for `gen_random_uuid()`
- `01_create_function_set_updated_at.sql` — reusable updated-at trigger

## Apply

```sh
for f in sql/*.sql; do
  psql -f "$f" --set ON_ERROR_STOP=1
done
```

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
```
