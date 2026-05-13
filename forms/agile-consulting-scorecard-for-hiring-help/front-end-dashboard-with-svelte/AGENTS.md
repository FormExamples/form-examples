# Agile Consulting Scorecard for Hiring Help — front-end dashboard with SvelteKit

SvelteKit reviewer dashboard built on SVAR DataGrid (Willow theme).
Aggregates submitted scorecards across organizations, with sortable
columns and dropdown filters on band, manifesto subtotal, principles
subtotal, sector, and organization size.

## Status

Scaffold only. Dashboard route, grid configuration, and API client
still need to be authored.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme
- Backend API client with sample-data fallback for standalone development

## Columns

| Column | Source | Filter |
| --- | --- | --- |
| Organization | `organization.name` | text search (gin_trgm) |
| Sector | `organization.sector` | dropdown |
| Size band | `organization.size_band` | dropdown |
| Respondent | `respondent.name` | text search |
| Assessment date | `agile_consulting_scorecard_for_hiring_help.assessment_date` | date range |
| Score | `*_grade.score_total` (0–16) | numeric range |
| Manifesto | `*_grade.manifesto_subtotal` (0–4) | numeric range |
| Principles | `*_grade.principles_subtotal` (0–12) | numeric range |
| Band | `*_grade.computed_band` | dropdown (low/borderline/medium/high) |
| Flags | count of `*_grade_flag` rows | numeric range |
| Recommendation | `*_grade.recommendation` | dropdown |

## Conventions

- Backend API at `/api/scorecards` returning paginated rows; sample-data
  fallback for standalone development.
- Row click opens the scorecard report at `/report/{id}` (read-only).
- "Re-take" button on each row opens the wizard pre-populated for the
  same organization (snapshot diff feature, planned).

See [`AGENTS/front-end-with-sveltekit-tailwind-svar.md`](../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
for the full conventions.
