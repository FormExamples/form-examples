# Inpatient Clinical Note — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and both engines, and [`../spec/index.md`](../spec/index.md)
for the living domain spec. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

Two engines run over each note: **completeness** (Complete / Partial /
Incomplete, never overridable) and **acuity** (Stable / Watch / Escalate /
Critical, overridable with a recorded reason). There is no single numeric score.

## Layout

- `src/lib/engine/` — pure engines: `types.ts`, `utils.ts`, `news2.ts`,
  `note-rules.ts`, `acuity.ts`, `note-grader.ts`, `flagged-issues.ts`, plus
  `note-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge. `createDefaultAssessment()`
  delegates to the engine's `emptyAssessment()` so the wizard and the engines
  cannot drift apart on the shape.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed), 12 steps.
- `src/lib/components/ui/` — Lily Svelte headless component set, plus
  `RowCard.svelte` for the repeating child-table collections.
- `src/lib/config/` — `steps.ts`, `options.ts`, `themes.ts`, `locales.ts`,
  `text-sizes.ts`.
- `src/lib/data/sample-reports.ts` — sample notes plus dashboard rows **derived
  by running the real engine**, so the dashboard can never show a grade the
  engine would not produce.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document carrying both gradings.
- `src/routes/inpatient-clinical-note/` — welcome page + RESTful routes under
  `inpatient-clinical-notes/`: `/` (dashboard, `ssr = false`), `/[id]` (wizard),
  `/[id]/report` (+ `report/pdf` server endpoint).

## Engines

```
requiredComponentKeys(noteType)  // 9..11 components, VARIES BY NOTE TYPE
completenessPercent = round(100 * documentedRequired / totalRequired)
status =
  (documentedRequired == totalRequired)                        -> 'complete'
  (header && impression && plan && documented >= ceil(R/2))    -> 'partial'
  otherwise                                                    -> 'incomplete'

acuityBand = max-band over the NEWS2 and deterioration-marker rules,
             default 'stable'; author may override WITH A REASON.
```

**Never hard-code a single required-component list.** The required set depends
on `noteType` — read it from `NOTE_TYPE_EXTRA_REQUIRED` in `types.ts` via
`requiredComponentKeys()` in `note-rules.ts`.

An explicit negative ("no interval events", "no medication changes") counts as
documented. `assess()` in `note-grader.ts` is the single entry point and returns
both grades, the per-component presence, the fired-rule audit trail from both
engines, and the safety flags.

The engine files are pure and have no DOM dependency — keep them that way so the
HTML front-end (`../front-end-with-html/js/`, the same logic in plain
JavaScript) and any test runner can stay aligned. When a rule changes here,
change it there in the same commit.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Child collections (`investigations.rows`, `problems.rows`,
  `medications.rows`, `planning.jobs`) are always arrays, never null.
- `src/lib/config/options.ts` mirrors the SQL CHECK constraints; when a
  constraint changes, change the option list in the same commit.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
