# United Kingdom Divorce Application — SvelteKit front-end (form + dashboard)

SvelteKit + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and the readiness engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness and time-gate** instrument: the engine emits an
application class (`ready-to-apply` / `incomplete` / `not-eligible-yet`), the
earliest eligible date for the stage, whether a jurisdiction ground is met, the
fired rules and a set of flagged issues. There is **no numeric score** and it
gives **no legal advice**.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`, `divorce-rules.ts`,
  `divorce-grader.ts`, `flagged-issues.ts`) + `divorce-grader.test.ts`, which
  pins the engine against the shared personas and the boundaries of each gate.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, `createDefaultApplication()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (7 steps: application, marriage, jurisdiction, parties, children, finances,
  progress).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample applications (one per persona) and
  engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/united-kingdom-divorce-application/united-kingdom-divorce-applications/`
  — RESTful routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]`
  (wizard) + `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Verify

```sh
pnpm install && pnpm run check && pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
