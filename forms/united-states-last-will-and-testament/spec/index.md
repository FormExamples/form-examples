# United States Last Will and Testament — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behavior: update
the spec before changing code.

Slug: `united-states-last-will-and-testament`

## 1. Purpose

A planning and validity-checking instrument for a United States will. It
captures the testator and the state whose law governs, the family and spouse,
the estate and the specific and residuary bequests, the personal representative
(executor) and standard clauses, the execution plan with witnesses, and the
self-proving affidavit. Its engine is a **completeness and validity
classification** engine, not a numeric score: it classifies the plan as
**valid-ready-to-execute**, **incomplete**, or **formality-risk**, and raises
prioritized flagged issues. It gives no legal advice and does not replace a
licensed attorney or the probate court, which decides whether a will is valid.

Will law is state law. The engine encodes the Uniform Probate Code (UPC) as the
default and a `STATE_RULES` table for California, New York, Texas, Florida,
Illinois, Pennsylvania, Ohio and Washington; any other state uses the UPC
default and raises a "verify state rule" flag.

Full design description: [`index.md`](../index.md). Research and citations:
[`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, validation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: drafting the text of a will, trusts and pour-over wills, testamentary
trusts, tax computation, Louisiana and non-US wills, hosted deployment,
authentication, and multi-tenancy. The United Kingdom analogue is a separate
form.

## 3. Data model

A single logical will plan. Fields default to `''` (text/enum) or `null`
(numeric/date) when unanswered. Section names match the wizard steps.

**Step 1: testator and state (`testator`).**

| Field | Type | Notes |
| --- | --- | --- |
| `state` | string | Two-letter state code whose law governs the will; unknown states fall back to the Uniform Probate Code default. |
| `testatorName` | string | Full legal name of the testator as written in the will. |
| `testatorDateOfBirth` | date or null | Date of birth of the testator; the testator must be 18 or older on the execution date. |
| `soundMind` | `yes \| no \| uncertain \| ''` | Testamentary capacity: whether the testator is of sound mind: yes, no, or uncertain. |
| `undueInfluenceConcern` | `none \| possible \| ''` | Whether there is a concern of undue influence: none or possible. |
| `maritalStatus` | `single \| married \| divorced \| widowed \| ''` | Marital status of the testator: single, married, divorced, or widowed. |

In the wizard state the date of birth is `testator.dateOfBirth`; its SQL column
is `testator_date_of_birth` (the `testator` table also has `birth_date`).

**Step 2: family and spouse (`family`).**

| Field | Type | Notes |
| --- | --- | --- |
| `spouseName` | string | Full name of the testator's spouse, when married. |
| `spouseInheritanceValue` | number or null | Value in US dollars left to the surviving spouse. |
| `spouseWaivedElectiveShare` | `yes \| no \| ''` | Whether the spouse has waived the elective share in writing (yes/no). |
| `hasMinorChildren` | `yes \| no \| ''` | Whether the testator has minor children (yes/no). |
| `guardianForMinorsName` | string | Nominated guardian for minor children. |
| `disinheritsChild` | `yes \| no \| ''` | Whether the will leaves a child out (yes/no). |
| `disinheritedChildNamed` | `yes \| no \| ''` | Whether the omitted child is named in the will (yes/no). |

**Step 3: estate and bequests (`estate`).**

| Field | Type | Notes |
| --- | --- | --- |
| `estimatedEstateValue` | number or null | Estimated gross estate value in US dollars. |
| `specificBequestsTotal` | number or null | Total value in US dollars of all specific bequests. |
| `specificBequestsSummary` | string | Free-text summary of the specific bequests. |
| `residuaryClausePresent` | `yes \| no \| ''` | Whether the will has a residuary clause giving away everything not otherwise given (yes/no). |
| `residuary1Name` | string | Residuary beneficiary 1 name. |
| `residuary1Percent` | number or null | Residuary beneficiary 1 share, percent. |
| `residuary2Name` | string | Residuary beneficiary 2 name. |
| `residuary2Percent` | number or null | Residuary beneficiary 2 share, percent. |
| `residuary3Name` | string | Residuary beneficiary 3 name. |
| `residuary3Percent` | number or null | Residuary beneficiary 3 share, percent. |
| `contingentBeneficiaryNamed` | `yes \| no \| ''` | Whether a contingent (backup) beneficiary is named (yes/no). |

**Step 4: representative and clauses (`provisions`).**

| Field | Type | Notes |
| --- | --- | --- |
| `personalRepresentativeName` | string | Personal representative (executor) named in the will. |
| `successorPersonalRepresentativeName` | string | Successor personal representative named in the will. |
| `bondWaived` | `yes \| no \| ''` | Whether the will waives the personal representative's bond (yes/no). |
| `revokesPriorWillsClause` | `yes \| no \| ''` | Whether the will expressly revokes all earlier wills and codicils (yes/no). |
| `noContestClause` | `yes \| no \| ''` | Whether the will has a no-contest (in terrorem) clause (yes/no). |
| `digitalAssetsClause` | `yes \| no \| ''` | Whether the will authorizes access to digital assets under RUFADAA (yes/no). |
| `estateTaxReviewed` | `yes \| no \| ''` | Whether a tax adviser has reviewed estate tax (yes/no). |
| `originalWillLocation` | string | Where the signed original will is kept. |
| `drafterNote` | string | Free-text note from the drafter. |

**Step 5: execution and witnesses (`execution`).**

| Field | Type | Notes |
| --- | --- | --- |
| `executionForm` | `witnessed \| holographic \| electronic \| ''` | Form of execution: witnessed, holographic, or electronic. |
| `executionDate` | date or null | Date the will is or was signed. |
| `signedAtEnd` | `yes \| no \| ''` | Whether the testator signs at the end of the will (yes/no). |
| `signedInWitnessPresence` | `yes \| no \| ''` | Whether the testator signs or acknowledges the signature in front of the witnesses (yes/no). |
| `witnessesSignedInTestatorPresence` | `yes \| no \| ''` | Whether the witnesses sign in the testator's presence (yes/no). |
| `holographicEntirelyHandwritten` | `yes \| no \| ''` | For a holographic will, whether the signature and material provisions are in the testator's handwriting (yes/no). |
| `witness1Name` | string | Witness 1 name. |
| `witness1Beneficiary` | `yes \| no \| ''` | Whether witness 1 takes a gift under the will (yes/no). |
| `witness2Name` | string | Witness 2 name. |
| `witness2Beneficiary` | `yes \| no \| ''` | Whether witness 2 takes a gift under the will (yes/no). |
| `witness3Name` | string | Witness 3 name (optional extra witness). |
| `witness3Beneficiary` | `yes \| no \| ''` | Whether witness 3 takes a gift under the will (yes/no). |

**Step 6: self-proving affidavit (`selfProving`).**

| Field | Type | Notes |
| --- | --- | --- |
| `selfProvingAffidavit` | `yes \| no \| ''` | Whether a self-proving affidavit will be signed (yes/no). |
| `notaryName` | string | Name of the notary on the self-proving affidavit. |
| `notaryAcknowledged` | `yes \| no \| ''` | Whether the notary acknowledged the signatures (yes/no). |

Persistence: the `testator` table (person) and optional `attorney` table (drafter)
are separate rows referenced by the main `united_states_last_will_and_testament`
row. The wizard groups the same fields into the six sections above; the SQL
columns are flat, with each camelCase field above mapped to its snake_case
column.

## 4. Validity algorithm

The state rule comes from `STATE_RULES[state]`, else the UPC default. First
matching class wins:

```
any HIGH flag                -> 'formality-risk'
any required answer missing  -> 'incomplete'
otherwise                    -> 'valid-ready-to-execute'
```

`formality-risk` takes precedence over `incomplete`: a plan with a known defect
should not be signed however complete the rest is. Medium and low flags never
change the class. The class depends only on the plan's own dates (the
execution date against the date of birth), never the wall clock.

Required answers (their absence makes the plan `incomplete`): state, testator
name, date of birth, sound-mind confirmation, marital status, residuary-clause
answer, personal representative, form of execution, execution date; when
married, spouse name and the value left to the spouse; for a witnessed or
electronic will, the signed-at-the-end and signed-in-front-of-witnesses answers
and at least one witness name; for a holographic will, the handwriting answer.

### 4.1 State rules

| State | Witnesses | Holographic | Electronic | Interested witness | Notary for self-proving | Elective share | Community property | No-contest | State estate or inheritance tax |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UPC default | 2 | yes | no | gift valid | yes | up to 50% (approximate) | no | enforceable with exceptions | unknown |
| CA | 2 | yes | no | presumption | no (penalty-of-perjury declaration) | none | yes | limited | none |
| NY | 2 | no | no | void unless 2 others | yes | greater of $50,000 or 1/3 | no | enforceable with exceptions | estate, $7,350,000 |
| TX | 2 (sign in testator's presence) | yes | no | void unless 1 corroborates | yes | none | yes | enforceable with exceptions | none |
| FL | 2 (sign in testator's presence) | no | yes | gift valid | yes | 30% | no | unenforceable | none |
| IL | 2 (sign in testator's presence) | no | yes | void unless 2 others | no (attestation clause) | 1/3, or 1/2 with no descendants | no | enforceable with exceptions | estate, $4,000,000 |
| PA | 2 | yes | no | void unless 2 others | yes | 1/3 | no | enforceable with exceptions | inheritance tax |
| OH | 2 (sign in testator's presence) | no | no | void unless 2 others | not used | up to 1/2 (approximate) | no | enforceable with exceptions | none |
| WA | 2 (sign in testator's presence) | no | no | presumption | yes | none | yes | limited | estate, $3,000,000 |

Federal basic exclusion for 2026 deaths: $15,000,000. Rules are summaries of the
cited statutes (see [`doc/index.md`](../doc/index.md)); where a value is marked
approximate or unverified in the research notes, the flag text says to verify.

Interested-witness outcomes: `valid` raises a low note; `presumption` (a rebuttable
presumption of undue influence) applies unless two other disinterested witnesses
signed (medium); `void-unless-two-others` voids the gift unless at least two other
disinterested witnesses signed (high); `void-unless-corroborated` voids the gift
unless at least one disinterested person corroborates (high). A witness whose gift
fails keeps at most the intestate share.

Elective share: for a married testator in a state with a share and an estate value,
the estimate is `estate x fraction` (the greater of that and a floor in New York);
a spouse left less, with no written waiver, raises a medium flag. It is a drafter's
estimate, not the statutory augmented estate.

## 5. Flagged issues

Each flag has an id, a category (a closed set mirrored by the `grade_flag` CHECK),
a priority, a description and a suggested action, sorted high, medium, low.

| Id | Category | Priority | Fires when |
| --- | --- | --- | --- |
| F-WILL-001 | capacity | high | the testator is under 18 on the execution date |
| F-WILL-002 | capacity | high | sound mind is `no` |
| F-WILL-003 | capacity | high | undue influence is `possible` |
| F-WILL-004 | execution-formality | high | the will is not signed at the end |
| F-WILL-005 | witness | high | fewer witnesses than the state needs (and at least one named) |
| F-WILL-006 | execution-formality | high | the testator did not sign or acknowledge in front of the witnesses |
| F-WILL-007 | execution-formality | high or medium | witnesses did not sign in the testator's presence (high where the state requires it) |
| F-WILL-008 | execution-formality | high | a holographic will in a state that does not recognize one |
| F-WILL-009 | execution-formality | high | a holographic will not in the testator's handwriting |
| F-WILL-010 | execution-formality | high | an electronic will in a state not recorded as allowing one |
| F-WILL-011 | witness | high, medium or low | an interested witness, by state outcome (void, presumption, valid) |
| F-WILL-012 | bequest-arithmetic | high | residuary shares do not total 100% |
| F-WILL-013 | bequest-arithmetic | high | specific bequests exceed the estimated estate |
| F-WILL-014 | bequest-arithmetic | medium | no residuary clause |
| F-WILL-015 | capacity | medium | sound mind is `uncertain` |
| F-WILL-016 | spousal-protection | medium | spouse left below the estimated elective share, no waiver |
| F-WILL-017 | spousal-protection | low | married in a community property state |
| F-WILL-018 | spousal-protection | medium | a child is omitted without being named |
| F-WILL-019 | fiduciary | medium | minor children and no guardian named |
| F-WILL-020 | self-proving | medium | affidavit planned but the notary details are incomplete |
| F-WILL-021 | self-proving | low | not self-proved, or the state does not use an affidavit |
| F-WILL-022 | state-rule | medium | state not in the table (UPC default used; verify) |
| F-WILL-023 | other | medium | the will does not revoke prior wills |
| F-WILL-024 | estate-tax | medium | estimated estate above the $15,000,000 federal exclusion |
| F-WILL-025 | estate-tax | medium or low | above the state estate-tax exclusion (medium); state inheritance tax (low) |
| F-WILL-026 to 028 | incomplete | medium | required testator, estate or execution answers are missing |
| F-WILL-029 | digital-assets | low | no digital-assets clause (RUFADAA) |
| F-WILL-030 | state-rule | low | no-contest clause unenforceable or limited in the state |
| F-WILL-031 | fiduciary | low | no successor personal representative |
| F-WILL-032 | other | low | no safekeeping location |
| F-WILL-033 | bequest-arithmetic | low | no contingent beneficiary |

## 6. Inputs and outputs

- **Input:** the `Will` object (six sections above).
- **Grader output:** `validateWill(w)` returns `{ validityClass, residuaryPercentTotal,
  electiveShareAmount, witnessCount, selfProved, federalEstateTaxExposure,
  stateRuleSource }`. The front-ends add `flaggedIssues` (from `detectFlaggedIssues(w)`)
  and a `timestamp`.
- **Persisted grade:** one row in `united_states_last_will_and_testament_grade`
  per will, the fired rules in `_grade_rule`, the flags in `_grade_flag`.

## 7. Artefacts

- `sql/` (source of truth), and generated `xml/`, `fhir/r5/`, `protobuf/`,
  `openapi/`, `back-end-with-axum-setup`.
- `front-end-with-html/js/{types,rules,grader,flags}.js` and
  `front-end-with-svelte/src/lib/engine/` (a TypeScript port with Vitest tests that
  read `examples/personas.json`).
- `back-end-with-axum/`: relational per-table Axum JSON API.
- `examples/personas.json`: 13 hand-authored personas covering every class and
  every flag, graded by `bin/test-personas`.

## 8. Acceptance criteria

- A complete Florida will with two disinterested witnesses, a notary, and 100% of
  the residuary allocated classifies as `valid-ready-to-execute` with no flags.
- A blank plan classifies as `incomplete`, not `formality-risk`.
- Any high flag makes the class `formality-risk`, even when answers are missing.
- Residuary shares of 60% and 30% raise F-WILL-012; 60% and 40% do not.
- A testator who turns 18 on the execution date has capacity; one day earlier does not.
- The New York elective share is the greater of $50,000 and one third of the estate.
- An unlisted state uses the UPC default and raises F-WILL-022.
- The HTML engine and the Svelte port produce identical output for every persona.

## 9. Compliance

Documentation support, not legal advice; the issuing court decides. See the
repository compliance links (MDCG 2019-11 does not apply: this is not a medical
device). The engine is a deterministic checklist, not a legal opinion, and every
report says so.

## 10. References

See [`doc/index.md`](../doc/index.md) for the full list: the Uniform Probate Code
(2-501 to 2-505, 2-202, 3-905), the Revised Uniform Fiduciary Access to Digital
Assets Act, the Uniform Electronic Wills Act, the state statutes in the table
above, and the 2026 federal and state estate-tax thresholds.

## 11. Verify

```sh
bin/test-form united-states-last-will-and-testament
bin/test-personas united-states-last-will-and-testament
bin/test-engines united-states-last-will-and-testament
bin/test-sql-apply united-states-last-will-and-testament
bin/test-examples-conformance united-states-last-will-and-testament
bin/test-e2e --html united-states-last-will-and-testament
```
