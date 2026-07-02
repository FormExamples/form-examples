# 4AT — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the 4AT rapid delirium and
cognitive-impairment screen: a single continuous single-page wizard plus a
clinician dashboard, styled with the Lily Design System (Svelte headless) and
powered by a pure Svelte 5 scoring engine.

- **Wizard** — `/four-a-test-for-deliriums/[id]`: six sections (patient and
  assessment identification, item 1 alertness, item 2 AMT4, item 3 attention,
  item 4 acute change, summary). Live per-item score pills and running 4AT total.
- **Dashboard** — `/four-a-test-for-deliriums`: SVAR DataGrid with the
  engine-derived 4AT total, interpretation band, and delirium flag; filter by
  setting and interpretation band.
- **Report** — `/four-a-test-for-deliriums/[id]/report` with a server-generated
  PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `fourat-rules.ts`,
`fourat-grader.ts`, `flagged-issues.ts`. Sum-of-items: items 1 and 4 score 0 or
4, items 2 and 3 score 0, 1, or 2; total 0-12. A total of 4 or more is possible
delirium (`possibleDelirium`), 1-3 is possible cognitive impairment, 0 is
unlikely. Tests in `fourat-grader.test.ts`.

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
