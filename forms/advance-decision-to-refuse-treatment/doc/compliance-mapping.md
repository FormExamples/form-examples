# Compliance Mapping

This document maps each form step to the statutory requirements of the
**Mental Capacity Act 2005**, sections 24–26, and to Chapter 9 of the MCA
2005 Code of Practice. The mapping is the basis of the validity engine.

## Step-by-step compliance map

| Step | Form section | MCA 2005 hook | Validity contribution |
| --- | --- | --- | --- |
| 1 | Personal Information | s.24(1) (maker must be 18+) | Captures DOB so engine can flag if maker is under 18. |
| 2 | Capacity Declaration | s.24(1) (capacity at time of making) | Records the maker's explicit declaration of capacity. A blank declaration prevents a "Valid" verdict. |
| 3 | Circumstances | s.24(1)(b), s.25(2)(c) | The triggering circumstances must be specified; if too vague, s.25(2)(c) renders the decision inapplicable. |
| 4 | Treatments Refused — General | s.24(1)(a) | Captures the specific treatments refused. A free-text list is permitted but must identify the treatment. |
| 5 | Treatments Refused — Life-Sustaining | s.25(5)(a)–(c), s.25(6) | Must include the express "even if life is at risk" statement, be in writing, signed, and witnessed. |
| 6 | Exceptions & Conditions | s.25(2)(c) | Documents anything that would render the decision inapplicable. |
| 7 | Other Wishes | (advisory only) | Non-binding wishes; recorded separately and not weighted in validity. |
| 8 | Lasting Power of Attorney | s.25(7) | Records whether a later LPA HW exists that would override the ADRT. |
| 9 | Healthcare Professional Review | Code of Practice 9.10–9.23 | Captures the review and the reviewer's role for audit. |
| 10 | Legal Signatures | s.25(6)(b)–(d) | Maker signature, witness signature, dates. Without these, life-sustaining refusal is invalid. |

## Validity engine — rule sources

The validity engine emits one of three categorical verdicts:

| Verdict | Rule source |
| --- | --- |
| **Valid** | All s.24–26 prerequisites are met and there is no later LPA HW overriding the decision. |
| **Invalid** | s.25(2)(a) — the maker had capacity at the relevant later time; or s.25(2)(b) — circumstances clearly outside those specified; or s.25(2)(c) — clearly inconsistent later behaviour; or s.25(5)–(6) formalities not met. |
| **Incomplete** | One or more required fields above are blank such that the engine cannot evaluate the s.25 tests. |

## Special category data — UK GDPR

The ADRT processes UK GDPR Article 9 "special category" data (health, beliefs
relating to end-of-life choices). Lawful basis under UK GDPR / Data
Protection Act 2018:

- UK GDPR Article 6(1)(e) — performance of a task carried out in the public
  interest.
- UK GDPR Article 9(2)(h) — preventive medicine, medical diagnosis,
  provision of health or social care.

Information Commissioner's Office (ICO) special-category guidance:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/special-category-data/>

## Confidentiality

ADRTs must be retained in the patient record per the NHS Confidentiality Code
of Practice and the GMC standard on confidentiality.

- NHS *Confidentiality: NHS Code of Practice* (2003) — Department of Health
  publication, indexed via the National Archives:
  <https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.dh.gov.uk/en/Publicationsandstatistics/Publications/PublicationsPolicyAndGuidance/DH_4069253>
- GMC *Confidentiality: good practice in handling patient information* (2017):
  <https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/confidentiality>
