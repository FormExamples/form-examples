# Hematology Waiting List Card — SvelteKit practitioner form

Single-page wizard for practitioners (GPs, consultants, referral
co-ordinators) to place a patient on a hematology waiting list. SvelteKit 2.x
with Svelte 5 runes and Tailwind CSS 4.

See the form-level [`../AGENTS.md`](../AGENTS.md) for the data model,
scoring engine, and conventions, and
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) for
shared Svelte conventions across the monorepo.

## Steps

The seven steps from the form-level
[`../index.md`](../index.md) are rendered as
`src/lib/components/steps/StepNName.svelte`:

1. `Step1Practitioner.svelte`
2. `Step2Patient.svelte`
3. `Step3Referral.svelte`
4. `Step4WaitingList.svelte`
5. `Step5Appointment.svelte`
6. `Step6Communication.svelte`
7. `Step7Signoff.svelte`

## Scoring engine

The pure scoring engine lives under `src/lib/engine/` with the modules
listed in [`../AGENTS.md`](../AGENTS.md) §Scoring engine. Vitest unit tests
sit alongside each module.

## PDF report

The card is rendered as a patient-facing PDF via a `+server.ts` endpoint
at `/report/pdf` using `pdfmake`.
