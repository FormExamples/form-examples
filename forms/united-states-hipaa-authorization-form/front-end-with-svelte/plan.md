# Plan: United States HIPAA Authorization Form — front-end (SvelteKit)

## Current status

Complete. Consolidated gold front-end: nine-step authorization wizard plus SVAR
DataGrid dashboard, driven by the shared HIPAA validity engine. `pnpm check`,
`pnpm build`, and `pnpm exec vitest run` all pass; the src tree uses Lily design
tokens only.

## Structure

- Validity engine in `src/lib/engine/` with Vitest tests.
- Step components `Step1Patient` … `Step9SignatureWitness` in
  `src/lib/components/steps/`.
- id-keyed reactive store in `src/lib/stores/authorization.svelte.ts`.
- RESTful routes under `src/routes/united-states-hipaa-authorization-forms/`:
  `/` (dashboard), `/[id]` (wizard), `/[id]/report`, `/[id]/report/pdf`; plus
  the welcome page and themed layout.
