# United Kingdom Vehicle Bill of Sale — Svelte front-end

SvelteKit + Lily Design System (Svelte headless) front-end for the private
vehicle bill of sale. One continuous single-page wizard (nine sections) plus a
dashboard and report page. Documentation support, not legal advice.

## What it does

The engine is a **completeness and validity** engine, not a numeric score. It
classifies a bill of sale as `complete`, `incomplete`, or `risk-flagged`
(precedence: `risk-flagged` > `incomplete` > `complete`), counts the missing
required items and risk conditions, and raises flagged issues (no VIN, no
mileage, finance outstanding, V5C missing, seller not the registered keeper,
payment risk, unsigned, description mismatch, and more). See
[`../spec/index.md`](../spec/index.md).

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`,
  `bill-of-sale-rules.ts`, `bill-of-sale-grader.ts`, `flagged-issues.ts`) with
  `bill-of-sale-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — Svelte 5 reactive store with
  localStorage persistence and `createDefaultBillOfSale()`.
- `src/lib/components/steps/` — `Step1Sale` to `Step9Signatures`.
- `src/routes/united-kingdom-vehicle-bill-of-sale/` — welcome page,
  `united-kingdom-vehicle-bills-of-sale/` dashboard, `[id]/` wizard,
  `[id]/report/` report and PDF.

## Verify

```sh
pnpm install && pnpm run check && pnpm exec vitest run && pnpm run lint && pnpm run format:check
```
