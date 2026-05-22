# Front-end form with SvelteKit — UK LPA for Financial Decisions

A SvelteKit 2 + Svelte 5 + Tailwind CSS 4 implementation of the 15-step
single-page wizard for the OPG form LP1F. The wizard captures the donor,
attorneys, replacement attorneys, certificate provider, people to notify,
preferences and instructions, all signatures, and the registration
application; runs the validator against every change; and previews the
final LPA for printing or PDF export.

See [`../index.md`](../index.md) for the form spec and the 15-step table.

## Stack

- SvelteKit 2 + TypeScript.
- Svelte 5 runes: `$state`, `$derived`, `$bindable`, `$props`.
- Tailwind CSS 4 with `@import 'tailwindcss';` in `src/app.css`.
- `pdfmake` for the printable LP1F replica PDF.
- Vitest for validator unit tests.

## Layout

- `src/lib/types.ts` — `Lpa` type and sub-types matching the SQL tables.
- `src/lib/factory.ts` — empty-LPA factory.
- `src/lib/stores/lpa.svelte.ts` — runes-backed store with mutation helpers.
- `src/lib/validator/` — pure-function validator returning fired blocker
  rules, additional flags, validity band, and composite risk.
- `src/lib/components/ui/` — generic UI primitives.
- `src/lib/components/steps/Step1Donor.svelte` …
  `Step15RegistrationSignature.svelte` — one component per LP1F section.
- `src/routes/+page.svelte` — landing.
- `src/routes/lpa/[step=step]/+page.svelte` — wizard, step matcher 1–15.

## Run

```sh
pnpm install
pnpm run dev
pnpm run check
pnpm test
```
