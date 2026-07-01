# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `recommended-summary-plan-for-emergency-care-and-treatment`

## 1. Purpose

A UK personalised emergency care and treatment plan created through shared
decision-making. It records a summary of the person's relevant health, their
preferences and what matters to them, agreed clinical recommendations balancing
life-sustaining treatment against comfort, an explicit CPR recommendation
(attempt / do-not-attempt), and agreed ceilings of treatment, together with a
record of capacity and involvement and clinician sign-off.

This is a **documentation and completeness / status** form, not a scored
assessment. The engine reports whether the plan is **Complete** or
**Incomplete**, a completeness percentage, the mandatory rules that fired, and
safety / governance flags. It does not compute a clinical score.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the validation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, and any legally binding
effect (a ReSPECT plan records recommendations, not binding refusals).

## 3. Data model

A single logical plan record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Personal details.**

| Field | Type | Notes |
| --- | --- | --- |
| `personName` | text | person the plan is about |
| `dateOfBirth` | date | person's date of birth |
| `identifier` | text | NHS / CHI number or local identifier |
| `address` | text | usual residence |
| `keyContact` | text | key contact / next of kin details |

**Summary of relevant health.**

| Field | Type | Notes |
| --- | --- | --- |
| `healthSummary` | text | brief clinical summary |
| `diagnoses` | text | relevant diagnoses |
| `existingDocuments` | text | ADRT, LPA, organ-donation wishes if any |

**Preferences and what matters.**

| Field | Type | Notes |
| --- | --- | --- |
| `whatMatters` | text | values, priorities, fears |
| `carePreferences` | text | preferences for care |

**Clinical recommendations.**

| Field | Type | Notes |
| --- | --- | --- |
| `priorityBalance` | enum | `sustain-life` / `balanced` / `comfort` (life-sustaining ↔ comfort balance) |
| `recommendedInterventions` | text | interventions recommended |
| `notRecommendedInterventions` | text | interventions not recommended |

**CPR recommendation.**

| Field | Type | Notes |
| --- | --- | --- |
| `cprRecommendation` | enum | `attempt` / `do-not-attempt` / `''` (undocumented) |
| `cprRationale` | text | clinical rationale |
| `cprDiscussed` | enum | `yes` / `no` — discussion with person / proxy documented |

**Ceilings of treatment.**

| Field | Type | Notes |
| --- | --- | --- |
| `hospitalTransfer` | enum | appropriate / not-appropriate / `''` |
| `criticalCareAdmission` | enum | appropriate / not-appropriate / `''` |
| `treatmentCeilings` | text | other agreed limits |

**Capacity and involvement.**

| Field | Type | Notes |
| --- | --- | --- |
| `hasCapacity` | enum | `yes` / `no` — person has capacity for this decision |
| `capacityAssessment` | text | assessment where the person lacks capacity |
| `involvement` | enum | `person` / `legal-proxy` / `consultees` / `''` |
| `proxyDetails` | text | welfare attorney / deputy / consultee details |

**Clinician sign-off.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | completing clinician |
| `clinicianRole` | enum | doctor / nurse / paramedic / other |
| `clinicianRegistration` | text | GMC / NMC / HCPC number |
| `signature` | text | electronic signature |
| `signedAt` | timestamp | date and time signed |
| `seniorEndorsement` | text | senior clinician endorsement |
| `emergencyContacts` | text | emergency contacts |
| `reviewDate` | date | planned review date |

**Derived (never stored as input).** `status`, `completenessPercent`,
`firedRules[]`, `flags[]`.

## 4. Validation algorithm

Pure function, no I/O. Each **mandatory rule** is evaluated as satisfied or
unsatisfied; `status` is `complete` only when all are satisfied.

```
R1 identity        = personName != '' && dateOfBirth != null && identifier != ''
R2 healthSummary   = healthSummary != ''
R3 preferences     = whatMatters != '' || carePreferences != ''
R4 recommendations = priorityBalance != '' && (recommendedInterventions != '' || notRecommendedInterventions != '')
R5 cpr             = cprRecommendation == 'attempt' || cprRecommendation == 'do-not-attempt'
R6 ceilings        = hospitalTransfer != '' || criticalCareAdmission != '' || treatmentCeilings != ''
R7 capacity        = hasCapacity != '' &&
                     (hasCapacity == 'yes'
                      || (capacityAssessment != '' && involvement != '' && involvement != 'person'))
R8 signOff         = clinicianName != '' && clinicianRole != '' && signature != '' && signedAt != null

mandatory      = [R1..R8]
satisfiedCount = count(mandatory where satisfied)
status              = satisfiedCount == 8 ? 'complete' : 'incomplete'
completenessPercent = round(100 * presentMandatoryFields / totalMandatoryFields)
```

- **R7 is conditional.** When `hasCapacity == 'yes'` the person makes the
  decision and no proxy is required. When `hasCapacity == 'no'` a capacity
  assessment **and** legal-proxy / consultee involvement must be documented
  (Mental Capacity Act 2005).
- `completenessPercent` is reported for both statuses so an incomplete plan
  still shows progress; it counts populated mandatory fields, not passed rules.

## 5. Flagged issues (safety and governance)

Emitted independently of status, each with a priority:

- **CPR recommendation not documented** (high) — `cprRecommendation == ''`: the
  most safety-critical omission; no attempt / do-not-attempt selection.
- **Capacity assessment missing** (high) — `hasCapacity == 'no'` and
  (`capacityAssessment == ''` or `involvement == ''` or `involvement ==
  'person'`): required capacity process not documented.
- **No clinician signature** (high) — `signature == ''` or `signedAt == null`:
  plan is not valid until signed.
- **DNACPR without documented discussion** (high) —
  `cprRecommendation == 'do-not-attempt'` and `cprDiscussed != 'yes'`: no record
  of discussion with the person or their proxy.
- **Review date passed** (medium) — `reviewDate != null && reviewDate < today`:
  plan may no longer reflect the person's wishes or condition.
- **Summary of health missing** (low) — `healthSummary == ''`: recommendations
  lack clinical context.

## 6. Inputs and outputs

**Input.** A typed plan object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A validation object emitted by the engine:

```ts
{
  status: 'complete' | 'incomplete';
  completenessPercent: number;   // 0..100
  firedRules: FiredRule[];       // each mandatory rule with satisfied: boolean
  flags: Flag[];                 // { code, priority, message }
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

- `bin/test-form recommended-summary-plan-for-emergency-care-and-treatment`
  exits cleanly.
- The validation engine is pure (no side effects, no I/O) and unit-tested,
  covering each mandatory rule passing and failing, the conditional capacity
  rule, completeness-percent arithmetic, and each flag.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. The capacity and involvement rules reflect the
**Mental Capacity Act 2005** (Adults with Incapacity (Scotland) Act 2000 in
Scotland). Form-specific classification is recorded in [`index.md`](../index.md)
and [`AGENTS.md`](../AGENTS.md) where it differs from the baseline.

## 10. References

- [`index.md`](../index.md) — form description and completeness model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form recommended-summary-plan-for-emergency-care-and-treatment
```
