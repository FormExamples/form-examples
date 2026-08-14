# Learning Disability Annual Health Check — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `learning-disability-annual-health-check`

## 1. Purpose

A UK primary-care annual health check for people aged 14 or over on a practice's
learning-disability register. It records a comprehensive whole-person review
(reasonable adjustments and communication, physical health, screening and
immunization uptake, medication review including STOMP, mental health and
behaviour, syndrome-specific checks, carer and social) and produces a Health
Action Plan. The engine grades **completeness** of the check, confirms the
Health Action Plan, and raises clinical **flags**. It does not diagnose or grade
severity.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, completeness engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, severity grading (see
the learning-disability *assessment* form).

## 3. Data model

A single logical annual-health-check record. Fields default to `''` (text/enum)
or `null` (numeric/date/time) when unanswered. Booleans default to `false`.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | clinician completing the check |
| `clinicianRole` | enum | gp / practice-nurse / healthcare-assistant / ld-team / other |
| `checkedOn` | date | date of the check |
| `practiceName` | text | GP practice |
| `easyReadInvitationSent` | enum | yes / no |
| `preCheckDone` | enum | yes / no (health check questionnaire completed beforehand) |
| `personIdentifier` | text | local identifier |
| `ageBand` | enum | 14-17 / 18-24 / 25-44 / 45-64 / 65+ |
| `sex` | enum | person's sex |
| `ldRegisterStatus` | enum | on-register / not-on-register / newly-added |
| `mainCarer` | text | main carer or supporter |

**Component fields (each required component).** Every physical-health,
screening, medication, mental-health, syndrome, and carer component carries a
`*Status` enum and, where relevant, an `*Action` text or a supporting value.

| Field | Type | Component / notes |
| --- | --- | --- |
| `communicationNeeds` | text | reasonable adjustments & communication |
| `reasonableAdjustmentsRecorded` | enum | yes / no |
| `healthPassport` | enum | yes / no / not-applicable |
| `consentCapacityNote` | text | consent & mental-capacity note |
| `weightBmiStatus` | enum | recorded / not-recorded / declined |
| `bmi` | numeric | body-mass index (kg/m²) |
| `bloodPressureStatus` | enum | normal / raised / recorded / not-recorded |
| `epilepsyStatus` | enum | reviewed / not-reviewed / not-applicable |
| `constipationStatus` | enum | none / present / not-assessed |
| `dysphagiaStatus` | enum | none / present / not-assessed |
| `continenceStatus` | enum | ok / issue / not-assessed |
| `mobilityFallsStatus` | enum | ok / issue / not-assessed |
| `dentalStatus` | enum | ok / issue / not-assessed |
| `visionStatus` | enum | ok / issue / not-assessed |
| `hearingStatus` | enum | ok / issue / not-assessed |
| `footHealthStatus` | enum | ok / issue / not-assessed |
| `skinStatus` | enum | ok / issue / not-assessed |
| `physicalHealthActions` | text | actions arising from physical health |
| `cancerScreeningStatus` | enum | up-to-date / declined / not-eligible / not-recorded |
| `otherScreeningStatus` | enum | up-to-date / declined / not-eligible / not-recorded |
| `immunisationStatus` | enum | up-to-date / declined / not-recorded |
| `medicationReconciled` | enum | yes / no |
| `psychotropicPrescribed` | enum | yes / no |
| `psychotropicIndication` | text | documented indication for psychotropic |
| `psychotropicLastReviewed` | date | date psychotropic last reviewed |
| `stompDiscussed` | enum | yes / no / not-applicable |
| `medicationSideEffects` | text | side effects reviewed |
| `mentalHealthStatus` | enum | ok / concern / not-assessed |
| `behaviourStatus` | enum | none / challenging / not-assessed |
| `behaviourTriggers` | text | triggers for behaviour that challenges |
| `syndromeSpecificStatus` | enum | done / not-applicable / not-done |
| `carerNeedsStatus` | enum | assessed / not-assessed / no-carer |
| `socialCircumstances` | text | social / day activity / employment |

**Health Action Plan.**

| Field | Type | Notes |
| --- | --- | --- |
| `healthActionPlanProduced` | enum | yes / no |
| `healthActionPlanShared` | enum | yes / no |
| `healthActionPlanActions` | text | collated actions |
| `clinicianNote` | text | free-text summary |

**Derived (never stored as input).** `status`, `completenessPercent`,
`healthActionPlanComplete`, `firedRules[]`, `flags[]`.

## 4. Completeness algorithm

Pure function, no I/O.

```
requiredComponents = [
  reasonableAdjustments, physicalHealth (each sub-component),
  screeningImmunisations, medicationReview, mentalHealthBehaviour,
  syndromeSpecific, carerSocial
]

completed(component)   = component status is a recorded value
                         (not 'not-recorded' / 'not-assessed' / 'not-reviewed' / '')
completedCount         = number of required components completed
completenessPercent    = round(100 * completedCount / requiredComponents.length)   // 0..100

healthActionPlanComplete = healthActionPlanProduced == 'yes'
                           && healthActionPlanShared == 'yes'

status = (completedCount == requiredComponents.length && healthActionPlanComplete)
         ? 'complete'
         : 'incomplete'
```

- A component is **completed** only when it carries a real recorded value;
  `not-recorded`, `not-assessed`, `not-reviewed`, and `''` count as not
  completed. `not-applicable` / `not-eligible` / `no-carer` count as completed
  (the component was considered and correctly ruled out).
- `firedRules[]` lists each required component with whether it was completed or
  missing, so the front-end can show a checklist.
- The Health Action Plan is a required output; without it the status is always
  `incomplete` even if every component was completed.

## 5. Flagged issues (flags)

Emitted independently of the status, each with a priority:

- **STOMP — psychotropic without clear indication or review** (high) —
  `psychotropicPrescribed == 'yes'` **and** (`psychotropicIndication == ''`
  **or** `stompDiscussed == 'no'` **or** `psychotropicLastReviewed == null`):
  prompts a medication review under STOMP.
- **No Health Action Plan** (high) — `healthActionPlanProduced != 'yes'`: the
  check recorded findings but produced no plan.
- **Unaddressed physical-health issue** (high) — any physical-health component
  is `issue` / `raised` / `present` / `not-reviewed` **and**
  `physicalHealthActions == ''`.
- **Dysphagia / choking risk** (high) — `dysphagiaStatus == 'present'`: prompts
  a swallowing (SALT) referral and eating/drinking guidance.
- **Constipation risk** (medium) — `constipationStatus == 'present'`; especially
  where psychotropic or anticholinergic medicines are in use.
- **Missing screening uptake** (medium) — `cancerScreeningStatus == 'not-recorded'`
  **or** `immunisationStatus == 'not-recorded'`.
- **Reasonable adjustments not recorded** (medium) —
  `reasonableAdjustmentsRecorded == 'no'` **or** `communicationNeeds == ''`.
- **Incomplete check** (low) — `status == 'incomplete'` because one or more
  required components was not completed.

## 6. Inputs and outputs

**Input.** A typed check object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
check(data: AnnualHealthCheck): {
  status: 'complete' | 'incomplete';
  completenessPercent: number;          // 0..100
  healthActionPlanComplete: boolean;
  firedRules: FiredRule[];              // required components + completed flag
  flags: Flag[];                        // { code, priority, message }
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

- `bin/test-form learning-disability-annual-health-check` exits cleanly.
- The completeness engine is pure (no side effects, no I/O) and unit-tested,
  covering: a fully complete check (status `complete`, 100%), each individual
  missing component, the Health Action Plan gate, and every flag including the
  STOMP flag's three trigger paths.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device, plus the NHS Accessible Information Standard and the
STOMP / STAMP programmes. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and completeness details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form learning-disability-annual-health-check
```
