# Medical Certificate of Cause of Death — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification / validation engine. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **statutory documentation and validity-classification** instrument —
the engine emits a validity class (`valid` / `incomplete` / `refer-to-coroner`),
the derived underlying cause, whether a coroner referral is indicated, and a set
of flagged issues. There is **no numeric score**, and it does **not diagnose** or
replace the statutory judgement of the certifying doctor, coroner, or medical
examiner.

## Layout

- `src/lib/engine/` — pure classification / validation engine (`types.ts`,
  `utils.ts`, `mccd-rules.ts`, `mccd-grader.ts`, `flagged-issues.ts`) +
  `mccd-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultCertificate()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (6 steps: certification, deceased, death, Part I, Part II, referral).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/medical-certificates-of-cause-of-death/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`validateCertificate(data)` evaluates the coroner-referral criteria, the
completeness of Part I, and the acceptability of the stated cause, assigns
exactly one validity class (first match wins:
`refer-to-coroner` > `incomplete` > `valid`), derives the underlying cause (the
lowest completed Part I line), and calls `detectFlaggedIssues`. All functions are
pure — no I/O, no diagnostic decision.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Generic Lily `Badge`; no cardiovascular entry components.
- Engine tests use a LOCAL `createDefaultCertificate` fixture (no store import).
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
