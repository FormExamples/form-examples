# Tutorial 3 — Author a scoring engine

Every form's clinical logic lives in a **pure scoring engine**: no network, no
DOM, no `$effect`, no side effects — data in, graded result out. The same
algorithm is mirrored across the HTML, Svelte, and Rust implementations, and the
Svelte copy is the one with unit tests. This tutorial dissects the
**`apgar-score`** engine and shows how to add a grader and a vitest test with
golden vectors.

The engine lives here:

```sh
ls forms/apgar-score/front-end-with-svelte/src/lib/engine
```

## Anatomy of an engine

A form's engine is split into small single-purpose files (root `AGENTS.md`,
"Engine files"):

| File | Role |
| --- | --- |
| `types.ts` | The `AssessmentData` input shape and the `GradingResult` output shape. |
| `utils.ts` | Small pure helpers shared by the rules. |
| `apgar-rules.ts` | The scoring table — one rule per sign, each mapping an answer to points. |
| `apgar-grader.ts` | The grader: composes the rules into per-timepoint totals, bands, and trend. |
| `flagged-issues.ts` | Independent safety/completeness rules that raise `FlaggedIssue`s. |
| `apgar-grader.test.ts` | Vitest unit tests with golden vectors. |

The naming is per-form: a form with slug `foo-bar` has `foo-bar-rules.ts` and
`foo-bar-grader.ts`. The reference Svelte form `cardiology-request` splits its
rules further (`safety-rules.ts`, `triage-rules.ts`, …) but the shape is the
same.

## The grader is a pure function

`apgar-grader.ts` exports `calculateApgarGrade(data)`. Read it:

```sh
sed -n '1,40p' forms/apgar-score/front-end-with-svelte/src/lib/engine/apgar-grader.ts
```

Key properties to preserve in any engine you write:

- **Pure.** It takes `AssessmentData` and returns a `GradingResult`. The only
  impurity tolerated is the final `timestamp: new Date().toISOString()`.
- **Composed from rules.** `gradeTimepoint` loops over `apgarRules` and sums
  `rule.score(t)` — the scoring table is data, not branching code.
- **Total → band is a small documented function.** `bandForTotal(total)` maps
  `>= 7` reassuring, `4–6` moderately-low, `<= 3` low. Boundaries are exactly
  where clinical guidance puts them, and they are the first thing the tests pin.
- **Flags are computed independently.** `detectFlaggedIssues` runs beside the
  totals, not inside them, so a missing answer lowers a count *and* raises a
  completeness flag without corrupting the score.

## Golden vectors come from `examples/`

Each form ships a canonical filled-in fixture the engine must reproduce:

```sh
ls forms/apgar-score/examples/assessment.json
```

Treat that fixture as the golden input: the totals, band, and flags it implies
are the numbers your tests assert. The Svelte test file encodes the same
vectors as small local builders (`createReassuring()` → 8 at 1 min, 9 at
5 min) so the engine test never has to import the SvelteKit store.

Read the existing tests to see the pattern:

```sh
sed -n '54,73p' forms/apgar-score/front-end-with-svelte/src/lib/engine/apgar-grader.test.ts
```

## Writing a grader + test (the loop)

When you author a new form's engine, work in this order:

1. **`types.ts`** — define `AssessmentData` (camelCase, `''` for unanswered
   text/enum, `null` for unanswered numeric) and `GradingResult`.
2. **`*-rules.ts`** — encode the scoring table as data: an array of rules, each
   with an `id`, the field it reads, and a pure `score()`.
3. **`*-grader.ts`** — compose the rules into the result. Keep every branch
   documented against a spec section.
4. **`flagged-issues.ts`** — add the safety/completeness rules, each returning a
   `FlaggedIssue` with a stable `id` and a `priority`.
5. **`*-grader.test.ts`** — pin every band boundary, every trend/branch
   direction, and each flagged-issue `id`, using vectors drawn from
   `examples/assessment.json`.

A minimal vitest case looks like the ones already in the file:

```ts
import { describe, it, expect } from 'vitest';
import { bandForTotal } from './apgar-grader';

describe('band boundaries', () => {
  it('maps totals to bands at the 3/4 and 6/7 boundaries', () => {
    expect(bandForTotal(3)).toBe('low');
    expect(bandForTotal(4)).toBe('moderately-low');
    expect(bandForTotal(7)).toBe('reassuring');
  });
});
```

## Run the tests

Vitest is configured to pick up every `src/**/*.test.ts`:

```sh
cd forms/apgar-score/front-end-with-svelte
pnpm install
pnpm exec vitest run
```

Green here means the engine agrees with its golden vectors. Because the HTML and
Rust implementations mirror the same algorithm, this test is the anchor that
keeps all three in step.

## Verify you got here

```sh
# The engine files this tutorial dissects all exist:
ls forms/apgar-score/front-end-with-svelte/src/lib/engine/apgar-grader.ts
ls forms/apgar-score/front-end-with-svelte/src/lib/engine/apgar-grader.test.ts
ls forms/apgar-score/front-end-with-svelte/src/lib/engine/flagged-issues.ts
# The golden fixture the vectors come from exists:
ls forms/apgar-score/examples/assessment.json
# The Svelte reference form's engine (a richer split) exists too:
ls forms/cardiology-request/front-end-with-svelte/src/lib/engine
```
