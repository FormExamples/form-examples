# Return to Work — SvelteKit form Agent Instructions

SvelteKit 2 single-page clinician wizard. See [`index.md`](./index.md)
for the design overview and step-to-route map.

## Stack

- SvelteKit 2.x + Svelte 5 runes
- TypeScript strict
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests

## Conventions

- camelCase property names in TypeScript.
- Empty string `''` for unanswered text / enum fields; `null` for
  unanswered numeric / date fields.
- Step components named `StepNNName.svelte` (1-indexed, zero-padded).
- UI primitives in `src/lib/components/ui/`.
- Step config in `src/lib/config/steps.ts`.
- Restriction enum catalogue in `src/lib/config/restriction-catalogue.ts`.

## Engine

The composite grader in `src/lib/engine/composite-grader.ts` is a
pure function:

```ts
calculateReturnToWork(data: ReturnToWorkAssessment): {
  fitnessStatement: 'fit' | 'may-be-fit' | 'not-fit';
  restrictionPriority: 'routine' | 'standard' | 'restricted' | 'high-risk';
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
```

- `fitness-rules.ts` returns the fitness statement.
- `restriction-rules.ts` walks the restriction list and returns the
  restriction-priority grade.
- `flagged-issues.ts` returns the additional safety flags.

## Tests

- `composite-grader.test.ts` — happy-path and rule-fire cases.
- `restriction-rules.test.ts` — every enumerated restriction kind.

## Running

```sh
pnpm install
pnpm run dev
pnpm exec vitest run
pnpm run check
```
