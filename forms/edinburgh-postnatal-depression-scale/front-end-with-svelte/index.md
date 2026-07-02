# EPDS — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Edinburgh Postnatal Depression Scale
(EPDS): a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 scoring engine.

- **Wizard** — `/edinburgh-postnatal-depression-scales/[id]`: six sections
  (context, respondent identification, items 1-4, items 5-9, item 10 safety
  item, summary). Live per-item symptom-score pills and a running EPDS total.
- **Dashboard** — `/edinburgh-postnatal-depression-scales`: SVAR DataGrid with
  the engine-derived EPDS total, interpretation band, and self-harm flag; filter
  by care setting and band.
- **Report** — `/edinburgh-postnatal-depression-scales/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `epds-rules.ts`, `epds-grader.ts`,
`flagged-issues.ts`. Ten items, each scored 0-3; items 3, 5, 6, 7, 8, 9 and 10
are reverse-scored (`score = 3 - optionIndex`). The ten scores sum to a total
0-30; band is `>= 13` → likely, `>= 10` → possible, else lower. Item 10 > 0
raises a mandatory self-harm flag, independent of the total. Tests in
`epds-grader.test.ts`.

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
