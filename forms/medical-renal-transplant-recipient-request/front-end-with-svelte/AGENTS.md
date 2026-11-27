# medical-renal-transplant-recipient-request: front-end-with-svelte

Questionnaire and dashboard (SvelteKit + Lily Design System). One continuous single-page wizard in seven sections, a vetting report, and a dashboard, served at `/medical-renal-transplant-recipient-request/`.

- `src/lib/engine/`: the four-axis engine, ported from `../front-end-with-html/js/` (the source of truth): `rules.ts` (axes A-D, required sample tubes), `flags.ts`, `grader.ts`, `tests.ts` (the 17-test catalogue, tube volumes are local policy), `defaults.ts`, `types.ts`, `utils.ts`. `grader.test.ts` is the vitest suite.
- `src/lib/components/steps/`: `Step1Recipient` ... `Step7Laboratory`.
- `src/routes/medical-renal-transplant-recipient-request/`: welcome page, `medical-renal-transplant-recipient-requests` (dashboard), `medical-renal-transplant-recipient-requests/[id]` (wizard), `medical-renal-transplant-recipient-requests/[id]/report`.
- Drafts persist under `medical-renal-transplant-recipient-request.front-end-with-svelte.<id>.v1` in `localStorage`.

This form must stay generic: no health service, laboratory or regional names.

## Verify

```sh
pnpm install
pnpm run check && pnpm run lint && pnpm run format:check
pnpm exec vitest run
VITE_FORM_EXAMPLES_SITE=1 pnpm run build
```
