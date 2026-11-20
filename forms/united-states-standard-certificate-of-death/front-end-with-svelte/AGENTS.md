# US Standard Certificate of Death: SvelteKit front-end (agent instructions)

SvelteKit 2 and Svelte 5 front-end for the US Standard Certificate of Death:
the eleven-step single-page wizard, the certifier dashboard, and the validity
report, built on the Lily Design System headless components. Routes are nested
under `src/routes/united-states-standard-certificate-of-death/`.

The engine in `src/lib/engine/` is a TypeScript port of the HTML front-end's
`js/{types,rules,grader,flags}.js`: `validateCertificate(data)` returns the
validity class (`valid` / `incomplete` / `refer-to-medical-examiner-or-coroner`),
the derived underlying cause, whether a referral is indicated, and the prioritized
flagged issues. It is documentation support, not legal advice; the registering
state agency decides.

## Layout

- `src/lib/engine/` — `types.ts`, `options.ts`, `defaults.ts` (`createDefaultCertificate`), `rules.ts` (including `STATE_RULES`), `grader.ts`, `flagged-issues.ts`, `utils.ts`, `grader.test.ts`.
- `src/lib/components/steps/` — `Step1StateAndDecedent` to `Step11Summary`.
- `src/lib/stores/assessment.svelte.ts` — the Svelte 5 store with localStorage drafts.
- `src/lib/data/sample-reports.ts` — sample certificates and dashboard rows (from `examples/personas.json`).
- `src/routes/united-states-standard-certificate-of-death/` — welcome page; `united-states-standard-certificates-of-death/` (dashboard), `/new` and `/[id]` (wizard), `/[id]/report` (report and PDF).

## Verify

```sh
pnpm install
pnpm run check && pnpm exec vitest run && pnpm run lint && pnpm run format:check
```
