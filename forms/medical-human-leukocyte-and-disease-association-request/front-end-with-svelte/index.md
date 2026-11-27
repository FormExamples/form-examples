# medical-human-leukocyte-and-disease-association-request: front-end-with-svelte

Questionnaire and dashboard (SvelteKit + Lily Design System). One continuous single-page wizard in eight sections, a vetting report, and a dashboard, served at `/medical-human-leukocyte-and-disease-association-request/`.

- `src/lib/engine/`: the four-axis engine, ported from `../front-end-with-html/js/` (the source of truth): `rules.ts` (axes A-D, required sample), `flags.ts`, `grader.ts`, `tests.ts` (the 8-test catalogue; volumes are local policy), `defaults.ts`, `types.ts`, `utils.ts`. `grader.test.ts` is the vitest suite.
- `src/lib/components/steps/`: `Step1Patient`, `Step2Referrer`, `Step3Tests`, `Step4ClinicalDetails`, `Step5UrgencyRisk`, `Step6RequesterConsent`, `Step7Sample`, `Step8Laboratory`.
- `src/routes/medical-human-leukocyte-and-disease-association-request/`: welcome page, `medical-human-leukocyte-and-disease-association-requests` (dashboard), `medical-human-leukocyte-and-disease-association-requests/[id]` (wizard), `medical-human-leukocyte-and-disease-association-requests/[id]/report`.
- Drafts persist under `medical-human-leukocyte-and-disease-association-request.front-end-with-svelte.<id>.v1` in `localStorage`.

This form must stay generic: no health service, laboratory or regional names.

## Verify

```sh
pnpm install
pnpm run check && pnpm run lint && pnpm run format:check
pnpm exec vitest run
VITE_FORM_EXAMPLES_SITE=1 pnpm run build
```
