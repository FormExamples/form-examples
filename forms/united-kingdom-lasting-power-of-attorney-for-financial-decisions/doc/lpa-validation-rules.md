# LPA Validation Rules

Authoritative rule catalogue for the LP1F validation engine. The
engine produces a `compositeRisk` of `critical` if **any** blocker
fires; otherwise the worst-priority additional flag wins
(`high` > `moderate` > `low`).

- **Blocker rules** are statutory: firing one of them means the OPG
  will (or should) reject the deed. Source: MCA 2005 (c. 9) and the
  Lasting Powers of Attorney, Enduring Powers of Attorney and Public
  Guardian Regulations 2007 (SI 2007/1253), unless marked
  `(approximate)`.
- **Flag rules** are non-statutory: best-practice warnings that lower
  the practical robustness of the LPA. Firing them does **not**
  prevent registration but is reported to the user.

The remediation hint is the text the front-end shows next to the
fired rule.

## Blocker rules (any one => `critical`)

### Donor eligibility

| Rule | Predicate (plain English) | Citation | Priority | Remediation hint |
| --- | --- | --- | --- | --- |
| `DonorUnderEighteen` | Donor's date of birth gives an age < 18 at the date of signing. | MCA 2005 s. 9(2)(a) | critical | The donor must be 18 or older to make an LPA. Check the date of birth in section 1, or wait until the donor is 18. |
| `DonorMustHaveCapacity` | Donor signature missing in section 9, or the capacity assertion is unchecked. | MCA 2005 s. 9(2)(c); Sch. 1 para. 2(1)(b) | critical | The donor must sign section 9 themselves while they still have mental capacity. If the donor cannot physically sign, use LPC continuation sheet 3. |
| `DonorCannotSignWithoutContinuationSheet3` | Donor's signature is marked "signed on behalf of donor" but no LPC sheet 3 is attached. | LPA Regs 2007 reg. 9(4) *(approximate)* | critical | When the donor cannot physically sign, another adult may sign at the donor's direction — but you must attach LPC continuation sheet 3 with witness details. |

### Attorney eligibility

| Rule | Predicate | Citation | Priority | Remediation hint |
| --- | --- | --- | --- | --- |
| `NoAttorneyAppointed` | Section 2 contains zero attorneys. | MCA 2005 s. 9(1) | critical | An LPA must appoint at least one attorney. Add an attorney in section 2. |
| `AttorneyUnderEighteen` | Any attorney's date of birth gives an age < 18. | MCA 2005 s. 10(1)(a) | critical | Attorneys must be 18 or older. Replace the under-18 attorney in section 2. |
| `AttorneyBankruptOrDRO` | Any attorney is bankrupt or subject to a debt relief order. | MCA 2005 s. 10(2); s. 13(8) | critical | A bankrupt person, or someone subject to a debt relief order, cannot act as attorney for property and financial affairs. Replace the attorney before signing. |
| `TrustCorporationMissingContinuationSheet4` | A trust corporation is appointed as attorney but no LPC continuation sheet 4 is attached. | LPA Regs 2007 reg. 9(5) *(approximate)* | critical | When a trust corporation is appointed as attorney you must complete LPC continuation sheet 4 with the corporation's details and seal. |
| `OverFourAttorneysNoContinuation` | Section 2 lists more than 4 attorneys but no LPC continuation sheet 1 is attached. | LPA Regs 2007 reg. 9(3) *(approximate)* | critical | The LP1F has space for 4 attorneys. To appoint more, attach LPC continuation sheet 1 with their details. |

### How attorneys make decisions

| Rule | Predicate | Citation | Priority | Remediation hint |
| --- | --- | --- | --- | --- |
| `JointlyButNoReplacement` | Attorneys are appointed "jointly" and no replacement attorney is listed. | MCA 2005 s. 10(4)(a); LP12 Guide part A6 | critical | When attorneys must act jointly, the LPA fails entirely if any one of them can no longer act. Strongly recommended: appoint at least one replacement attorney in section 4. |
| `MixedDecisionWithoutContinuationSheet` | Section 3 set to "jointly for some, severally for others" with no LPC continuation sheet 2 listing the joint decisions. | MCA 2005 s. 10(4)(c); LPA Regs 2007 reg. 5(2) | critical | The "mixed" mode requires you to specify which decisions are joint. Attach LPC continuation sheet 2 with that list. |

### Certificate provider eligibility (LPA Regs 2007 reg. 8)

| Rule | Predicate | Citation | Priority | Remediation hint |
| --- | --- | --- | --- | --- |
| `CertificateProviderUnderEighteen` | Certificate provider date of birth gives an age < 18. | LPA Regs 2007 reg. 8(1) *(approximate)* | critical | The certificate provider must be an adult. Choose a different person for section 10. |
| `CertificateProviderIsAttorney` | The certificate provider also appears as an attorney or replacement attorney. | LPA Regs 2007 reg. 8(1)(c) | critical | The certificate provider must be independent. They cannot also be one of the attorneys or replacement attorneys. Choose a different certificate provider. |
| `CertificateProviderRelatedToAttorney` | The certificate provider is a spouse, civil partner, in-law, parent, child, sibling, or step-relative of the donor or any attorney. | LPA Regs 2007 reg. 8(1)(d) | critical | The certificate provider cannot be a family member of the donor or any of the attorneys. Choose an independent person — a friend who has known the donor 2+ years, or a professional (GP, solicitor). |
| `CertificateProviderIsCareHomeOwner` | The certificate provider is an owner, manager, director, or employee of the care home in which the donor lives. | LPA Regs 2007 reg. 8(2) | critical | If the donor lives in a care home, no one connected with that care home can be the certificate provider. Choose an independent person. |

### Witnesses (LPA Regs 2007 reg. 9(2))

| Rule | Predicate | Citation | Priority | Remediation hint |
| --- | --- | --- | --- | --- |
| `WitnessIsDonor` | The donor's signature witness in section 9 is the donor. | LPA Regs 2007 reg. 9(2) | critical | A witness must be someone other than the person signing. Choose a different witness for the donor's signature. |
| `WitnessIsAttorney` | The donor's signature witness is also an attorney or replacement attorney. | LPA Regs 2007 reg. 9(2) | critical | The donor's signature must be witnessed by someone who is not one of the attorneys or replacement attorneys. |
| `AttorneyWitnessIsDonor` | An attorney's signature witness in section 11 is the donor. | LPA Regs 2007 reg. 9(2) | critical | An attorney's signature must be witnessed by someone other than the donor. Choose a different witness for each attorney. |

### People to notify

| Rule | Predicate | Citation | Priority | Remediation hint |
| --- | --- | --- | --- | --- |
| `PeopleToNotifyExceedsFive` | Section 6 lists more than 5 people to notify. | LP1F section 6; LP12 Guide part A8 | critical | You can name up to 5 people to notify. Remove anyone above the fifth, or move them off the form. |
| `PersonToNotifyIsAttorney` | A person-to-notify is also listed as attorney or replacement attorney. | LP1F section 6 inline restriction *(approximate)* | critical | A person who is going to be an attorney cannot also be a person-to-notify. Choose someone else, or remove them from section 6. |

### Signing order and registration

| Rule | Predicate | Citation | Priority | Remediation hint |
| --- | --- | --- | --- | --- |
| `SigningOrderViolation` | The certificate provider signed section 10 before the donor signed section 9, or any attorney signed section 11 before the certificate provider signed section 10. | LPA Regs 2007 reg. 9(6) | critical | The signing order is fixed: donor first (section 9), then certificate provider (section 10), then attorneys (section 11). Re-sign in the correct order; do not change dates. |
| `RegistrationApplicantInvalid` | The applicant in section 12 is neither the donor nor any attorney, or attorneys are appointed jointly and not all have signed section 15. | LPA Regs 2007 reg. 11 | critical | Only the donor or one or more of the attorneys may apply to register. If attorneys are joint, all of them must sign the registration application in section 15. |

## Flag rules (`high` > `moderate` > `low`)

### High-priority flags

| Rule | Predicate | Source | Remediation hint |
| --- | --- | --- | --- |
| `ReducedFeeWithoutLPA120A` | Section 14 marks reduced or waived fee but no LPA120A and supporting evidence is attached. | OPG fee policy; LPA120A | If you are asking for a reduced or waived fee, you must complete form LPA120A and attach evidence (bank statement, benefit letter, payslip). Without this the OPG will charge the full fee or return the form. |
| `OverFourAttorneysNoContinuation` | More than 4 attorneys but no LPC sheet 1 (also a blocker — listed here as a high flag during draft). | LPA Regs 2007 reg. 9(3) *(approximate)* | LP1F only has space for 4 attorneys. Attach LPC continuation sheet 1 for the rest. |

### Moderate-priority flags

| Rule | Predicate | Source | Remediation hint |
| --- | --- | --- | --- |
| `SingleAttorneyNoReplacement` | Only one attorney appointed and no replacement attorney listed in section 4. | LP12 Guide part A4 | The LPA will become useless if the single attorney loses capacity or is unable to act. Strongly recommended: add a replacement attorney in section 4. |
| `OnlyWhenNoCapacitySelected` | Section 5 set to "only when I don't have mental capacity". | LP12 Guide part A5 | This option restricts the LPA to incapacity only and means attorneys cannot help with finances while you still have capacity. Banks and other organizations may also require evidence of incapacity each time. Consider "as soon as the LPA is registered". |

### Low-priority flags

| Rule | Predicate | Source | Remediation hint |
| --- | --- | --- | --- |
| `NoPeopleToNotify` | Section 6 contains zero people-to-notify. | LP12 Guide part A8 | People-to-notify give an external safeguarding check. Strongly recommended: list at least one trusted person who is not an attorney. |
| `InstructionsLong` | Instructions free-text in section 7 longer than 500 characters. | LP12 Guide part A9 | Long or complex instructions can be legally incorrect and may cause the OPG to reject the LPA. Consider redrafting with a solicitor, or moving content into "preferences" (which are non-binding guidance). |
| `PreferencesEmpty` | Both `preferences` and `instructions` in section 7 are empty. | LP12 Guide part A9 | Optional. The donor may want to leave non-binding preferences (e.g. "consult my children before selling the family home"). |
| `AttorneyEmailMissing` | Any attorney has no email address. | LP1F section 2 | Optional. OPG can deal with attorneys by post; email speeds up later correspondence. |
| `EmergencyContactMissing` | Section 13 has no `prefersToBeContactedBy` value. | LP1F section 13 | Optional. Set a contact preference so OPG knows how to reach the donor or applicant. |

## Priority and `compositeRisk` mapping

| Worst rule fired | `compositeRisk` |
| --- | --- |
| any blocker | `critical` |
| any `high` flag | `high` |
| any `moderate` flag | `moderate` |
| any `low` flag | `low` |
| none | `low` (default) |

## `validityBand` transitions

Independent of the rule output:

| Band | Trigger |
| --- | --- |
| `draft` | any required field still empty |
| `ready_for_signing` | all sections 1–8 + 12–14 complete; no signatures captured |
| `partially_signed` | donor signature present; certificate provider or attorney signatures still missing |
| `fully_signed` | sections 9, 10, 11 all signed in the correct order |
| `ready_for_registration` | `fully_signed` plus section 15 signed, fee selected, LPA120A attached if reduced |
| `submitted` | sent to OPG, awaiting decision |
| `registered` | OPG has stamped and returned |
| `rejected` | OPG has refused; correction or fresh deed required |

## Worked examples

The following short scenarios illustrate how the rule catalogue
combines on real cases.

### Example 1 — joint attorneys, no replacement, no people-to-notify

- Section 2: two attorneys, both ≥ 18, neither bankrupt.
- Section 3: `jointly`.
- Section 4: empty.
- Section 6: empty.

Fired blocker: `JointlyButNoReplacement` (MCA 2005 s. 10(4)(a)) =>
`compositeRisk = critical`. Flag `NoPeopleToNotify` also reported.
Remediation: add a replacement in section 4 *or* change section 3 to
`jointlyAndSeverally`.

### Example 2 — son is certificate provider

- Section 2: two attorneys (one of them is the donor's son).
- Section 10: certificate provider is another son.

Fired blocker: `CertificateProviderRelatedToAttorney` (LPA Regs 2007
reg. 8(1)(d)) => `compositeRisk = critical`. Remediation: replace the
certificate provider with an independent friend known ≥ 2 years, or a
professional.

### Example 3 — reduced fee without evidence

- Section 14: `reducedFeeRequested = true`, basis `lowIncome`,
  `lpa120aAttached = false`.

No blocker. Fired flag: `ReducedFeeWithoutLPA120A` (high priority) =>
`compositeRisk = high`. Remediation: complete LPA120A and attach
evidence before posting.

### Example 4 — clean deed

- All ≥ 18, no bankruptcies, certificate provider is the donor's GP,
  three attorneys appointed `jointlyAndSeverally`, one replacement,
  two people-to-notify, instructions blank, preferences populated,
  full fee, signed in the correct order with valid witnesses.

No blocker, no flag fires above `low` => `compositeRisk = low`,
`validityBand = ready_for_registration`.

## Engine files

The catalogue above is implemented in:

- `validator/types.ts`
- `validator/utils.ts`
- `validator/blocker-rules.ts`
- `validator/flag-rules.ts`
- `validator/band-rules.ts`
- `validator/validator.ts`

with tests in `validator/*.test.ts`.

Each rule emits a structured record:

```ts
type FiredRule = {
  ruleId: string;            // e.g. 'CertificateProviderIsAttorney'
  priority: 'critical' | 'high' | 'moderate' | 'low';
  citation: string;          // e.g. 'LPA Regs 2007 reg. 8(1)(c)'
  fieldPath: string;         // dotted JSON path into the Lpa
  message: string;           // plain-English description
  remediation: string;       // hint shown to the user
};
```

A `FiredRule` with `priority == 'critical'` is a blocker; everything
else is an `AdditionalFlag` and uses the same record shape.
