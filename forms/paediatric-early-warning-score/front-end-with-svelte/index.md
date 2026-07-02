# PEWS — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Paediatric Early Warning Score
(PEWS): a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 scoring engine.

- **Wizard** — `/paediatric-early-warning-scores/[id]`: seven sections (context,
  patient and age band, respiratory, cardiovascular, behaviour/ACVPU, documented
  concern, review). The age band is selected first — it sets the normal ranges
  for the two rate parameters. Live per-parameter subscore pills and a running
  aggregate PEWS total.
- **Dashboard** — `/paediatric-early-warning-scores`: SVAR DataGrid with the
  engine-derived aggregate, escalation band, single-parameter trigger, and
  monitoring frequency; filter by escalation band and age band.
- **Report** — `/paediatric-early-warning-scores/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `pews-rules.ts`, `pews-grader.ts`,
`flagged-issues.ts`. Ported faithfully from the tested HTML front-end. Seven
parameters are scored 0-3: respiratory rate and heart rate against the NORMAL
RANGE FOR THE SELECTED AGE BAND (the age-band selection is the key logic), and
respiratory effort, SpO2, supplemental oxygen, capillary refill, and ACVPU
consciousness from their enum / numeric value. The sub-scores sum to an
aggregate; the escalation band is derived from the total (>=6 high, 4-5 medium,
2-3 low, else routine). Override triggers — a single parameter scoring 3, and
documented nurse or parent/carer concern — raise the effective escalation
without changing the total. Tests in `pews-grader.test.ts` cover each age band's
rate boundaries, every parameter's 0-3 thresholds, the single-parameter=3
override, the concern triggers, and each escalation-band boundary.

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
