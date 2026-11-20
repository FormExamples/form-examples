# United Kingdom Marriage Certificate Application — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification / validation engine. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness and validity-classification** instrument — the engine
emits a class (`ready-to-submit` / `incomplete` / `needs-evidence` /
`ineligible`), the permitted ceremony window, an immigration-referral
indication, and a set of flagged issues. There is **no numeric score**, and it
gives **no legal advice**.

## Layout

- `src/lib/engine/` — pure classification / validation engine (`types.ts`,
  `utils.ts`, `marriage-rules.ts`, `marriage-grader.ts`, `flagged-issues.ts`) +
  `marriage-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultApplication()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (6 steps: notice, ceremony, first party, second party, relationship, certificate order).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample applications + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/united-kingdom-marriage-certificate-applications/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`validateApplication(data)` evaluates eligibility, completeness and evidence,
assigns one class (precedence `ineligible` > `incomplete` > `needs-evidence` >
`ready-to-submit`), computes the ceremony window and immigration-referral
indication, and calls `detectFlaggedIssues`. All functions are pure — no I/O, no
clock, no legal decision.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Generic Lily `Badge`; no cardiovascular entry components.
- Engine tests use a LOCAL `createDefaultApplication` fixture (no store import).
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
