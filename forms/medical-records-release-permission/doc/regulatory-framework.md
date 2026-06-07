# Regulatory Framework

The Medical Records Release Permission form authorises the disclosure of a
patient's medical records to a named third party. The form operates at the
intersection of UK GDPR data-protection law, the common-law duty of
confidentiality, and (in US contexts) the HIPAA Privacy Rule.

## UK / NHS framework

### Primary instruments

- **UK GDPR** Articles 6, 9, 13, 15 —
  <https://www.legislation.gov.uk/eur/2016/679/contents>
- **Data Protection Act 2018** (c. 12), Part 2 Chapter 2 (special-category
  data) —
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- **Access to Health Records Act 1990** (c. 23) — applies to the records
  of deceased patients —
  <https://www.legislation.gov.uk/ukpga/1990/23/contents>
- **Common-law duty of confidentiality** — defence by patient consent.

### Lawful basis when patient consents to release

- UK GDPR Article 6(1)(a) — explicit consent of the data subject.
- UK GDPR Article 9(2)(a) — explicit consent for special-category data.

The form's signed authorisation captures this consent and forms the
controller's evidence of compliance with Article 7 (conditions for
consent) and ICO consent guidance:

<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/consent/>

### Subject access vs. third-party release

A patient may also use UK GDPR Article 15 (subject access right) to obtain
their own records and then forward them to a third party. The form is the
**direct release to third party** route, which avoids the patient acting
as intermediary.

ICO subject-access guidance:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/>

### Confidentiality framework

- NHS *Confidentiality: NHS Code of Practice* (2003) — archived:
  <https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.dh.gov.uk/en/Publicationsandstatistics/Publications/PublicationsPolicyAndGuidance/DH_4069253>
- GMC *Confidentiality: good practice in handling patient information*
  (2017), paragraphs 9–18 (express consent to disclosure) —
  <https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/confidentiality>

## US / HIPAA framework

Where the controller is a HIPAA covered entity or business associate, the
release authorisation must comply with the HIPAA Privacy Rule's
authorisation requirements:

- 45 CFR § 164.508 — Uses and disclosures for which an authorization is
  required —
  <https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.508>
- 45 CFR Part 164 Subpart E (Privacy Rule generally) —
  <https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E>
- US HHS Office for Civil Rights — Authorization model form and guidance:
  <https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/index.html>

The 45 CFR § 164.508 "core elements" required for a valid HIPAA
authorisation are reflected in the form's wizard steps.

## Required elements (cross-jurisdictional)

The form captures the elements required by both UK GDPR consent law and
HIPAA § 164.508:

| Element | UK GDPR hook | HIPAA hook |
| --- | --- | --- |
| Specific identification of the data subject | Art. 7(1), 13(1)(a) | § 164.508(c)(1)(i) description of who is authorised |
| Description of the records to be released | Art. 7(2) specific | § 164.508(c)(1)(i) specific & meaningful description |
| Identity of the recipient | Art. 13(1)(e) | § 164.508(c)(1)(iii) |
| Purpose of release | Art. 7(2), 13(1)(c) | § 164.508(c)(1)(iv) |
| Expiration date or event | Art. 7(3) withdrawal | § 164.508(c)(1)(v) |
| Signature of the patient and date | Art. 7(1) | § 164.508(c)(1)(vi) |
| Right to revoke | Art. 7(3) | § 164.508(c)(2)(i) |
| Statement that treatment cannot be conditioned on the authorisation | n/a | § 164.508(c)(2)(ii) |
| Statement that re-disclosure may no longer be protected | n/a | § 164.508(c)(2)(iii) |

## Special situations

### Records of deceased patients (UK)

The Access to Health Records Act 1990 governs disclosure of deceased
patients' records to personal representatives and persons with claims
arising from the death. The form supports this by capturing the
applicant's role (personal representative, named claimant) and the
authority on which they apply.

### Sensitive categories (US)

US federal and state law impose additional safeguards on:

- Mental health records and psychotherapy notes — 45 CFR § 164.508(a)(2)
  separate authorisation.
- Substance-use disorder records — 42 CFR Part 2 separate authorisation:
  <https://www.ecfr.gov/current/title-42/chapter-I/subchapter-A/part-2>
- HIV / AIDS, genetic test results, sexually-transmitted infection records
  — state-specific.

The form supports a "sensitive categories" block where the patient
explicitly authorises (or excludes) each sensitive category.

## Software classification

- MDCG 2019-11 Rev.1 — the form does not perform a medical-device
  function.
- ISO/IEC/IEEE 26514:2022 governs the design of the user information.
