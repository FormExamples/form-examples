# PostgreSQL name length

PostgreSQL's default maximum table name length is 63 characters. More
precisely, the limit is `NAMEDATALEN - 1` = 63 bytes, and it applies to every
identifier: tables, schemas, columns, indexes, constraints, triggers and
functions. Over the limit, the extra characters are ignored. PostgreSQL
truncates the name to 63 bytes and raises only a `NOTICE`, not an error.

All forms in this project must have names that are unique within the 63
character limit. Some forms in this project have names longer than 63 characters.

## Rules

1. **Every form's slug is unique within its first 63 characters**, in both
   kebab case and snake case. A slug may be longer than 63 characters, for
   example `united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions`
   (70). The snake-case slug is the form's Postgres schema name in full (see
   [`spec/form-namespacing/`](../form-namespacing/)), so a long one is
   truncated to its first 63 bytes, the same way in every reference.
   `bin/sql-schema-namespace` refuses to run if two forms' schema names are the
   same within their first 63 bytes.
2. **Every SQL identifier is unique within its first 63 characters** in its
   own namespace. That means table, index and constraint names within the
   form's schema, and trigger names on their table. A longer name is allowed
   and PostgreSQL truncates it. Two names that become the same after truncation
   are a collision, which `bin/test-sql-apply` catches as an apply error.
3. **Generators never rely on truncation.** Anything that matches a name in
   the database to a name in `sql/` must compare it truncated to 63 bytes, or
   use a name that already fits.

## The fleet today

Measured 2026-11-20, across 379 forms:

| Name | Longest | Over 63 | Unique within 63 |
| --- | --- | --- | --- |
| Form slug (kebab and snake case) | 70 (`united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions`) | 2 (70 and 64) | yes |
| SQL identifiers in `sql/` (tables, indexes, triggers) | 79 (`trigger_rockall_score_for_upper_gastrointestinal_bleeding_grade_rule_updated_at`) | 179, in 51 forms | yes: `bin/test-sql-apply` passes 379/379 |
| Svelte route segments | 71 (`united-kingdom-lasting-powers-of-attorney-for-health-and-care-decisions`) | 2 | not a Postgres name |

The two slugs over the limit are the UK Lasting Power of Attorney forms. Their
schema names truncate to 63 bytes and stay distinct:

| Schema name (snake-case slug) | Bytes | As stored, first 63 bytes |
| --- | --- | --- |
| `united_kingdom_lasting_power_of_attorney_for_financial_decisions` | 64 | `united_kingdom_lasting_power_of_attorney_for_financial_decision` |
| `united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions` | 70 | `united_kingdom_lasting_power_of_attorney_for_health_and_care_de` |

Namespacing is a per-form schema, not a `<slug>_<table>` prefix, because such
prefixes would have pushed 265 tables in 59 forms over the limit.

## Verification

- `bin/sql-schema-namespace --check --all` fails when two forms' schema names
  are the same within their first 63 bytes.
- `bin/test-sql-apply` applies every form's migrations to a fresh database,
  where any collision after truncation is an error.
