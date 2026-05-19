# WHO Surgical Safety Checklist — Review Dashboard

SvelteKit 2.x + Svelte 5 dashboard that lists WHO Surgical Safety Checklist
submissions. Designed for theatre coordinators, anaesthetic leads, and clinical
governance reviewers to triage cases by status, urgency, surgical specialty,
and computed safety-flag count.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Tailwind CSS 4
- SVAR DataGrid (`@svar-ui/svelte-grid` 2.x) with the Willow theme

## Features

- SVAR DataGrid with sortable columns and the Willow theme.
- Filter panel above the grid (status, urgency, specialty dropdowns + free-text
  search). Filters compose: applying any of them narrows the visible rows.
- "Showing X of Y cases" count above the grid.
- Row click opens a side drawer showing all three phases (Sign In, Time Out,
  Sign Out) with their coordinator + completed-at timestamps, the team-member
  roster, and the safety flags computed by `$lib/checklist/safety-flags.ts`.
- Sample-data fallback so the page renders without a backend.
- Tailwind 4 styling consistent with the form-side wizard.

## Columns

| Column        | Source field                  |
| ------------- | ----------------------------- |
| Case date     | `caseDate`                    |
| Patient       | `patientName`                 |
| Site          | `siteName`                    |
| Theatre / OR  | `operatingRoom`               |
| Surgeon       | `surgeonName`                 |
| Anaesthetist  | `anaesthetistName`            |
| Urgency       | `urgency`                     |
| Specialty     | `surgicalSpecialty`           |
| Status        | `status` (lifecycle)          |
| Flags         | `flagCount`                   |

## Run

```sh
pnpm install
pnpm dev
```

## Verify

```sh
pnpm run check
```
