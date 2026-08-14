# Abdominal Aortic Aneurysm (AAA) Screening — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the AAA Screening form: a single continuous
single-page wizard plus a clinician dashboard, styled with the Lily Design
System (Svelte headless) and powered by a pure Svelte 5 classification engine.

- **Wizard** — `/abdominal-aortic-aneurysm-screenings/[id]`: six sections
  (scan context, patient identification and eligibility, consent, ultrasound
  measurement, clinical observations, summary). Live diameter classification and
  surveillance-band readout.
- **Dashboard** — `/abdominal-aortic-aneurysm-screenings`: SVAR DataGrid with
  the engine-derived maximum aortic diameter, category, and referral flag;
  filter by eligibility route and category.
- **Report** — `/abdominal-aortic-aneurysm-screenings/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Classification engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `aaa-rules.ts`, `aaa-grader.ts`,
`flagged-issues.ts`. Classification (not an additive score): the maximum
antero-posterior aortic diameter is classified against fixed NHS AAA Screening
Programme thresholds — normal (`< 3.0 cm`), small (`3.0-4.4 cm`), medium
(`4.5-5.4 cm`), large (`>= 5.5 cm`) — with a non-visualized guard when the aorta
was not adequately measured. Each category maps to a surveillance/referral band
(discharge / annual / three-monthly / refer-vascular / rescan). Growth since the
prior scan feeds a rapid-growth flag. Tests in `aaa-grader.test.ts` cover each
threshold boundary (2.9/3.0, 4.4/4.5, 5.4/5.5 cm), the non-visualized guard,
every category, and the growth calculation.

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
