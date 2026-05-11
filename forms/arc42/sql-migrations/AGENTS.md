# arc42 — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at TIMESTAMPTZ` with `set_updated_at()` trigger, `snake_case` columns,
`COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and column. Child
`arc42_documentation_grade*` tables reference `arc42_documentation_grade(id) ON DELETE CASCADE`.

## Tables

| # | File | Table | Purpose |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | (n/a) | pgcrypto, pg_trgm |
| 01 | `01_create_function_set_updated_at.sql` | (n/a) | shared trigger |
| 02 | `02_create_table_architecture.sql` | `architecture` | the documented system |
| 03 | `03_create_table_arc42_documentation.sql` | `arc42_documentation` | one snapshot of arc42 documentation; prose fields |
| 04 | `04_create_table_business_goal.sql` | `business_goal` | §1 business goals |
| 05 | `05_create_table_quality_goal.sql` | `quality_goal` | §1 quality goals |
| 06 | `06_create_table_stakeholder.sql` | `stakeholder` | §1 stakeholders |
| 07 | `07_create_table_constraint_item.sql` | `constraint_item` | §2 constraints (technical / organizational / convention) |
| 08 | `08_create_table_context_partner.sql` | `context_partner` | §3 context partners (business / technical) |
| 09 | `09_create_table_technology_decision.sql` | `technology_decision` | §4 technology decisions |
| 10 | `10_create_table_building_block.sql` | `building_block` | §5 building blocks (one nesting level) |
| 11 | `11_create_table_runtime_scenario.sql` | `runtime_scenario` | §6 runtime scenarios |
| 12 | `12_create_table_deployment_node.sql` | `deployment_node` | §7 deployment nodes |
| 13 | `13_create_table_crosscutting_concept.sql` | `crosscutting_concept` | §8 crosscutting concepts |
| 14 | `14_create_table_architectural_decision.sql` | `architectural_decision` | §9 ADRs |
| 15 | `15_create_table_quality_scenario.sql` | `quality_scenario` | §10 quality scenarios |
| 16 | `16_create_table_risk_item.sql` | `risk_item` | §11 risks and technical debt |
| 17 | `17_create_table_glossary_term.sql` | `glossary_term` | §12 glossary |
| 18 | `18_create_table_arc42_documentation_grade.sql` | `arc42_documentation_grade` | computed + final maturity, per-section completeness |
| 19 | `19_create_table_arc42_documentation_grade_rule.sql` | `arc42_documentation_grade_rule` | rules that fired during grading |
| 20 | `20_create_table_arc42_documentation_grade_flag.sql` | `arc42_documentation_grade_flag` | additional flags fired |

See root [`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md) for the
full conventions.
