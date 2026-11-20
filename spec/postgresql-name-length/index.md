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
   kebab case and snake case. The snake-case slug is also the form's Postgres
   schema name (see [`spec/form-namespacing/`](../form-namespacing/)), so it
   must fit whole: `bin/sql-schema-namespace` refuses a slug whose snake case is
   longer than 63 bytes.
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
| Form slug (kebab and snake case) | 62 (`united-kingdom-power-of-attorney-for-health-and-care-decisions`) | 0 | yes |
| SQL identifiers in `sql/` (tables, indexes, triggers) | 79 (`trigger_rockall_score_for_upper_gastrointestinal_bleeding_grade_rule_updated_at`) | 179, in 51 forms | yes: `bin/test-sql-apply` passes 379/379 |
| Svelte route segments | 71 (`united-kingdom-lasting-powers-of-attorney-for-health-and-care-decisions`) | 2 | not a Postgres name |

The two UK Lasting Power of Attorney forms were renamed from
`united-kingdom-lasting-power-of-attorney-for-*` (64 and 70 characters in
snake case) to `united-kingdom-power-of-attorney-for-*` (56 and 62) so that
every slug fits the limit.

Namespacing is a per-form schema, not a `<slug>_<table>` prefix, because such
prefixes would have pushed 265 tables in 59 forms over the limit.

## Verification

- `bin/sql-schema-namespace --check --all` fails on a snake-case slug over 63
  bytes.
- `bin/test-sql-apply` applies every form's migrations to a fresh database,
  where any collision after truncation is an error.
