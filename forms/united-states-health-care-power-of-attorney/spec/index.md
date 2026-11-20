# United States Health Care Power of Attorney — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
backend) must satisfy. Update the spec before changing code.

Slug: `united-states-health-care-power-of-attorney`

> **Disclaimer.** This form is documentation support, not legal advice. The
> issuing court, the treating facility, and the state decide whether a directive
> is valid. Talk with a licensed attorney in the principal's state.

## 1. Purpose

Help a principal, or the attorney, social worker, or facility staff member
assisting them, prepare a durable power of attorney for health care that will
actually work: the agent is eligible, the content is complete, and the signing
method matches the state's witness and notary rule. The engine is an
execution-readiness classifier with flagged issues, not a clinical score.

Full description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the readiness engine, the two front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON API, and the
generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of scope: the
state-specific statutory forms themselves, living wills as a separate document,
POLST completion, electronic signature, remote online notarization, hosted
deployment, authentication.

## 3. Data model

Six sections; camelCase in JavaScript and TypeScript, snake_case in SQL.
Unanswered text and enum fields are `''`; unanswered numbers and dates are `null`.

| Section | Fields |
| --- | --- |
| `principal` | `principalName`, `birthDate`, `state` (two-letter), `phone`, `capacityConfirmed`, `signedVoluntarily` |
| `agent` | `agentName`, `agentRelationship`, `agentAge`, `agentPhone`, `agentIsHealthCareProvider`, `agentIsFacilityEmployee`, `agentRelatedToPrincipal`, `agentAccepted`, `successor1Name`, `successor1Phone`, `successor2Name` |
| `authority` | `effectiveWhen` (immediately / upon-incapacity), `incapacityDeterminedBy`, `hipaaRelease`, `mentalHealthAuthority`, `organDonation`, `priorDirectiveStatus` |
| `wishes` | `lifeSustainingTreatment`, `cpr`, `ventilator`, `artificialNutrition`, `comfortCareFirst`, `seriousIllness`, `polstStatus`, `wishesNote` |
| `execution` | `signatureDate`, `executionMethod`, `witnessesPresent`, `witness1..2` (`Name`, `IsRelative`, `IsHeir`, `IsAgent`, `IsProvider`), `notaryName`, `principalInSkilledNursingFacility`, `ombudsmanSigned` |
| `distribution` | `copyToAgent`, `copyToPhysician`, `copyToSuccessor`, `copyToFacility` |

SQL: `principal` and `reviewer` (people), `united_states_health_care_power_of_attorney`
(the directive, flattened, plus `principal_id` and optional `reviewer_id`), and
the triad `_grade` (one per directive), `_grade_rule`, `_grade_flag`. UUID primary
keys, `created_at` / `updated_at` / `deleted_at`, CHECK constraints on every enum.

## 4. Readiness algorithm

First matching class wins:

```
principalMinor || capacityDenied || agentIneligible || hasExecutionDefect
                                          -> execution-risk
missingRequired.length > 0                -> incomplete
otherwise                                 -> ready-to-execute
```

- `principalMinor`: age at `signatureDate` under 18 (needs both dates).
- `capacityDenied`: `capacityConfirmed` or `signedVoluntarily` is `no`.
- `agentIneligible`: `agentAge` under 18; or the agent is the principal's
  provider (or its employee) and unrelated, in a state with `agentProviderBar`;
  or the agent operates or works at the principal's facility and is unrelated.
- `hasExecutionDefect`: only evaluated once `executionMethod` is chosen:
  - `witnessesPresent === 'no'`.
  - a witness is the agent (every state), the principal's provider where
    `providerBar === 'all'`, a relative where `relativeRule === 'all-unrelated'`,
    or an heir where `heirRule === 'all-unrelated'`.
  - the chosen path is not satisfied: `notary` needs a named notary and a state
    with `notaryAlternative`; a witnessed path needs `witnesses` counted
    witnesses, and, where `relativeRule`, `heirRule`, or `providerBar` is
    `one-unrelated` / `one`, at least one fully disinterested witness;
    `witnesses-and-notary` is satisfied by either path.
  - California skilled-nursing resident with no ombudsman witness.
- `missingRequired`: `principalName`, `birthDate`, `state`, `agentName`,
  `effectiveWhen`, `signatureDate`, `executionMethod`.

### State rules (`STATE_RULES`)

| State | Witnesses | Notary instead | Relative rule | Heir rule | Provider bar | Other |
| --- | --- | --- | --- | --- | --- | --- |
| CA | 2 | yes | one unrelated | one unrelated | all | skilled-nursing ombudsman; agent not treating provider |
| NY | 2 | no | none | none | none | agent not hospital employee unless related |
| TX | 2 | yes | one unrelated | one unrelated | one | agent not treating provider |
| FL | 2 | no | one unrelated (spouse or blood) | none | none | |
| IL | 1 | no | all unrelated | none | all | |
| PA | 2 | no | none | none | none | |
| OH | 2 | yes | all unrelated | none | all | |
| WA | 2 | yes | all unrelated | none | all | |
| other | 2 | yes | one unrelated | none | all | raises `F-HCPOA-012` |

Sources and confidence for every value are in [`doc/state-rules.md`](../doc/state-rules.md).

## 5. Flagged issues

Each flag has `id`, `category`, `priority` (`high` / `medium` / `low`),
`description`, `suggestedAction`. Flags are independent of the class.

| Id | Priority | Category | Fires when |
| --- | --- | --- | --- |
| F-HCPOA-001 | high | capacity | capacity or voluntariness is `no` |
| F-HCPOA-002 | high | agent-eligibility | agent under 18, unrelated provider, or unrelated facility staff |
| F-HCPOA-003 | high | witness-eligibility | a witness is barred |
| F-HCPOA-004 | high | execution-formalities | too few witnesses, no unrelated witness, notary not accepted or missing, witnesses not present |
| F-HCPOA-005 | high | facility-rule | California skilled-nursing resident without an ombudsman |
| F-HCPOA-006 | high | capacity | principal under 18 at signing |
| F-HCPOA-007 | medium | successor-agent | agent named but no successor |
| F-HCPOA-008 | medium | hipaa | `hipaaRelease === 'no'` |
| F-HCPOA-009 | medium | treatment-wishes | general and specific wishes contradict |
| F-HCPOA-010 | medium / low | polst | serious illness with no POLST (medium); POLST with no serious illness (low) |
| F-HCPOA-011 | low | organ-donation | donation not addressed |
| F-HCPOA-012 | medium | state-rule | state not in `STATE_RULES` |
| F-HCPOA-013 | low | distribution | copies not given to agent and physician |
| F-HCPOA-014 | medium | revocation | an earlier directive remains in force |
| F-HCPOA-015 | low | successor-agent | successor has the same name as the agent |
| F-HCPOA-016 | medium | successor-agent | agent has not agreed to serve |
| F-HCPOA-019 | medium | missing-required | a required field is blank |

## 6. Inputs and outputs

**Input.** A `Directive` object (section 3). **Output.** `gradeDirective(d)`
returns `{ readinessClass, ruleSetName, missingCount, executionRisk }`;
`detectFlaggedIssues(d)` returns the flags. The persona oracle pins both
(`flagsArgs: ["state"]`). The report shows the class, the state rule applied with
its citation, a summary table, next steps, and the flags.

## 7. Artefacts

SQL (`sql/`), generated XML / FHIR R5 / protobuf / OpenAPI, the Axum setup script,
`examples/`, `front-end-with-html/js/{rules,grader,flags,types}.js`,
`front-end-with-svelte/src/lib/engine/`, `back-end-with-axum/`.

## 8. Acceptance criteria

- `bin/test-form`, `bin/test-personas`, `bin/test-engines`,
  `bin/test-examples-conformance`, `bin/test-e2e --html` pass for the slug.
- The HTML and Svelte engines agree on every persona.
- Every class and every flag id except the unused 017, 018, 020 appears in a persona.
- An unknown state classifies by the uniform default and raises `F-HCPOA-012`.

## 9. Compliance

Documentation support, not legal advice. The engine never certifies validity.
Not a medical device: it does not diagnose or recommend treatment.

## 10. References

See [`doc/index.md`](../doc/index.md) for the full citation list: UHCDA (1993),
42 U.S.C. 1395cc(f), 45 CFR 164.502(g) and 164.508, Revised UAGA (2006), and each
state statute in the table above.

## 11. Verify

```sh
bin/test-form united-states-health-care-power-of-attorney
bin/test-personas united-states-health-care-power-of-attorney
bin/test-engines united-states-health-care-power-of-attorney
bin/test-examples-conformance united-states-health-care-power-of-attorney
bin/test-e2e --html united-states-health-care-power-of-attorney
```
