# SvelteKit dashboard — UK NHS England Medical Exemption Certificate (FP92A)

SvelteKit 2 + Svelte 5 runes + Tailwind 4 + Vite 7 dashboard listing FP92A
medical exemption certificate applications, with sortable columns and dropdown
filters for outcome, status, and qualifying condition. The data grid is the
SVAR DataGrid (`@svar-ui/svelte-grid`) using the **Willow** theme.

## Layout

```
src/
  app.css                                    # Tailwind 4 + NHS theme tokens
  app.d.ts
  app.html
  routes/
    +layout.svelte
    +page.svelte                             # Filter bar + SVAR data grid
  lib/
    index.ts
    types.ts                                 # ApplicationRow + label dicts
    data.ts                                  # bundled sample applications
    api.ts                                   # fetchApplications() with fallback
```

## Filters

- Free-text search across patient name, NHS number, and certificate number.
- Outcome (eligible / ineligible / requires-clarification).
- Status (draft, ready-to-post, posted, issued, rejected, expired).
- Condition (the 10 NHSBSA-recognised qualifying conditions).

## Backend

The dashboard calls `GET /api/dashboard/applications` on
`http://localhost:5150` (the Rust full-stack default). If that fails, the
bundled sample list from `src/lib/data.ts` is shown with a status note.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- camelCase property names.
- Svelte 5 runes (`$state`, `$derived`, `$effect`) — NOT old stores.
- Tailwind 4 with `@import 'tailwindcss';` + `@theme` tokens.

## Verify

```sh
pnpm install
pnpm run check
```
