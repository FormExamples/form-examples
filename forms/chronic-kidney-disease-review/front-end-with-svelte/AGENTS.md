# Chronic Kidney Disease Annual Review — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the CKD-review specification and classification engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and classification** form — the engine derives the
KDIGO G-stage (G1–G5) from the eGFR, the albuminuria stage (A1–A3) from the
urine ACR, indexes the pair into the KDIGO risk zone (low / moderate / high /
very-high), grades review completeness, and raises flags. There is no numeric
score.

## Layout

- `src/lib/engine/` — pure KDIGO-classification-and-completeness engine
  (`types.ts`, `utils.ts`, `ckd-review-rules.ts`, `ckd-review-grader.ts`,
  `flagged-issues.ts`) + `ckd-review-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (8 steps: context, patient, renal, albuminuria, blood pressure, medication,
  bloods, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (KDIGO classification +
  completeness, not a score).
- `src/routes/chronic-kidney-disease-reviews/` — RESTful routes: `/<plural>/`
  (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

KDIGO classification and documentation completeness (no total):

```
gfrCategory   = G1 (≥90) | G2 (60–89) | G3a (45–59) | G3b (30–44) | G4 (15–29) | G5 (<15) | null
albuminuria   = A1 (<3) | A2 (3–30) | A3 (>30) | null
kdigoRiskZone = low | moderate | high | very-high | null  (G × A heat-map)
bpTarget      = 130/80 when ACR ≥ 70 or diabetes; else 140/90
reviewStatus  = incomplete (no eGFR, or ≥2 items missing) | complete (all items) | partial
```

`review()` returns the G-stage, albuminuria stage, KDIGO risk zone, the
blood-pressure target and at-target flag, the review status and completeness
score, the per-component documented flags, the fired-criterion audit trail, and
the flags.

## Conventions

- British English throughout.
- Empty string `''` for unanswered text / enum fields; `null` for numeric/date.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.
- HTML entities (`&lt; &gt; &le; &ge;`) in Svelte template text where a literal
  comparison symbol is required.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
