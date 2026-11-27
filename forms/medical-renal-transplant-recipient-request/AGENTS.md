# Medical Renal Transplant Recipient Request: agent instructions

Generic transplant-immunology request for a renal (kidney, kidney/pancreas, pancreas) transplant
recipient. A clinician completes a single-page wizard; the engine computes a four-axis grading
(test-selection appropriateness, identity / sample safety, completeness, triage priority), flags,
and the derived sample requirements.

**This form must stay generic.** Do not add the name of any health service, laboratory, region, hospital,
dialysis unit or contact detail. Identifiers, units and centres are free text; turnaround times and tube
volumes are configurable local policy.

## Source of truth

`sql/` is the schema source of truth. Regenerate derived artefacts with the repo generators in `bin/`; never hand-edit them.

## Scoring engine contract

Pure function over the request and its tests returning
`{ appropriatenessScore (1-9) + band, identitySafetyBand, completenessPercent, triageTier + targetTimeframe,
requiredSamplesSummary, recommendation, firedRules[], flags[] }`. Rule ids identical across front-ends and back-end.
The 1-9 axis has no published score; label it as anchored on laboratory standards.

## Conventions

camelCase in TypeScript, snake_case in SQL; `''` unanswered text/enum, `null` unanswered number/date; UUIDv4 keys;
`created_at`/`updated_at`/`deleted_at` on every table; one continuous single-page wizard.

See [`index.md`](index.md), [`spec/index.md`](spec/index.md), [`doc/assessment.md`](doc/assessment.md).
