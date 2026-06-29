# Provider Transfer Request — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for unit
tests.

Inter-provider handover (SBAR) wizard for transferring a patient's care between
clinicians, wards, or organisations. A single continuous nine-section wizard
captures requesting/receiving provider details, patient demographics, the SBAR
narrative (Situation, Background, Assessment, Recommendation), transfer
logistics, and a two-party sign-off and acknowledgement. The shared engine
validates SBAR completeness (Complete / Partial / Incomplete) and raises
clinically significant flags.

## Routes

- `/` — welcome page
- `/provider-transfer-requests` — clinician dashboard (SVAR DataGrid)
- `/provider-transfer-requests/[id]` — handover wizard (`new` or a sample id)
- `/provider-transfer-requests/[id]/report` — validation report
- `/provider-transfer-requests/[id]/report/pdf` — PDF endpoint

## Engine

`src/lib/engine/`: `types.ts`, `validation-rules.ts`, `transfer-validator.ts`,
`flagged-issues.ts`, `utils.ts`. Tests in `transfer-validator.test.ts`.
