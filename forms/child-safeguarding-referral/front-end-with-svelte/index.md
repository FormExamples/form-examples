# Child Safeguarding Referral — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Child Safeguarding Referral: a single
continuous single-page wizard plus a duty-team dashboard, styled with the Lily
Design System (Svelte headless) and powered by a pure Svelte 5 completeness /
risk-classification engine.

This is a documentation-completeness and risk-classification instrument, **not**
a scored assessment. The engine grades a referral `complete`, `partial`, or
`incomplete`, reports a completeness percentage, classifies its urgency
(`emergency`, `urgent` s47, or `standard` s17), records which mandatory rules
fired, and raises safeguarding flags. There is no numeric clinical score.
Urgency is always computed — even when the referral is incomplete — so danger is
never hidden.

- **Wizard** — `/child-safeguarding-referrals/[id]`: nine sections (referrer
  details, child details, family and household, the concern, category of abuse,
  immediate risk and safety, consent and information sharing, who else is
  informed, requested action and summary). The consent section is conditional —
  the lawful-basis field appears when consent is not given, and the
  unsafe-to-inform reason appears when the family is unaware. Live completeness
  status and urgency on the summary step.
- **Dashboard** — `/child-safeguarding-referrals`: SVAR DataGrid with the
  engine-derived urgency, completeness status, category, and flag count; filter
  by urgency and status.
- **Report** — `/child-safeguarding-referrals/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Completeness / risk engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `child-safeguarding-rules.ts`,
`child-safeguarding-grader.ts`, `flagged-issues.ts`. Six mandatory rules
(referrer identified with contact, child identified, concern described, primary
category, immediate-danger answered, consent / information-sharing basis);
`status` is `incomplete` when any mandatory rule fails, `complete` when every
mandatory AND recommended slot is populated, and `partial` in between.
`completenessPercent` counts populated mandatory-plus-recommended field-slots
(the unsafe-to-inform slot is conditional, applying only when the family is
unaware). Urgency is classified `emergency` (immediate danger) / `urgent`
(sexual category, disclosure, alleged person in contact, or other children at
risk) / `standard`. Eight independent flags cover the safety-critical signals.
Tests in `child-safeguarding-grader.test.ts`.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for the
dashboard. See [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)
for the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors, 0 warnings
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
