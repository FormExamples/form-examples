# TIMI UA/NSTEMI — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the TIMI Risk Score for Acute Coronary
Syndrome (UA/NSTEMI): a single continuous single-page wizard plus a clinician
dashboard, styled with the Lily Design System (Svelte headless) and powered by a
pure Svelte 5 scoring engine.

- **Wizard** — `/timi-risk-score-for-acute-coronary-syndromes/[id]`: seven
  sections (context, patient identification, age and risk factors, cardiac
  history and medication, presentation, investigations, summary). Live
  per-criterion point pills and a running TIMI score.
- **Dashboard** — `/timi-risk-score-for-acute-coronary-syndromes`: SVAR DataGrid
  with the engine-derived TIMI score, risk band, and 14-day event risk; filter
  by care setting and risk band.
- **Report** — `/timi-risk-score-for-acute-coronary-syndromes/[id]/report` with
  a server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `timi-rules.ts`, `timi-grader.ts`,
`flagged-issues.ts`. Additive: seven criteria (age &ge; 65; &ge; 3 coronary risk
factors; known CAD; aspirin in the prior 7 days; &ge; 2 anginal episodes in 24
h; ST deviation &ge; 0.5 mm; positive cardiac marker), each 1 point; total 0-7;
band 0-1 low, 2-4 intermediate, 5-7 high; the total maps to the 14-day risk of
death, MI, or urgent revascularisation. Tests in `timi-grader.test.ts`.

This is the UA/NSTEMI instrument only; a separate TIMI STEMI score exists.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for the
dashboard. See [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)
for the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check     # svelte-check (0 errors, 0 warnings)
pnpm run build     # production build
pnpm exec vitest run   # engine unit tests
```
