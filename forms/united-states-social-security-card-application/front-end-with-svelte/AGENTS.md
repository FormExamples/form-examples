# Social Security Card Application (Form SS-5) — SvelteKit front-end (form + dashboard)

SvelteKit + Lily Design System front-end for the United States Social Security
card application: a single continuous wizard plus a preparer dashboard.

This is a **documentation-support and completeness** instrument. The engine
emits an application class (`ready-to-submit` / `incomplete` /
`evidence-missing` / `not-eligible`), an evidence-gap count, whether a
replacement limit is reached, and a set of flagged issues. It is not legal advice,
and the Social Security Administration decides every application. The Social
Security number is never collected.

## Layout

- `src/lib/engine/` — `types.ts`, `defaults.ts` (`createDefaultApplication()`),
  `utils.ts` (option lists and labels), `ss5-rules.ts`, `ss5-grader.ts`,
  `flagged-issues.ts`, and `ss5-grader.test.ts` (which also replays
  `../examples/personas.json`, the oracle shared with the HTML engine).
- `src/lib/stores/assessment.svelte.ts` — Svelte 5 store with localStorage
  persistence and an in-place `deepAssign` deep-merge.
- `src/lib/components/steps/` — six steps: request, applicant, evidence, signer,
  Tell SSA, summary.
- `src/routes/united-states-social-security-card-application/united-states-social-security-card-applications/` — RESTful routes: the dashboard
  (`/`), the wizard (`/[id]`, `/new`), the report, and a PDF endpoint.

## Verify

```sh
pnpm install
pnpm run check
pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
