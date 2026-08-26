# Child Safeguarding Referral — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `child-safeguarding-referral`

## 1. Purpose

A structured referral to children's social care when a professional believes a
child may be at risk of harm. It records the child and family, the concern or
allegation, the category of abuse, presenting evidence, immediate risk and
safety, the consent / information-sharing basis, who else has been informed, and
the action requested. The engine grades the referral's **completeness and
validity**, classifies its **urgency** (emergency / urgent s47 or standard s17),
and raises **safeguarding flags**. It is a documentation-completeness and
risk-classification tool, not a numeric score.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, grading engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, and any automated
decision that a referral is *not* required (always a human decision).

## 3. Data model

A single logical referral record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Referrer.**

| Field | Type | Notes |
| --- | --- | --- |
| `referrerName` | text | mandatory |
| `referrerRole` | text | job role / title |
| `referrerOrganisation` | text | employing organization |
| `referrerPhone` | text | mandatory (one of phone/email) |
| `referrerEmail` | text | contact email |
| `referredAt` | timestamp | date and time of referral |
| `relationshipToChild` | text | how the referrer knows the child |

**Child.**

| Field | Type | Notes |
| --- | --- | --- |
| `childName` | text | mandatory |
| `childDateOfBirth` | date | mandatory unless `childAge` given |
| `childAge` | numeric (years) | fallback when DOB unknown |
| `childSex` | enum | female / male / other / unknown |
| `childAddress` | text | home address |
| `childSetting` | text | school / nursery / college |
| `childReference` | text | NHS or local unique reference |
| `childEthnicity` | text | self-described where known |
| `childFirstLanguage` | text | for interpreter need |
| `childDisability` | text | disability / communication need |

**Family and household.**

| Field | Type | Notes |
| --- | --- | --- |
| `carers` | text | parents/carers with parental responsibility |
| `householdMembers` | text | other household members |
| `otherChildren` | text | siblings / other children in household |
| `professionalsInvolved` | text | GP, school, existing social worker |

**The concern.**

| Field | Type | Notes |
| --- | --- | --- |
| `concernDescription` | text | mandatory — what the concern is |
| `concernOnset` | text | when / how it came to light |
| `childDisclosed` | enum (yes/no) | did the child disclose abuse |
| `referrerObservations` | text | direct observations |

**Category of abuse.**

| Field | Type | Notes |
| --- | --- | --- |
| `primaryCategory` | enum | mandatory — physical / emotional / sexual / neglect |
| `additionalCategories` | text | any further categories |
| `presentingEvidence` | text | indicators and evidence |

**Immediate risk and safety.**

| Field | Type | Notes |
| --- | --- | --- |
| `immediateDanger` | enum (yes/no) | mandatory — child in immediate danger |
| `childWhereabouts` | text | where the child is now |
| `whoWithChild` | text | who is with the child |
| `allegedPersonInContact` | enum (yes/no/unknown) | is the alleged person in contact |
| `otherChildrenAtRisk` | enum (yes/no/unknown) | siblings / others at risk |

**Consent and information sharing.**

| Field | Type | Notes |
| --- | --- | --- |
| `consentSought` | enum (yes/no) | was consent to refer sought |
| `consentStatus` | enum | given / refused / not-sought |
| `sharingBasisWithoutConsent` | enum | mandatory when not given — risk-of-serious-harm / seeking-consent-increases-risk / not-applicable |
| `familyAware` | enum (yes/no) | is the child / family aware of the referral |
| `unsafeToInformReason` | text | why informing would increase risk |

**Who else is informed.**

| Field | Type | Notes |
| --- | --- | --- |
| `agenciesContacted` | text | police / health / education contacted |
| `strategyDiscussionHeld` | enum (yes/no) | strategy discussion already held |
| `previousSafeguardingHistory` | text | prior involvement if known |

**Requested action.**

| Field | Type | Notes |
| --- | --- | --- |
| `requestedAction` | text | action requested of social care |
| `referrerDeclaration` | enum (yes/no) | referrer confirms accuracy |
| `notes` | text | free-text notes |

**Derived (never stored as input).** `status`, `urgency`,
`completenessPercent`, `firedRules[]`, `flags[]`.

## 4. Grading algorithm

Pure function, no I/O.

**Mandatory fields** (all must be present for validity): `referrerName`, one of
`referrerPhone`/`referrerEmail`, `childName`, one of
`childDateOfBirth`/`childAge`, `concernDescription`, `primaryCategory`,
`immediateDanger`, and a consent basis (see below).

**Consent basis rule.** A consent basis is documented when `consentStatus ==
'given'`, or when consent was not given but `sharingBasisWithoutConsent` is a
lawful basis (`risk-of-serious-harm` or `seeking-consent-increases-risk`).

```
mandatoryMissing = list of mandatory fields that are blank/null
consentBasisOk   = consentStatus == 'given'
                   || sharingBasisWithoutConsent in
                      ('risk-of-serious-harm','seeking-consent-increases-risk')

status = mandatoryMissing not empty || !consentBasisOk ? 'incomplete'
       : allRecommendedPresent                          ? 'complete'
       :                                                  'partial'

completenessPercent = round(100 * answered(mandatory + recommended)
                                 / count(mandatory + recommended))

urgency = immediateDanger == 'yes'                       ? 'emergency'
        : primaryCategory == 'sexual'
          || childDisclosed == 'yes'
          || allegedPersonInContact == 'yes'
          || otherChildrenAtRisk == 'yes'                ? 'urgent'
        :                                                  'standard'
```

- `emergency` always maps to the s47 + emergency-services pathway; `urgent` to a
  s47 enquiry; `standard` to a s17 assessment.
- A missing mandatory field makes the referral `incomplete` regardless of
  urgency — urgency is still computed and shown so danger is never hidden by an
  incomplete form.

## 5. Flagged issues (safeguarding flags)

Emitted independently of status and urgency, each with a priority:

- **Immediate danger** (high) — `immediateDanger == 'yes'`: escalate to
  emergency services / police now.
- **Disclosure of abuse** (high) — `childDisclosed == 'yes'`: preserve the
  account, avoid leading questions.
- **Sexual abuse category** (high) — `primaryCategory == 'sexual'` (or listed in
  `additionalCategories`): specialist / police / medical response.
- **Other children at risk** (high) — `otherChildrenAtRisk == 'yes'`: siblings /
  other children must be considered.
- **No consent basis documented** (high) — consent not given and no lawful
  sharing basis recorded.
- **Mandatory field missing** (medium) — any mandatory field blank; names the
  missing fields.
- **Child unaware / unsafe to inform** (medium) — `familyAware == 'no'` with an
  `unsafeToInformReason`: handle contact carefully.
- **Previous safeguarding history** (low) — `previousSafeguardingHistory`
  non-empty: link to existing records.

## 6. Inputs and outputs

**Input.** A typed referral object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  status: 'complete' | 'partial' | 'incomplete';
  urgency: 'emergency' | 'urgent' | 'standard';
  completenessPercent: number; // 0..100
  firedRules: FiredRule[];
  flags: Flag[];
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

- `bin/test-form child-safeguarding-referral` exits cleanly.
- The grading engine is pure (no side effects, no I/O) and unit-tested, covering
  each status (`complete` / `partial` / `incomplete`), each urgency
  (`emergency` / `urgent` / `standard`), the consent-basis rule, and every flag.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Statutory framing (Children Act 1989 s17/s47,
Working Together to Safeguard Children 2023) is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md).

## 10. References

- [`index.md`](../index.md) — form description and completeness/urgency model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form child-safeguarding-referral
```
