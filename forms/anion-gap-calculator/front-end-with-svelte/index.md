# Anion Gap Calculator — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit app that serves both the input wizard and the clinician
dashboard for the Anion Gap Calculator, sharing one pure calculation engine
(`src/lib/engine/`) and one Lily Design System (Svelte headless) component set
(`src/lib/components/ui/`).

The calculator computes the serum anion gap from a routine electrolyte panel,
derives an albumin-corrected gap, and classifies the result as low, normal,
high, or very high. It is a decision-support prompt, not a diagnosis.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the full specification, and [`../spec/index.md`](../spec/index.md) for the
living domain spec.

## Routes (RESTful, gold standard)

Collection resource: **`anion-gap-calculators`** (pluralized slug).

| Route file | URL | Purpose |
| --- | --- | --- |
| `src/routes/+page.svelte` | `/` | Welcome page (purpose, spec, documentation, links) |
| `src/routes/anion-gap-calculators/+page.svelte` | `/anion-gap-calculators/` | Dashboard (SVAR DataGrid; `ssr = false`) |
| `src/routes/anion-gap-calculators/[id]/+page.svelte` | `/anion-gap-calculators/[id]` | Single-page wizard (`[id] = new` to create) |
| `src/routes/anion-gap-calculators/[id]/report/+page.svelte` | `…/report` | Report view |
| `src/routes/anion-gap-calculators/[id]/report/pdf/+server.ts` | `…/report/pdf` | Server-side `pdfmake` PDF endpoint |

## Layout

- `src/lib/engine/` — pure calculation engine (`types.ts`, `utils.ts`,
  `anion-gap-rules.ts`, `anion-gap-grader.ts`, `flagged-issues.ts`) +
  `anion-gap-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence (`anion-gap-calculator.front-end-with-svelte.<id>.v1`), in-place
  `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts` (5 steps), `themes.ts`.
- `src/lib/data/sample-reports.ts` — four sample records spanning the
  classifications + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.

## Calculation engine

Formula-based (not additive). All electrolytes in mmol/L; albumin in g/L.

```
includesPotassium = potassium != null
anionGap = includesPotassium
             ? (sodium + potassium) − (chloride + bicarbonate)
             :  sodium              − (chloride + bicarbonate)
correctedAnionGap = albumin != null ? anionGap + 0.25 × (40 − albumin) : null
normalLow  = 8
normalHigh = includesPotassium ? 16 : 12
classificationValue = correctedAnionGap ?? anionGap
band = value >= 20 ? 'very-high' : value > normalHigh ? 'high'
     : value < normalLow ? 'low' : 'normal'
```

Classification uses the corrected gap when an albumin is available, so
hypoalbuminaemia does not mask a raised gap. The unrounded value drives
classification and every flag threshold; values are rounded to one decimal
place for display only. Flags: very-high (urgent), high (high),
hypoalbuminaemia-masking (high), low (medium), incomplete (low).

## Verify

```sh
pnpm install
pnpm run check && pnpm run build && pnpm exec vitest run
```
