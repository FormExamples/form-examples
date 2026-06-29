# UK LPA for Health and Care Decisions — SvelteKit wizard — Agent Instructions

Single-page LP1H wizard. 14 steps. Computes statutory validity, raises
fired-rule and ambiguity flags, and produces an OPG-ready PDF.

## Stack

- SvelteKit 2, Svelte 5 runes, TypeScript strict, Tailwind CSS 4,
  pdfmake, Vitest.

## Conventions

- camelCase TypeScript property names.
- Empty string `''` for unanswered text / enum fields; `null` for
  unanswered numeric fields.
- Step components named `StepNNName.svelte` (2-digit, 1-indexed).
- UI components in `src/lib/components/ui/`.
- Engine files in `src/lib/engine/` with a single `calculateLpaValidity()`
  pure function as the entry point.
- Reactive store in `src/lib/stores/lpa.svelte.ts` using `$state` runes.
- Route matcher at `src/params/step.ts` rejects anything outside 1-14.

## Engine contract

```ts
export function calculateLpaValidity(data: LpaApplication): LpaValidityResult;
```

No side effects. No network calls. No `Date.now()` inside rules. Tests pin
expected outputs per rule.

## Rules

See `../doc/rule-catalogue.md` and `../AGENTS.md` for the canonical rule
catalogue. Every rule has a stable identifier rooted in its statutory
source (`R-MCA-S9-AGE`, `R-MCA-CP-FAM`, `R-MCA-ORDER`, `R-MCA-LST-CHOICE`,
`R-MCA-COP-PROHIBITED`, …).

## PDF report

Server route `/report/pdf`. Uses `pdfmake`. Generates an LP1H-formatted
PDF mirroring the statutory paper form, with fired rules and flags
appended as an annotated summary.

## Testing

Vitest in `src/lib/engine/composite-validator.test.ts`. Coverage of:

- Empty application → `invalid` (donor age fatal).
- Each fatal rule fires correctly (donor age, attorney age, certificate
  provider family-exclusion, sign-order, life-sustaining-treatment
  choice).
- High-severity rules return `needs-correction` when no fatal rules fire.
- Mixed-decision-rule requires explicit joint-decision set
  (`R-MCA-JOINT-MIXED-SCOPE`).
- Sign-order verified across donor / certificate provider / attorneys.
- ADRT-contradiction detected when paired ADRT row supplied.

Run with `pnpm exec vitest run`.

## Accessibility

WCAG 2.2 AA target. All inputs have associated `<label>`. Progress bar
announced via `aria-live`. Colour contrast meets AA. Keyboard-only
navigation of every step.
