# PACU Record — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Post-Anaesthesia Care Unit (PACU)
Record: a single continuous single-page wizard plus a recovery-team dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 scoring engine.

- **Wizard** — `/post-anaesthesia-care-unit-records/[id]`: ten sections
  (recovery context, patient identification, the five Modified Aldrete
  parameters, airway/pain/PONV, optional PADSS, summary). Live per-parameter
  sub-score pills, running Aldrete total, and live PADSS total.
- **Dashboard** — `/post-anaesthesia-care-unit-records`: SVAR DataGrid with the
  engine-derived Aldrete total, readiness band, and not-ready flag; filter by
  anaesthetic technique and readiness band.
- **Report** — `/post-anaesthesia-care-unit-records/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `pacu-rules.ts`, `pacu-grader.ts`,
`flagged-issues.ts`. Additive: five Modified Aldrete parameters (activity,
respiration, circulation, consciousness, oxygen saturation), each 0/1/2; total
0-10. Discharge-ready requires `aldreteTotal >= 9` **and**
`oxygenSaturationScore === 2` (SpO2-gated). An optional PADSS (five criteria,
0/1/2, total 0-10, >= 9 = street-fit) is summed for ambulatory cases. Tests in
`pacu-grader.test.ts` cover the 8/9 discharge boundary, the SpO2-gated case, all
parameter levels, and the PADSS >= 9 boundary.

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
