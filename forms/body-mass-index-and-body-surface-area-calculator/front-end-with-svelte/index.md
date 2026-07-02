# Body Mass Index and Body Surface Area Calculator — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Body Mass Index and Body Surface Area
Calculator: a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 calculation engine.

- **Wizard** — `/body-mass-index-and-body-surface-area-calculators/[id]`: five
  sections (context, patient identification, measured height, measured weight,
  summary). Live BMI, WHO category badge, and BSA readout.
- **Dashboard** — `/body-mass-index-and-body-surface-area-calculators`: SVAR
  DataGrid with the engine-derived BMI, WHO category, BSA, and severe flag;
  filter by care setting and WHO category.
- **Report** — `/body-mass-index-and-body-surface-area-calculators/[id]/report`
  with a server-generated PDF (`pdfmake`).

## Calculation engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `bmi-bsa-rules.ts`,
`bmi-bsa-grader.ts`, `flagged-issues.ts`. Formula-based:

- `BMI = weightKg ÷ (heightCm ÷ 100)²` (kg/m²)
- `BSA (Mosteller) = √((heightCm × weightKg) ÷ 3600)` (m²)
- `BSA (Du Bois) = 0.007184 × heightCm^0.725 × weightKg^0.425` (m²)

Computed only when both inputs are present and positive; the unrounded BMI is
banded into the WHO adult weight-status categories (underweight / normal /
overweight / obese class I-III). Severe obesity (≥ 40) and underweight (< 18.5)
are flagged, and the Asian action points (≥ 23, ≥ 27.5) are recorded when
ancestry is Asian. Tests in `bmi-bsa-grader.test.ts`.

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
