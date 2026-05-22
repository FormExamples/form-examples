# US HIPAA Authorization — patient form (SvelteKit)

SvelteKit 2.x + Svelte 5 + Tailwind CSS 4 implementation of the 9-step
HIPAA-authorization wizard.

## Stack

- SvelteKit 2.x with Vite
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- TypeScript
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF generation
- Vitest for engine unit tests
- Playwright for end-to-end tests (optional)

## Routes

- `/` — landing page with "Start a new authorization" call-to-action.
- `/authorization/[step=step]` — dynamic step route validating 1..9.
- `/report/pdf` — server endpoint that streams a PDF of the signed
  authorization.

## Step components

`src/lib/components/steps/StepNName.svelte` (1-indexed):

- `Step1PatientIdentification.svelte`
- `Step2SignerIdentification.svelte`
- `Step3DisclosingSource.svelte`
- `Step4AuthorizedRecipient.svelte`
- `Step5RecordsToDisclose.svelte`
- `Step6PurposeOfDisclosure.svelte`
- `Step7Expiration.svelte`
- `Step8PatientRightsAcknowledgement.svelte`
- `Step9SignatureWitness.svelte`

## Validation engine

Implemented in `src/lib/engine/`:

- `types.ts` — `HipaaAuthorization` type and `emptyAuthorization()`.
- `validation-rules.ts` — § 164.508 core-element and required-statement
  rules.
- `sensitive-category-rules.ts` — 42 CFR Part 2, HIV/AIDS, mental
  health, psychotherapy notes, VA records.
- `flagged-issues.ts` — additional flags (minor, reproductive-health,
  duration).
- `validate-authorization.ts` — engine entrypoint exporting
  `validateAuthorization()`.

## Develop

```sh
pnpm install
pnpm dev
```

## Verify

```sh
pnpm test           # Vitest
pnpm exec playwright test   # optional end-to-end
```
