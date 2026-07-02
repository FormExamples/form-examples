# ZBI — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Zarit Burden Interview (ZBI): a single
continuous single-page wizard plus a clinician dashboard, styled with the Lily
Design System (Svelte headless) and powered by a pure Svelte 5 scoring engine.

- **Wizard** — `/zarit-burden-interviews/[id]`: five sections (context, carer
  details, care recipient details, the 22 burden items, summary). Live per-item
  rating pills and a running ZBI total that follows the selected instrument
  form.
- **Dashboard** — `/zarit-burden-interviews`: SVAR DataGrid with the
  engine-derived ZBI total, instrument form, burden band, and flag count; filter
  by care setting and band.
- **Report** — `/zarit-burden-interviews/[id]/report` with a server-generated
  PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `zarit-rules.ts`, `zarit-grader.ts`,
`flagged-issues.ts`. Twenty-two items, each rated 0-4 on a frequency scale; no
reverse-scoring. The grader sums the answered ratings over the active item set —
ZBI-22 (all 22 items, total 0-88) or ZBI-12 (the 12-item short-form subset,
total 0-48). Bands: ZBI-22 0-21 / 22-40 / 41-60 / 61-88; ZBI-12 `>= 17` high,
else lower. Item 22 (global burden) drives the carer mental-health and
high-global-burden flags independently of the total. Tests in
`zarit-grader.test.ts`.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for the
dashboard. See [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)
for the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors, 0 warnings
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
