# Return to Work — SvelteKit dashboard

SvelteKit 2 + Svelte 5 + Tailwind 4 dashboard for the
occupational-health team to triage Return to Work statements.
Uses the SVAR `@svar-ui/svelte-grid` DataGrid for sortable,
filterable, virtualised rendering.

## Stack

- SvelteKit 2.x
- Svelte 5 runes
- TypeScript strict
- Tailwind CSS 4
- `@svar-ui/svelte-grid` with the Willow theme
- Vitest

## Dashboard columns

| Column | Source field | Filter | Sort |
| --- | --- | --- | --- |
| Patient | `patient.name` | text contains | ✓ |
| Employer | `employer.name` | text contains | ✓ |
| Clinician | `clinician.name` | text contains | ✓ |
| Date | `return_to_work.assessment_date` | range | ✓ |
| Fitness | `return_to_work.fitness_statement_final` | dropdown | ✓ |
| Restrictions | `return_to_work_grade.restriction_priority` | dropdown | ✓ |
| Flags | `return_to_work_grade.flag_count` | range | ✓ |
| Valid until | `return_to_work.valid_until` | range | ✓ |
| Review | `return_to_work.review_date` | range | ✓ |

## Files

```
src/
├── app.css
├── app.html
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   └── sample-data.ts
│   ├── components/
│   │   ├── Dashboard.svelte
│   │   └── StatusBadge.svelte
│   └── types.ts
└── routes/
    ├── +layout.svelte
    └── +page.svelte
```

## Running

```sh
pnpm install
pnpm run dev
```

The dashboard runs against the Rust full-stack backend
(`GET /api/v1/return-to-work`) and falls back to
`lib/api/sample-data.ts` when no backend is reachable.
