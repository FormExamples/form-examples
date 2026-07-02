# Bhutani Bilirubin Nomogram — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Bhutani Bilirubin Nomogram: a single
continuous single-page wizard plus a clinician dashboard, styled with the Lily
Design System (Svelte headless) and powered by a pure Svelte 5 classification
engine.

- **Wizard** — `/bhutani-bilirubin-nomograms/[id]`: five sections (context,
  infant identification, bilirubin measurement, risk factors, summary). Live
  risk-zone badge and treatment-threshold comparison.
- **Dashboard** — `/bhutani-bilirubin-nomograms`: SVAR DataGrid with the
  engine-derived risk zone, TSB, and treatment-threshold signals; filter by care
  setting and risk zone.
- **Report** — `/bhutani-bilirubin-nomograms/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Classification engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `bhutani-rules.ts`,
`bhutani-grader.ts`, `flagged-issues.ts`. Classification (not additive scoring):
two independent lookups against tabulated curves. (a) Interpolate the
40th/75th/95th Bhutani percentile TSB tracks at `ageHours` and band the measured
TSB into a risk zone (low / low-intermediate / high-intermediate / high). (b)
Select the phototherapy and exchange-transfusion curves for the infant's
gestation band, interpolate at `ageHours`, and set `abovePhototherapy` /
`aboveExchange`. `ageHours` is clamped to the nomogram domain (0–168 h);
out-of-range or missing inputs yield a `null` zone plus a data flag. Tests in
`bhutani-grader.test.ts`.

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
