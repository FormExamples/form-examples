# ICVP — SvelteKit front-end form — agent instructions

Single-page eight-step wizard for the WHO International Certificate of
Vaccination or Prophylaxis. Computes per-entry validity (yellow fever:
vaccination + 10 days; lifetime override per 2016 IHR amendment) and the
fired-rule report, and produces a printable PDF certificate.

## Stack

- SvelteKit 2.x, Svelte 5 runes, TypeScript strict.
- Tailwind CSS 4 with `@import "tailwindcss";` in `src/app.css` and
  `@tailwindcss/vite` in `vite.config.ts`.
- `pdfmake` for PDF generation.
- Vitest for engine unit tests.

## Conventions

- camelCase TypeScript property names.
- Empty string `''` for unanswered text / enum fields; `null` for
  unanswered numeric fields.
- Step components named `Step0NName.svelte` (2-digit, 1-indexed).
- UI primitives in `src/lib/components/ui/`.
- Engine files in `src/lib/engine/` with a single
  `validateCertificate(data: Certificate): ValidationReport` entry point.
- Reactive store in `src/lib/stores/certificate.svelte.ts` using `$state`.
- Route matcher at `src/params/step.ts` rejects anything outside 1–8.

## Engine contract

```ts
export function validateCertificate(data: Certificate): ValidationReport;
```

No side effects. No network calls. No `Date.now()` inside rules. Tests pin
all expected outputs per rule (VAL001..VAL012).

## PDF report

Client route `/report`. Uses `pdfmake`. Includes the centre, supervising
clinician, the vaccinee identity, each vaccination entry with manufacturer
and batch number, validity dates, the centre stamp, and the electronic
signature.

## Accessibility

WCAG 2.2 AA target. All inputs have associated `<label>`. Progress bar
announced via `aria-live`. Colour contrast meets AA. Keyboard-only
navigation of the wizard verified.
