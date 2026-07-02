# Plan: Mental Health Act Assessment — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard Confusion Assessment Method (classification) front-end and
porting the Mental Health Act classification / validation engine from the HTML
front-end.

## Done

- Ported the pure engine to TypeScript: `types.ts`, `mha-rules.ts`
  (`sectionToClass`, per-class `SIGNATORIES` and `CRITERIA`, `riskLimbStatus`),
  `mha-grader.ts` (`gradeMentalHealthActAssessment` — classify section,
  evaluate signatories and criteria, derive completeness + urgency),
  `flagged-issues.ts` (safety / legal / governance flags), and `utils.ts` label
  + Lily token colour helpers. NO automated detention decision anywhere.
- Engine unit tests (`mha-grader.test.ts`) with a local `createDefaultAssessment`
  fixture (no store import) covering section-class mapping, valid / incomplete
  s2 and s3, emergency / urgent / routine urgency, the `none` class outcome
  gate, and each flag category; asserts the result has no detention-decision
  field.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `mental-health-act-assessment.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Nine wizard step components (context, identification, professionals, mental
  disorder, risk, least-restrictive, treatment, nearest relative,
  recommendation) with a live validation-status readout on the final step.
- RESTful routes under `src/routes/mental-health-act-assessments/`: SVAR
  dashboard (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`;
  plus welcome (`/`) and root layout with the Lily theme switcher.
- Four sample assessments (valid s2, incomplete s3, s136 emergency, and a
  no-detaining-section informal-admission outcome) spanning completeness and
  urgency classes, with engine-derived dashboard rows.
- `pdf-builder.ts` — `pdfmake` document (section class, completeness, urgency,
  signatory + criteria tables, flags; documentation instrument footer).

## Verify

```sh
pnpm install
pnpm run check       # 0 errors, 0 warnings
pnpm run build
pnpm exec vitest run
```
