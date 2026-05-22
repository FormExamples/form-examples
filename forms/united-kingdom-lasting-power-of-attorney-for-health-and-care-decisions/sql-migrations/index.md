# UK LPA for Health and Care Decisions — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file, following the
monorepo convention `NN_create_table_<name>.sql`.

Core tables:

- `donor` — the person creating the LPA
- `attorney` — each named attorney
- `replacement_attorney` — each named replacement attorney
- `certificate_provider` — independent skilled-person or 2-year-known
  certifier
- `person_to_notify` — recipients of the notice of intention to register
- `lpa` — the LPA instrument header (jurisdiction, decision-rule,
  life-sustaining-treatment option, applicant)
- `lpa_attorney`, `lpa_replacement_attorney`, `lpa_person_to_notify` —
  join tables
- `lpa_decision_rule` — jointly / jointly and severally / mixed (with
  joint-decision set as JSONB)
- `lpa_lst_choice` — Option A or Option B
- `lpa_preference` — non-binding guidance text
- `lpa_instruction` — binding constraint text
- `lpa_signature` — donor / certificate-provider / attorney signatures
  with datetime and witness identity
- `lpa_registration_application` — Part C applicant, fee, remission
- `lpa_validity` — computed validity result, status, completeness score
- `lpa_validity_fired_rule` — fired statutory rules per validity row
- `lpa_validity_additional_flag` — non-rule warnings per validity row

Conventions:

- UUIDv4 primary keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
- `created_at`, `updated_at`, `deleted_at TIMESTAMPTZ` on every table
- `set_updated_at()` trigger on every table
- `snake_case` columns
- `COMMENT ON TABLE` and `COMMENT ON COLUMN` for every table and column
- Child `lpa_*` join tables reference `lpa(id) ON DELETE CASCADE`
- Statutory rule identifiers stored as text (`'R-MCA-S9-AGE'`) for stable
  audit trails across releases

See root [`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md)
for the full conventions and the table-naming pattern.
