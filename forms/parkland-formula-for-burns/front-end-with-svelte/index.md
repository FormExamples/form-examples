# Parkland Formula for Burns — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Parkland Formula for Burns: a single
continuous single-page wizard plus a clinician dashboard, styled with the Lily
Design System (Svelte headless) and powered by a pure Svelte 5 calculation
engine.

- **Wizard** — `/parkland-formula-for-burns-calculations/[id]`: seven sections
  (context, patient identification, body weight, burn extent, time of injury,
  injury features, summary). Live total-volume readout, elapsed-time and
  plan-status feedback.
- **Dashboard** — `/parkland-formula-for-burns-calculations`: SVAR DataGrid with
  the engine-derived 24 h volume, first-phase rate, and plan status; filter by
  care setting and status.
- **Report** — `/parkland-formula-for-burns-calculations/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Calculation engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `parkland-rules.ts`,
`parkland-grader.ts`, `flagged-issues.ts`. Formula-based:
`total24hVolumeMl = 4 × weightKg × tbsaPercent`, computed when both weight and
%TBSA are present; each phase is half the total. The 8h/16h split is measured
**from the time of injury**, so `remainingFirst8hHours = max(8 −
hoursSinceInjury, 0)` and `first8hRateMlPerHour = first8hVolumeMl ÷
remainingFirst8hHours` (null when overdue — the outstanding volume is given now);
`next16hRateMlPerHour = next16hVolumeMl ÷ 16`. Urine-output target is 0.5-1.0
mL/kg/h. Tests in `parkland-grader.test.ts` (70 kg × 30% → 8400 mL total, 4200
mL per phase, and the overdue > 8 h → null first-phase rate).

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
