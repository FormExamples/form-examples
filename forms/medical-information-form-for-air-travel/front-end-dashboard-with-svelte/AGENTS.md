# Front-end dashboard (SvelteKit) — Medical Information Form for Air Travel

SvelteKit 2.x + Svelte 5 dashboard for airline medical-desk review of MEDIF
submissions. Wraps SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow
theme. Shows passenger, airline, flight, departure date, fitness band, flag
count, and status.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes
- Tailwind CSS 4
- SVAR DataGrid (`@svar-ui/svelte-grid` 2.x) with the Willow theme

## Directory map

```
src/
  app.html
  app.css
  app.d.ts
  routes/
    +layout.svelte
    +page.svelte
  lib/
    dashboard.svelte                Wraps SVAR Grid (Willow theme)
    sample-data.ts                  Sample MEDIF rows
```

## Columns

| Column        | Source field                  |
| ------------- | ----------------------------- |
| Passenger     | `passenger`                   |
| Airline       | `airline`                     |
| Flight        | `flight`                      |
| Departure     | `outboundDate`                |
| Fitness band  | `band`                        |
| Flags         | `flagCount`                   |
| Status        | `status`                      |

## Filters

- Fitness band: all / fit / fit-with-conditions / requires-review / unfit-to-fly.

## Verify

```sh
pnpm install
pnpm run check
```
