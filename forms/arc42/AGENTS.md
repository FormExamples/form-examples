# arc42 Architecture Documentation Form — Agent Instructions

Single-page wizard that guides an architect through arc42's **12-step
documentation template**, computes per-section completeness (`empty` /
`partial` / `complete`), derives a composite maturity band
(Draft / Reviewable / Ready / Mature) via a max-grade algorithm, fires
independent flags for architecturally critical omissions, and emits a signed
arc42 document in HTML, PDF, AsciiDoc, FHIR R5 Bundle, and XML.

See [`index.md`](./index.md) for the full design and the 12-step wizard table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — reference documentation (arc42 overview, completeness rules,
  maturity rules, ADR format, safety-case notes)
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./front-end-form-with-svelte/` — SvelteKit 12-step architect wizard
- `./front-end-form-with-html/` — placeholder (follow-up session)
- `./front-end-dashboard-with-html/` — placeholder
- `./front-end-dashboard-with-svelte/` — placeholder
- `./back-end-with-loco/` — placeholder

## Scoring engine

- **Input shape:** `Arc42Documentation` TypeScript type containing prose fields
  directly on the top-level object plus child arrays:
  `businessGoals`, `qualityGoals`, `stakeholders`, `constraintItems`,
  `contextPartners`, `technologyDecisions`, `buildingBlocks`,
  `runtimeScenarios`, `deploymentNodes`, `crosscuttingConcepts`,
  `architecturalDecisions`, `qualityScenarios`, `riskItems`, `glossaryTerms`.

- **Output shape:**
  ```ts
  calculateMaturity(d: Arc42Documentation): {
    computedMaturity: 'Draft' | 'Reviewable' | 'Ready' | 'Mature';
    finalMaturity: 'Draft' | 'Reviewable' | 'Ready' | 'Mature';
    completenessBySection: Record<1|2|3|4|5|6|7|8|9|10|11|12,
                                  'empty' | 'partial' | 'complete'>;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```

- **Algorithm (max-grade):**
  1. Evaluate per-section completeness (`empty` / `partial` / `complete`) using
     the thresholds in `doc/completeness-rules.md`.
  2. Derive `computedMaturity` from the lowest completeness across all 12
     sections, checked against the four band drivers in `doc/maturity-rules.md`.
  3. Fire independent flags (high / medium / low priority) from
     `doc/maturity-rules.md`; flags do not alter the maturity calculation.
  4. Apply any author override from step 12 to produce `finalMaturity`.
  5. Store both `computedMaturity` and `finalMaturity`.

- **Engine files:**
  - `src/lib/grading/types.ts` — `Arc42Documentation` + sub-types
  - `src/lib/grading/utils.ts` — cardinality + completeness helpers
  - `src/lib/grading/completeness-rules.ts` — per-section completeness rules
  - `src/lib/grading/maturity-grader.ts` — `calculateMaturity()` pure function
  - `src/lib/grading/flagged-issues.ts` — `detectFlags()`
  - `src/lib/grading/completeness-rules.test.ts`
  - `src/lib/grading/maturity-grader.test.ts`

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed, e.g.
  `Step1Introduction.svelte` … `Step12Summary.svelte`).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` timestamps on every table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests
- Dynamic step route `/documentation/[step=step]/+page.svelte` with the `step`
  param matcher validating 1–12.

## Compliance

This form is non-clinical. ISO/IEC/IEEE 26514:2022 (information for users) is
followed for documentation quality.

## Verify

```sh
bin/test-form arc42
```
