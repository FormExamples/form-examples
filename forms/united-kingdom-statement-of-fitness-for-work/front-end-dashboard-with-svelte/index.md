# Dashboard — SvelteKit + SVAR DataGrid

SvelteKit + Svelte 5 + Tailwind 4 dashboard for reviewing UK Statement of
Fitness for Work (Med 3 / fit note) submissions. Uses **SVAR DataGrid**
(`@svar-ui/svelte-grid`) with the Willow theme for sortable columns and
dropdown filters, plus summary cards across the top of the page.

## Stack

- SvelteKit 2, Svelte 5 runes, TypeScript.
- Tailwind CSS 4 (via `@tailwindcss/vite`).
- SVAR DataGrid for tabular data.
- Sample-data fallback so the app runs standalone with no backend.
- NHS visual identity (NHS Blue `#005eb8`, NHS Warm Yellow `#ffb81c`).

## Columns

| Column | Source |
| --- | --- |
| Patient | patient.given_name + patient.family_name |
| NHS number | patient.nhs_number |
| Profession | clinician.profession |
| Date | fit_note.assessment_date |
| Fitness | grade.fitness_category |
| Adaptations | grade.adaptation_intensity |
| Days | grade.period_days |
| Period | grade.period_compliance |
| Recommendation | grade.recommendation |
| Flags | grade_flag count |

## Summary cards

- Total fit notes.
- Count by fitness category.
- Count by recommendation.

## Running

```sh
pnpm install
pnpm run dev
```

Or `pnpm run check` to type-check.
