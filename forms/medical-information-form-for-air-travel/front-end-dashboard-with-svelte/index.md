# MEDIF Dashboard — airline medical-desk review

SvelteKit 2.x + Svelte 5 dashboard that lists Medical Information Form for
Air Travel (MEDIF) submissions. Designed for use by airline medical-desk
reviewers and accessible-travel coordinators to triage requests by fitness
band, departure date, and safety-flag count.

## Features

- SVAR DataGrid with sortable columns and the Willow theme.
- Fitness-band filter dropdown.
- Sample-data fallback so the page renders without a backend.
- Tailwind 4 styling consistent with the form-side wizard.

## Columns

- Passenger
- Airline
- Flight number
- Departure date
- Fitness band (`fit` / `fit-with-conditions` / `requires-review` / `unfit-to-fly`)
- Safety-flag count
- Workflow status (`draft` / `submitted` / `reviewed` / `cleared` / `declined` / `urgent`)

## Develop

```sh
pnpm install
pnpm run dev
```

## Verify

```sh
pnpm run check
```
