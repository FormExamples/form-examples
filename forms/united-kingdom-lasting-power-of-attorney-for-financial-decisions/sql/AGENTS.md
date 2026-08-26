# UK LPA for Financial Decisions — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4
primary keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at`
+ `updated_at` + `deleted_at TIMESTAMPTZ` with `set_updated_at()` trigger,
`snake_case` columns, `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every
table and column. Child `lpa_*` tables reference
`lasting_power_of_attorney(id) ON DELETE CASCADE`.

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for
the full conventions and the table-naming pattern.

## Table-by-table map

| # | Table | Role |
| --- | --- | --- |
| 02 | `person` | Every named individual: donor, attorney, replacement, certificate provider, person to notify, witness, applicant, recipient. One row per unique person. |
| 03 | `address` | Every postal address, normalized so an attorney living at the donor's address shares one row. |
| 04 | `lasting_power_of_attorney` | One row per LPA — top-level deed with donor, decision mode, when-it-can-act, declared and registered states. |
| 05 | `lpa_attorney` | Many-to-one join: persons appointed as original attorneys. |
| 06 | `lpa_replacement_attorney` | Many-to-one join: persons appointed as replacement attorneys. |
| 07 | `lpa_certificate_provider` | Many-to-one join: the certificate provider with eligibility-confirmation flags. |
| 08 | `lpa_person_to_notify` | Many-to-one join: 0–5 persons to notify on registration. |
| 09 | `lpa_preferences_and_instructions` | Free-text preferences and instructions (LP1F section 7). |
| 10 | `lpa_signature` | One row per signing event (donor, certificate provider, each attorney, each replacement, each applicant) — captures section, date, signed-on-behalf flag. |
| 11 | `lpa_witness` | One row per witness signature, linked back to a signature row. |
| 12 | `lpa_continuation_sheet` | Continuation sheets 1–4 with their kind and body. |
| 13 | `lpa_registration_application` | OPG registration application (LP1F sections 12–15) — applicant kind, fee, repeat-application flag. |
| 14 | `lpa_registration_recipient` | LP1F section 13 — who receives the LPA and how. |
| 15 | `lpa_validation_result` | Validator output — band, composite risk, computed at. |
| 16 | `lpa_validation_rule` | Statutory blocker rules that fired during validation. |
| 17 | `lpa_validation_flag` | Non-blocking warning flags that fired during validation. |
