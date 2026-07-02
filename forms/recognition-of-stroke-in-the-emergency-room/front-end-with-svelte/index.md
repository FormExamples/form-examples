# ROSIER — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for Recognition Of Stroke In the Emergency Room
(ROSIER): a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 scoring engine.

- **Wizard** — `/recognition-of-stroke-in-the-emergency-rooms/[id]`: six sections
  (context, patient identification, blood-glucose precondition, mimic exclusions,
  neurological signs, summary). Live per-criterion signed point pills and a
  running signed ROSIER score.
- **Dashboard** — `/recognition-of-stroke-in-the-emergency-rooms`: SVAR DataGrid
  with the engine-derived ROSIER score, band, and pathway-activation flag; filter
  by care setting and band.
- **Report** — `/recognition-of-stroke-in-the-emergency-rooms/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `rosier-rules.ts`, `rosier-grader.ts`,
`flagged-issues.ts`. Signed additive: two mimic criteria (loss of consciousness /
syncope, seizure activity) subtract 1 point each; five acute-onset neurological
signs (asymmetric facial / arm / leg weakness, speech disturbance, visual field
defect) add 1 point each; the signed total ranges -2..+5; ROSIER > 0 is a
positive screen (`stroke-likely`). Blood glucose is a precondition — a value
< 3.5 mmol/L flags the hypoglycaemia mimic. Tests in `rosier-grader.test.ts`.

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
