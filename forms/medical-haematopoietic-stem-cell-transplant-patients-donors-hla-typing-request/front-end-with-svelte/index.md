# medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request: front-end-with-svelte

Questionnaire and dashboard (SvelteKit + Lily Design System). One continuous single-page wizard in eight sections, a vetting report, and a dashboard, served at `/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/`.

- `src/lib/engine/`: the four-axis engine, ported from `../front-end-with-html/js/` (the source of truth): `rules.ts` (axes A-D, required tubes per role), `flags.ts`, `grader.ts`, `defaults.ts`, `types.ts`, `utils.ts`. `grader.test.ts` is the vitest suite.
- `src/lib/components/steps/`: `Step1PersonSampled`, `Step2Referrer`, `Step3ClinicalDetails`, `Step4LinkedRecipient`, `Step5Urgency`, `Step6RequesterConsent`, `Step7Sample`, `Step8Laboratory`.
- `src/routes/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/`: welcome page, `medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-requests` (dashboard), `medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-requests/[id]` (wizard), `medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-requests/[id]/report`.
- Drafts persist under `medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request.front-end-with-svelte.<id>.v1` in `localStorage`.

This form must stay generic: no health service, laboratory or regional names.

## Verify

```sh
pnpm install
pnpm run check && pnpm run lint && pnpm run format:check
pnpm exec vitest run
VITE_FORM_EXAMPLES_SITE=1 pnpm run build
```
