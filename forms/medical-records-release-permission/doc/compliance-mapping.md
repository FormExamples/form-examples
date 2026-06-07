# Compliance Mapping

This document maps each wizard step to the UK GDPR Article 7 consent
requirements, the ICO consent guidance, and the HIPAA Privacy Rule
authorisation requirements at 45 CFR § 164.508.

## Step-by-step compliance map

| Step | Section | UK GDPR / DPA hook | HIPAA § 164.508 hook | Capture purpose |
| --- | --- | --- | --- | --- |
| 1 | Patient Information | Art. 7(1) identifying data subject | § 164.508(c)(1)(i) | Identifies the consenter |
| 2 | Authorized Recipient | Art. 13(1)(e) recipients | § 164.508(c)(1)(iii) | Identifies the third party |
| 3 | Records to Release | Art. 7(2) specific | § 164.508(c)(1)(i) specific & meaningful description | Defines the scope of release |
| 4 | Purpose of Release | Art. 7(2), 13(1)(c) | § 164.508(c)(1)(iv) | Defines lawful purpose |
| 5 | Authorization Period | Art. 7(3), Art. 13(2)(a) | § 164.508(c)(1)(v) expiration | Sets time-bounded authorisation |
| 6 | Restrictions & Limitations | Art. 7(2) granular | n/a explicit, but supports compound authorisation rules | Captures partial exclusions |
| 7 | Patient Rights | Art. 7(3), Art. 17 right to erasure | § 164.508(c)(2)(i)–(iii) right to revoke + treatment-conditioning + re-disclosure statements | Informs the patient of rights |
| 8 | Signature & Consent | Art. 7(1) | § 164.508(c)(1)(vi) | Captures patient signature |

## Verdict assembly

| Verdict | Trigger |
| --- | --- |
| `complete` | All eight steps required fields populated, signature present, date present, expiration set. |
| `incomplete` | One or more required fields blank, signature missing, or expiration unset. |

## UK GDPR Article 7 specific requirements

| Art. 7 paragraph | Requirement | How met |
| --- | --- | --- |
| 7(1) | Demonstrate that the data subject has consented | Signed authorisation record retained with controller |
| 7(2) | Request must be presented in an intelligible and easily accessible form, using clear and plain language | Form uses plain-English headings per ICO consent guidance |
| 7(3) | The data subject must have the right to withdraw consent at any time | Step 7 surfaces this; the form supports a withdrawal record |
| 7(4) | Account taken of whether performance of a contract is conditional on consent | Not applicable — release is not conditional |

## HIPAA § 164.508 core-element check

The form's emitter cross-checks the eight steps against the § 164.508(c)(1)
"core elements":

- (i) Specific and meaningful description of the information — Step 3.
- (ii) Identity of the person authorised to make the disclosure (the
  covered entity) — captured in the controller's `recipient_config`
  block at issue time.
- (iii) Identity of the person to whom the disclosure may be made —
  Step 2.
- (iv) Description of each purpose — Step 4.
- (v) Expiration date or event — Step 5.
- (vi) Signature and date — Step 8.

And the § 164.508(c)(2) "required statements":

- Right to revoke — Step 7.
- Statement that treatment, payment, enrolment, or eligibility cannot be
  conditioned on the authorisation — Step 7.
- Potential for re-disclosure outside HIPAA — Step 7.

## Withdrawal

The form supports a post-signature withdrawal entry. Withdrawal:

- Stops further disclosures from the date of withdrawal.
- Does **not** undo disclosures already made.
- Surfaces `flag_authorisation_withdrawn` on the dashboard.

ICO consent withdrawal:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/consent/right-to-withdraw-consent/>

HIPAA revocation: 45 CFR § 164.508(b)(5):
<https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.508>

## Sensitive categories

Where the records include UK GDPR Article 9 special-category data, the
form re-uses the Step 4 purpose entry to record that the patient is
giving Article 9(2)(a) explicit consent (not merely Article 6(1)(a)
consent). In US flows, the form captures separate authorisations where
required for:

- Psychotherapy notes — 45 CFR § 164.508(a)(2).
- Substance-use disorder records — 42 CFR Part 2.
- HIV / genetic / state-flagged categories — per state law.

## Records of deceased patients (UK)

Where the data subject is deceased, UK GDPR does not apply (it covers
living individuals). The Access to Health Records Act 1990 governs the
disclosure. The form supports a "deceased patient" pathway that captures:

- Date of death.
- Applicant identity and role (personal representative, named claimant).
- Statutory authority cited (AHRA 1990 ss.3–4).

## Audit fields

Every release record retains:

- The patient's signed authorisation.
- The list of records actually released.
- The recipient's identity and contact.
- The disclosure timestamp and the operator's identity.

These satisfy UK GDPR Article 5(2) accountability and HIPAA § 164.528
accounting-of-disclosures requirements.

HIPAA § 164.528:
<https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.528>
