# United States Marriage License Application — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../spec/index.md`](../spec/index.md)
for the specification, the state rule table, and the classification engine. Lily
Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation-support and eligibility-classification** instrument:
the engine emits an application class (`ready-to-apply` / `incomplete` /
`not-eligible`), the earliest permitted ceremony date, the license expiry, and a
set of flagged issues. It is **not legal advice**; the issuing county clerk or a
court decides.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`, `rules.ts` with
  `STATE_RULES`, `application-grader.ts`, `flagged-issues.ts`) +
  `application-grader.test.ts`, which also replays `../examples/personas.json`
  against the engine to keep the HTML and Svelte engines in lockstep.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge. `createDefaultApplication()`
  lives in `engine/utils.ts`, not the store, so tests never import
  `$app/environment`.
- `src/lib/components/steps/` — `Step1Jurisdiction` to `Step6Ceremony`.
- `src/routes/united-states-marriage-license-application/` — welcome page;
  `united-states-marriage-license-applications/` (dashboard), `/new` and
  `/[id]` (wizard), `/[id]/report` (report and PDF).

## Verify

```sh
pnpm install
pnpm run check
pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
