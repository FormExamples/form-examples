# Theatre Review SvelteKit Dashboard — Agent Instructions

SvelteKit dashboard with SVAR DataGrid for reviewing submitted op notes.
Displays composite operative risk, Clavien–Dindo grade, safety flags,
never-event candidacy, and sign-off status per case.

## Files

- `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`
- `src/app.css`, `src/app.html`, `src/app.d.ts`
- `src/lib/api.ts` — fetch with sample-data fallback
- `src/lib/sample-data.ts` — 12 synthetic op-note rows spanning all four
  composite-risk bands (routine / complicated / high-risk / critical) and
  a mix of specialties, NCEPOD urgencies, never-event flagging and
  sign-off states
- `src/lib/columns.ts` — SVAR DataGrid column definitions
- `src/lib/badges/` — RiskBadge, ClavienDindoBadge, UrgencyBadge,
  SignedBadge, NeverEventBadge, CountsBadge
- `src/routes/+layout.svelte`, `src/routes/+page.svelte` — dashboard

## Conventions

- camelCase property names (matches the Loco / Tera back-end serde).
- Synthetic patient labels (`Pt-001`, …). Never use real NHS numbers or
  real patient data.
- Risk band colour scale (per [`src/app.css`](src/app.css)):
  routine = emerald, complicated = amber, high-risk = orange, critical = red.
- Filter dropdowns are inline `<select>` elements — `bin/lily-svelte-refactor`
  flags these as risky lines (informational only; `--check` does not fail).

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
```

From the repo root:

```sh
bin/lily-svelte-refactor --check medical-operation-note
```
