# Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request: agent instructions

Generic HLA typing request for HSCT recipients and potential donors. A clinician completes a single-page wizard per person; the engine computes a four-axis grading, flags and the derived sample requirements for the person's role.

**This form must stay generic.** Do not add the name of any health service, laboratory, region, hospital or contact detail. Identifiers, units and centres are free text; turnaround times and tube volumes are configurable local policy.

`sql/` is the schema source of truth. Regenerate derived artefacts with the repo generators in `bin/`; never hand-edit them.

Engine contract: pure function returning `{ appropriatenessScore (1-9) + band, identitySafetyBand, completenessPercent, triageTier + targetTimeframe, requiredSamplesSummary, recommendation, firedRules[], flags[] }`. Rule ids identical across front-ends and back-end.

Conventions: camelCase in TypeScript, snake_case in SQL; `''` unanswered text/enum, `null` unanswered number/date; UUIDv4 keys; `created_at`/`updated_at`/`deleted_at` on every table; one continuous single-page wizard.

See [`index.md`](index.md), [`spec/index.md`](spec/index.md), [`doc/assessment.md`](doc/assessment.md).
