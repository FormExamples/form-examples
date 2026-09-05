# Agent notes — Svelte form (SvelteKit)

SvelteKit single-page wizard for the OKR tracker. All ten steps render on one
scrollable page; state is a Svelte-5 runes store.

## Files

- `svelte.config.js` / `vite.config.ts` / `tailwind.config.ts` — toolchain
- `playwright.config.ts` — e2e config (Vite dev server on port 5173, `testIdAttribute: 'data-test'`)
- `src/app.html`, `src/app.css` — app shell, Tailwind import
- `src/routes/+layout.svelte`, `src/routes/+page.svelte` — wizard chrome and Step01..Step10 orchestration
- `src/lib/engine/` — scoring engine (from Plan 1, unchanged)
- `src/lib/stores/formState.svelte.ts` — Svelte-5 runes store
- `src/lib/components/ui/Step01..Step10*.svelte`, `RagBadge.svelte`, `FlagList.svelte`
- `e2e/fixtures.spec.ts` — drives the engine over the 14 shared fixtures
- `e2e/ui-driving.spec.ts` — fills fixture 01 through the actual UI

## Conventions

- Svelte 5 with runes (`$state`, `$props`); no `$:`, no stores from `svelte/store`
- Tailwind 4 via `@tailwindcss/vite`, single `@import 'tailwindcss';` in `app.css`
- Path aliases: `$engine`, `$stores`, `$ui`
- Empty strings for unanswered text fields; `null` for unanswered numerics
- `data-step="N"` attribute on each step section; `data-test="..."` on action buttons and the result panel

## Parent docs

- [`../AGENTS.md`](../AGENTS.md)
- [Design spec](../spec/index.md)
