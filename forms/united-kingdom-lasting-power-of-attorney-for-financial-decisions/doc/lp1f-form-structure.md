# LP1F Form Structure

Field-by-field map of the prescribed LP1F deed (October 2025 issue)
and the LPC continuation sheets 1–4. Used as the authoritative source
for:

- the TypeScript `Lpa` type,
- the SQL schema in `../sql/`,
- the FHIR / XML / Protobuf / TypeSpec generators,
- the on-screen help in the front-end wizard.

LP12 Guide cross-references are written as "Guide part A4" etc. Where
the LP12 part is uncertain it is marked `(approximate)`.

For each field the table records:

- **Name** — the property name in the canonical JSON (`camelCase`).
- **Type** — one of `text` | `text(long)` | `date` | `enum(...)` |
  `bool` | `int` | `signature` | `array(...)` | `address`.
- **Required** — `yes`, `no`, or `conditional` (with the condition).
- **Validation** — the rule applied to the field.
- **Guide** — LP12 Guide part reference.

## Common types

### `address`

| Sub-field | Type | Required | Notes |
| --- | --- | --- | --- |
| `line1` | text | yes | House name or number, street |
| `line2` | text | no | |
| `line3` | text | no | |
| `town` | text | yes | |
| `county` | text | no | |
| `postcode` | text | yes | UK postcode; uppercase normalised |
| `country` | text | no | Defaults to "United Kingdom" |

### `signature`

| Sub-field | Type | Required | Notes |
| --- | --- | --- | --- |
| `signatoryName` | text | yes | Printed name |
| `signatureImage` | text(long) | yes | Base64 PNG or SVG path |
| `dateSigned` | date | yes | Must not be future-dated |
| `onBehalfOfDonor` | bool | no | True iff donor cannot physically sign — must be paired with LPC sheet 3 |

### `personRef`

A person captured by name plus date of birth plus address; reused for
donor, attorney, replacement attorney, certificate provider, person to
notify, witness.

| Sub-field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | enum(`Mr` \| `Mrs` \| `Miss` \| `Ms` \| `Dr` \| `Other`) | no | |
| `titleOther` | text | conditional (if `title == Other`) | |
| `firstNames` | text | yes | |
| `lastName` | text | yes | |
| `otherNames` | text | no | Aliases, maiden names |
| `dateOfBirth` | date | yes | Used by age-check rules |
| `address` | address | yes | |
| `email` | text | no | |
| `phone` | text | no | |

## Section 1 — Donor

LP1F section 1; Guide part A1.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `donor.title` | enum | no | one of `Mr` \| `Mrs` \| `Miss` \| `Ms` \| `Dr` \| `Other` | A1 |
| `donor.titleOther` | text | conditional | required if `title == Other` | A1 |
| `donor.firstNames` | text | yes | ≤ 50 chars | A1 |
| `donor.lastName` | text | yes | ≤ 50 chars | A1 |
| `donor.otherNames` | text | no | ≤ 100 chars; alias / former names | A1 |
| `donor.dateOfBirth` | date | yes | gives age ≥ 18 at signing date (`DonorUnderEighteen`) | A1 |
| `donor.address` | address | yes | UK postcode mandatory | A1 |
| `donor.email` | text | no | RFC 5322 email if present | A1 |

## Section 2 — Attorneys

LP1F section 2; Guide part A2. Repeat for each attorney; LP1F has
space for up to 4 attorneys. To appoint more, use LPC continuation
sheet 1.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `attorneys` | array(`attorney`) | yes | ≥ 1 attorney (`NoAttorneyAppointed`); > 4 fires `OverFourAttorneysNoContinuation` unless LPC sheet 1 attached | A2 |
| `attorney.isTrustCorporation` | bool | no | true => `attorney.trustCorporation` mandatory; pair with LPC sheet 4 | A2 |
| `attorney.title` | enum | conditional | required if not trust corporation | A2 |
| `attorney.firstNames` | text | conditional | required if not trust corporation | A2 |
| `attorney.lastName` | text | conditional | required if not trust corporation | A2 |
| `attorney.dateOfBirth` | date | conditional | required if not trust corporation; gives age ≥ 18 (`AttorneyUnderEighteen`) | A2 |
| `attorney.address` | address | yes | | A2 |
| `attorney.email` | text | no | flag `AttorneyEmailMissing` if absent | A2 |
| `attorney.trustCorporation.companyName` | text | conditional | required if `isTrustCorporation` | A2 |
| `attorney.trustCorporation.companyRegistrationNumber` | text | conditional | UK Companies House number | A2 |
| `attorney.trustCorporation.registeredAddress` | address | conditional | | A2 |
| `attorney.isBankrupt` | bool | yes | true fires `AttorneyBankruptOrDRO` | A2 |
| `attorney.isSubjectToDRO` | bool | yes | true fires `AttorneyBankruptOrDRO` | A2 |

## Section 3 — How attorneys make decisions

LP1F section 3; Guide part A3.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `decisionMode` | enum(`singleAttorney` \| `jointlyAndSeverally` \| `jointly` \| `mixed`) | yes | `jointly` + no replacement fires `JointlyButNoReplacement`; `mixed` requires LPC sheet 2 (`MixedDecisionWithoutContinuationSheet`); `singleAttorney` only valid if exactly 1 attorney | A3 |
| `mixedDecisionDetails` | text(long) | conditional | required if `decisionMode == mixed`; ≤ 2000 chars; lifted to LPC sheet 2 | A3 |

## Section 4 — Replacement attorneys

LP1F section 4; Guide part A4. Same shape as attorneys; 0 or more.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `replacementAttorneys` | array(`personRef`) | no | each ≥ 18; same eligibility tests as attorneys | A4 |
| `replacementAttorney.isBankrupt` | bool | yes (per person) | true fires `AttorneyBankruptOrDRO` | A4 |
| `replacementAttorney.isSubjectToDRO` | bool | yes (per person) | true fires `AttorneyBankruptOrDRO` | A4 |
| `replacementMode` | text(long) | no | Optional override of "when and how" replacement attorneys step in; if used, lifted to LPC sheet 2 | A4 |

## Section 5 — When attorneys can act

LP1F section 5; Guide part A5.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `whenCanAct` | enum(`asSoonAsRegistered` \| `onlyWhenNoCapacity`) | yes | `onlyWhenNoCapacity` fires moderate flag `OnlyWhenNoCapacitySelected` | A5 |

## Section 6 — People to notify

LP1F section 6; Guide part A8. 0–5 people.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `peopleToNotify` | array(`personRef`) | no | length ≤ 5 (`PeopleToNotifyExceedsFive`); none may overlap with attorneys (`PersonToNotifyIsAttorney`); empty fires low flag `NoPeopleToNotify` | A8 |

Each person-to-notify carries `title`, `firstNames`, `lastName`, and
`address`. Date of birth is not collected for this role.

## Section 7 — Preferences and instructions

LP1F section 7; Guide part A9.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `preferences` | text(long) | no | ≤ 2000 chars; non-binding guidance | A9 |
| `instructions` | text(long) | no | ≤ 2000 chars; binding on attorneys; > 500 chars fires `InstructionsLong` | A9 |
| `preferencesEmpty && instructionsEmpty` | derived | — | fires low flag `PreferencesEmpty` | A9 |

Long text overflows into LPC continuation sheet 2.

## Section 8 — Legal rights statement

LP1F section 8; Guide part A10.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `legalRightsAcknowledged` | bool | yes | must be `true` before section 9 can be signed | A10 |

The legal-rights statement is fixed copy from LP1F section 8; the
form only captures the donor's acknowledgement.

## Section 9 — Donor signature

LP1F section 9; Guide part A11. Must be the **first** signature
chronologically (LPA Regs 2007 reg. 9(6)).

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `donorSignature.signatoryName` | text | yes | normally equals `donor.firstNames + donor.lastName` | A11 |
| `donorSignature.signatureImage` | text(long) | yes | non-empty => fired-rule `DonorMustHaveCapacity` cleared | A11 |
| `donorSignature.dateSigned` | date | yes | not future; ≤ certificate-provider date | A11 |
| `donorSignature.onBehalfOfDonor` | bool | no | true requires LPC sheet 3 (`DonorCannotSignWithoutContinuationSheet3`) | A11 |
| `donorSignature.witness.name` | text | yes | not the donor (`WitnessIsDonor`); not an attorney (`WitnessIsAttorney`) | A11 |
| `donorSignature.witness.address` | address | yes | | A11 |
| `donorSignature.witness.signatureImage` | text(long) | yes | | A11 |
| `donorSignature.witness.dateSigned` | date | yes | same date as donor signature | A11 |

## Section 10 — Certificate provider

LP1F section 10; Guide part B1. Must be signed **after** section 9.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `certificateProvider.title` | enum | no | | B1 |
| `certificateProvider.firstNames` | text | yes | | B1 |
| `certificateProvider.lastName` | text | yes | | B1 |
| `certificateProvider.address` | address | yes | | B1 |
| `certificateProvider.dateOfBirth` | date | yes | gives age ≥ 18 (`CertificateProviderUnderEighteen`) | B1 |
| `certificateProvider.basis` | enum(`knownAsFriend` \| `knownAsProfessional`) | yes | `knownAsFriend` => known donor personally ≥ 2 years | B1 |
| `certificateProvider.professionalRole` | text | conditional | required if `basis == knownAsProfessional` | B1 |
| `certificateProvider.isAttorneyInThisLpa` | bool | yes | true fires `CertificateProviderIsAttorney` | B1 |
| `certificateProvider.isRelatedToDonorOrAttorney` | bool | yes | true fires `CertificateProviderRelatedToAttorney` | B1 |
| `certificateProvider.isCareHomeStaff` | bool | yes | true fires `CertificateProviderIsCareHomeOwner` | B1 |
| `certificateProvider.signature.signatureImage` | text(long) | yes | | B1 |
| `certificateProvider.signature.dateSigned` | date | yes | ≥ donor `dateSigned` (`SigningOrderViolation`) | B1 |

The certificate provider also confirms (statutory wording printed on
LP1F section 10):

- The donor understands the purpose of the LPA and the powers it
  confers.
- The donor is not making the LPA under fraud or undue pressure.
- The donor is not making the LPA because of any other concern.

The validator does **not** require these confirmations be captured as
separate booleans (signing section 10 implies all three) but the
front-end displays the wording verbatim.

## Section 11 — Attorney signatures

LP1F section 11; Guide part B2. One per attorney **and** one per
replacement attorney. Must be signed **after** section 10.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `attorneySignatures` | array(`attorneySignature`) | yes | one per attorney; one per replacement | B2 |
| `attorneySignature.attorneyId` | uuid | yes | foreign key to section 2 or 4 entry | B2 |
| `attorneySignature.signature.signatureImage` | text(long) | yes | | B2 |
| `attorneySignature.signature.dateSigned` | date | yes | ≥ certificate-provider date (`SigningOrderViolation`) | B2 |
| `attorneySignature.witness.name` | text | yes | not the donor (`AttorneyWitnessIsDonor`) | B2 |
| `attorneySignature.witness.address` | address | yes | | B2 |
| `attorneySignature.witness.signatureImage` | text(long) | yes | | B2 |
| `attorneySignature.witness.dateSigned` | date | yes | same date as attorney signature | B2 |

For a trust-corporation attorney, the signature is replaced by the
company seal — captured in LPC sheet 4 (see below).

## Section 12 — Applicant

LP1F section 12; Guide part C. The first of the registration-
application sections.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `applicant.kind` | enum(`donor` \| `attorneys`) | yes | `attorneys` + joint mode => all attorneys must appear in `applicant.persons` (`RegistrationApplicantInvalid`) | C |
| `applicant.persons` | array(`personRef`) | yes | for `kind == donor`, the single donor; for `kind == attorneys`, each named attorney with their date of birth | C |

## Section 13 — Who receives the LPA

LP1F section 13; Guide part C.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `recipient.kind` | enum(`donor` \| `attorney` \| `other`) | yes | | C |
| `recipient.attorneyId` | uuid | conditional | required if `kind == attorney` | C |
| `recipient.otherName` | text | conditional | required if `kind == other` | C |
| `recipient.otherAddress` | address | conditional | required if `kind == other` | C |
| `prefersToBeContactedBy.post` | bool | no | empty fires low flag `EmergencyContactMissing` | C |
| `prefersToBeContactedBy.phone` | text | no | UK phone if present | C |
| `prefersToBeContactedBy.email` | text | no | | C |
| `prefersToBeContactedBy.welshCorrespondence` | bool | no | true => OPG corresponds in Welsh (Welsh Language Act 1993) | C |

## Section 14 — Application fee

LP1F section 14; Guide part C.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `fee.paymentMethod` | enum(`card` \| `cheque`) | yes | `card` => OPG will phone the applicant for card details | C |
| `fee.cardCallbackPhone` | text | conditional | required if `paymentMethod == card` | C |
| `fee.reducedFeeRequested` | bool | yes | true requires LPA120A (`ReducedFeeWithoutLPA120A`) | C |
| `fee.reducedFeeBasis` | enum(`lowIncome` \| `meansTestedBenefit`) | conditional | required if `reducedFeeRequested` | C |
| `fee.lpa120aAttached` | bool | conditional | required if `reducedFeeRequested`; false fires flag | C |
| `fee.repeatApplication` | bool | yes | true => half-fee under reg. 7 | C |
| `fee.previousCaseNumber` | text | conditional | required if `repeatApplication` | C |

## Section 15 — Registration signature

LP1F section 15; Guide part D. One signature per applicant.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `registrationSignatures` | array(`signature`) | yes | one entry per `applicant.persons`; joint attorneys => all must sign (`RegistrationApplicantInvalid`) | D |
| `registrationSignature.signatoryName` | text | yes | matches an `applicant.persons` entry | D |
| `registrationSignature.signatureImage` | text(long) | yes | | D |
| `registrationSignature.dateSigned` | date | yes | ≥ latest attorney signature date | D |

## LPC continuation sheets

The LPC pack is one optional file used to overflow LP1F. Four sheet
types share one form.

### LPC continuation sheet 1 — additional people

Used when section 2 (attorneys), section 4 (replacements), or
section 6 (people-to-notify) has more entries than LP1F can hold.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `lpcSheet1.entries` | array(`personRef`) | yes | each entry duplicates the LP1F section structure | A2 / A4 / A8 |
| `lpcSheet1.role` | enum(`attorney` \| `replacementAttorney` \| `personToNotify`) | yes | one sheet 1 per role; multiple sheets allowed | A2 / A4 / A8 |
| `lpcSheet1.donorInitialOnEachPage` | text(long) | yes | donor must initial every additional page | reg. 9(3) *(approximate)* |

### LPC continuation sheet 2 — additional decisions / preferences / instructions

Used when:

- section 3 selects "mixed" decision mode, or
- section 7 free-text overflows beyond LP1F's space.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `lpcSheet2.purpose` | enum(`mixedDecisions` \| `additionalPreferences` \| `additionalInstructions`) | yes | | A3 / A9 |
| `lpcSheet2.text` | text(long) | yes | | A3 / A9 |
| `lpcSheet2.donorInitialOnEachPage` | text(long) | yes | | reg. 9(3) *(approximate)* |
| `lpcSheet2.witnessName` | text | conditional | required if used to amend section 3 (`mixed` mode) | A3 |
| `lpcSheet2.witnessSignature` | signature | conditional | required if used to amend section 3 | A3 |

### LPC continuation sheet 3 — signed on behalf of donor

Used when the donor cannot physically sign section 9 (e.g. severe
motor impairment) and another adult signs at the donor's direction.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `lpcSheet3.signerName` | text | yes | not the donor; not any attorney | A11 |
| `lpcSheet3.signerAddress` | address | yes | | A11 |
| `lpcSheet3.signerSignature` | signature | yes | | A11 |
| `lpcSheet3.donorPresent` | bool | yes | must be `true` — donor must be physically present when their signature is made on their behalf | A11 |
| `lpcSheet3.firstWitness.name` | text | yes | | A11 |
| `lpcSheet3.firstWitness.address` | address | yes | | A11 |
| `lpcSheet3.firstWitness.signature` | signature | yes | | A11 |
| `lpcSheet3.secondWitness.name` | text | yes | a second independent witness is required | A11 |
| `lpcSheet3.secondWitness.address` | address | yes | | A11 |
| `lpcSheet3.secondWitness.signature` | signature | yes | | A11 |

Signature on behalf of the donor needs **two** independent witnesses
(LPA Regs 2007 reg. 9(4) *(approximate)*); the first witness usually
also acts as the section-9 witness.

### LPC continuation sheet 4 — trust corporation

Used when one of the attorneys is a trust corporation. Replaces the
attorney's signature with the corporation's seal and authorised-
signatory block.

| Name | Type | Required | Validation | Guide |
| --- | --- | --- | --- | --- |
| `lpcSheet4.companyName` | text | yes | matches `attorney.trustCorporation.companyName` | B2 |
| `lpcSheet4.companyRegistrationNumber` | text | yes | | B2 |
| `lpcSheet4.registeredAddress` | address | yes | | B2 |
| `lpcSheet4.authorisedSignatoryName` | text | yes | natural-person signatory | B2 |
| `lpcSheet4.authorisedSignatoryRole` | text | yes | director, secretary, authorised officer, etc. | B2 |
| `lpcSheet4.authorisedSignature` | signature | yes | | B2 |
| `lpcSheet4.companySealApplied` | bool | yes | must be `true` | B2 |
| `lpcSheet4.witness.name` | text | yes | not the donor | B2 |
| `lpcSheet4.witness.address` | address | yes | | B2 |
| `lpcSheet4.witness.signature` | signature | yes | | B2 |

## Validation summary by section

A quick lookup of which blocker rules can fire from each section.

| Section | Potential blockers |
| --- | --- |
| 1 Donor | `DonorUnderEighteen` |
| 2 Attorneys | `NoAttorneyAppointed`, `AttorneyUnderEighteen`, `AttorneyBankruptOrDRO`, `TrustCorporationMissingContinuationSheet4`, `OverFourAttorneysNoContinuation` |
| 3 Decision mode | `JointlyButNoReplacement`, `MixedDecisionWithoutContinuationSheet` |
| 4 Replacement attorneys | `AttorneyUnderEighteen`, `AttorneyBankruptOrDRO` |
| 5 When | (flag only) |
| 6 People to notify | `PeopleToNotifyExceedsFive`, `PersonToNotifyIsAttorney` |
| 7 Preferences / instructions | (flags only) |
| 8 Legal rights | (precondition for section 9) |
| 9 Donor signature | `DonorMustHaveCapacity`, `DonorCannotSignWithoutContinuationSheet3`, `WitnessIsDonor`, `WitnessIsAttorney`, `SigningOrderViolation` |
| 10 Certificate provider | `CertificateProviderIsAttorney`, `CertificateProviderRelatedToAttorney`, `CertificateProviderIsCareHomeOwner`, `CertificateProviderUnderEighteen`, `SigningOrderViolation` |
| 11 Attorney signatures | `AttorneyWitnessIsDonor`, `SigningOrderViolation` |
| 12 Applicant | `RegistrationApplicantInvalid` |
| 13 Recipient | (flag only) |
| 14 Fee | (flag only) |
| 15 Registration signature | `RegistrationApplicantInvalid` |

For the rule-by-rule predicate, citation, priority, and remediation
hint see [`lpa-validation-rules.md`](./lpa-validation-rules.md).
