# Epilepsy Annual Review — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `epilepsy-review`

## 1. Purpose

A UK primary-care structured **annual epilepsy review** for adults, aligned with
NICE NG217. It documents the position since the last review across seizures,
anti-seizure medication (ASM), triggers, SUDEP discussion, injuries and status
epilepticus, safety (driving / bathing / occupation), valproate and
pregnancy-prevention arrangements, mental health, and the care plan. The engine
**classifies seizure control**, **grades review completeness**, and **raises
safety flags**. It is a documentation and decision-support instrument, not a
numeric score and not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric pathways,
acute seizure / status management, and ASM selection.

## 3. Data model

A single logical review record. Text/enum fields default to `''`, numeric / date
/ time fields to `null` when unanswered.

**Context and profile.**

| Field | Type | Notes |
| --- | --- | --- |
| `reviewerName` | text | reviewing clinician |
| `reviewerRole` | enum | gp / practice-nurse / epilepsy-nurse / neurologist / other |
| `reviewedAt` | timestamp | date of review |
| `careSetting` | enum | general-practice / epilepsy-clinic / community / other |
| `reviewType` | enum | annual / interim |
| `monthsSinceLastReview` | numeric | interval in months |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |
| `epilepsyType` | enum | focal / generalized / combined / unknown |
| `ageAtOnset` | numeric | years |
| `yearsSinceDiagnosis` | numeric | years |
| `learningDisability` | enum | yes / no |

**Seizures and medication.**

| Field | Type | Notes |
| --- | --- | --- |
| `seizureTypes` | text | seizure type(s) present |
| `seizureFrequency` | enum | none / less-than-monthly / monthly / weekly / daily |
| `lastSeizureDate` | date | most recent seizure |
| `seizureFreeMonths` | numeric | documented seizure-free duration |
| `seizureTrend` | enum | seizure-free / decreasing / stable / increasing |
| `currentAsms` | text | current ASM(s) and doses |
| `asmAdherence` | enum | good / partial / poor |
| `asmSideEffects` | enum | none / mild / significant |
| `drugLevel` | numeric | therapeutic level where relevant |

**Risk, safety and review domains.**

| Field | Type | Notes |
| --- | --- | --- |
| `triggers` | text | reported seizure triggers |
| `sudepDiscussed` | enum | yes / no |
| `statusEpilepticus` | enum | yes / no — since last review |
| `seizureInjury` | enum | yes / no — since last review |
| `dvlaEligible` | enum | eligible / not-eligible / not-applicable |
| `currentlyDriving` | enum | yes / no |
| `bathingAdviceGiven` | enum | yes / no |
| `womanOfChildbearingPotential` | enum | yes / no / not-applicable |
| `onValproate` | enum | yes / no |
| `pregnancyPreventionProgramme` | enum | in-place / not-in-place / not-applicable |
| `folicAcid` | enum | yes / no / not-applicable |
| `contraceptionInteractionReviewed` | enum | yes / no / not-applicable |
| `mentalHealthConcern` | enum | none / low-mood / anxiety / depression / suicidality |
| `specialistReviewNeeded` | enum | yes / no |
| `nextReviewDue` | date | planned next review |

**Derived (never stored as input).** `seizureControl`, `reviewStatus`,
`completenessScore`, `firedRules[]`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. Three outputs computed from the recorded fields.

**Seizure control.**

```
uncontrolled = seizureTrend == 'increasing'
               || statusEpilepticus == 'yes'
               || seizureFrequency in ('weekly', 'daily')
seizureFree  = !uncontrolled
               && (seizureFrequency == 'none' || seizureTrend == 'seizure-free')
seizureControl = uncontrolled ? 'uncontrolled'
               : seizureFree   ? 'seizure-free'
               : 'controlled'          // seizures present but stable/decreasing
```

**Review completeness.** Count the documented required domains among: seizure
type / frequency, ASM and adherence, triggers, SUDEP discussion, injuries /
status, safety / DVLA, mental health, care plan, and — where
`womanOfChildbearingPotential == 'yes'` — valproate / PPP and folic acid.

```
completenessScore = number of required domains documented
reviewStatus = coreSeizureOrMedicationMissing ? 'incomplete'
             : allRequiredDomainsDocumented    ? 'complete'
             : 'partial'
```

- A missing core domain (seizure documentation or ASM) forces `incomplete`.
- Applicable-only domains (valproate / PPP, folic acid, contraception) are
  required for completeness **only** when `womanOfChildbearingPotential == 'yes'`.

## 5. Flagged issues (safety flags)

Emitted independently of class and grade, each with a priority:

- **Specialist review** (high) — `seizureControl == 'uncontrolled'` or
  `seizureTrend == 'increasing'`: refer / escalate to neurology.
- **Valproate PPP** (high) — `womanOfChildbearingPotential == 'yes'` and
  `onValproate == 'yes'` and `pregnancyPreventionProgramme != 'in-place'`: urgent
  review and pregnancy-prevention programme.
- **Status epilepticus** (high) — `statusEpilepticus == 'yes'`.
- **Driving safety** (high) — `currentlyDriving == 'yes'` and
  `dvlaEligible == 'not-eligible'`: DVLA notification required, advise not to
  drive.
- **Mental health** (high) — `mentalHealthConcern == 'suicidality'`; medium for
  `depression` / `anxiety` / `low-mood`.
- **SUDEP not documented** (medium) — `sudepDiscussed != 'yes'`.
- **Poor adherence** (medium) — `asmAdherence == 'poor'`.
- **ASM side effects** (medium) — `asmSideEffects == 'significant'`.
- **Folic acid missing** (medium) — `womanOfChildbearingPotential == 'yes'` and
  `folicAcid == 'no'`.
- **Review incomplete / overdue** (low) — `reviewStatus != 'complete'` or
  `monthsSinceLastReview > 12`.

## 6. Inputs and outputs

**Input.** A typed review object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  seizureControl: 'seizure-free' | 'controlled' | 'uncontrolled';
  reviewStatus: 'complete' | 'partial' | 'incomplete';
  completenessScore: number;   // documented required domains
  firedRules: FiredRule[];
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form epilepsy-review` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each seizure-control class, each completeness grade, and every flag
  (including the valproate / PPP and DVLA-driving edge cases).
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form epilepsy-review
```
