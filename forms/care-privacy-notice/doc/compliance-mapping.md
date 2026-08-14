# Compliance Mapping

This document maps each section of the Care Privacy Notice to the UK GDPR
transparency requirements it satisfies and to the ICO guidance the
controller relies on.

## UK GDPR Article 13 fulfilment matrix

UK GDPR Article 13 requires controllers who collect personal data from the
data subject to provide the items below "at the time when personal data are
obtained". The notice satisfies each item as follows:

| Art. 13 item | Where satisfied in the notice |
| --- | --- |
| 13(1)(a) identity and contact details of the controller | "Practice contact" block in the printable notice. |
| 13(1)(a) DPO contact details | "Data Protection Officer" block. |
| 13(1)(c) purposes and legal basis for processing | "Why we hold information about you" section, citing Art. 6(1)(e) and Art. 9(2)(h). |
| 13(1)(e) recipients or categories of recipient | "Who we share information with" section. |
| 13(2)(a) storage period | "How long we keep information" section, referencing the NHS Records Management Code. |
| 13(2)(b) data-subject rights | "Your rights" section listing access, rectification, erasure (limited), restriction, objection. |
| 13(2)(d) right to lodge a complaint with the ICO | "How to complain" section linking to ico.org.uk. |
| 13(2)(e) statutory or contractual requirement to provide the data | "Is the information mandatory?" section. |
| 13(2)(f) automated decision-making | Stated as "not applicable" for routine care. |

ICO Article 13 guidance:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-to-be-informed/what-information-must-be-provided-to-individuals/>

## Special-category basis (Article 9)

- Art. 9(2)(h) — provision of health or social care.
- Authorized under UK law by DPA 2018 Schedule 1 Part 1 paragraph 2 —
  <https://www.legislation.gov.uk/ukpga/2018/12/schedule/1>
- The controller therefore relies on an Appropriate Policy Document (APD)
  per DPA 2018 Schedule 1 paragraphs 38–40. The APD is held separately by
  the practice's Information Governance Lead.

## Common-law duty of confidentiality

The notice articulates that NHS data is shared **for direct care** under
the implied authority of the patient as recognized by the NHS
Confidentiality Code of Practice. Sharing for other purposes (research,
planning, screening) is the subject of separate notices in this monorepo
(`research-and-planning-privacy-notice`, `screening-program-privacy-notice`)
and may also rely on an NHS Act 2006 s.251 approval where applicable.

## Acknowledgment audit fields

| Field | Audit purpose |
| --- | --- |
| `confirmed` (checkbox) | Evidences that the patient was given the opportunity to read the notice. |
| `full_name` | Identifies the data subject who acknowledged. |
| `acknowledged_date` | Establishes the date from which the patient was informed (Art. 13 timing). |

Note: this acknowledgment is **not** consent under Art. 6(1)(a) or
Art. 9(2)(a). The lawful basis remains Art. 6(1)(e) / Art. 9(2)(h).

## Information for users (ISO/IEC/IEEE 26514:2022)

Section content is structured to meet ISO/IEC/IEEE 26514:2022 §7 (content
design):

- Plain-English headings (per ICO's "Right to be informed" plain-language
  guidance).
- Short paragraphs and explicit examples for each data-sharing recipient.
- Linked references to the named regulators (ICO, NHS England).

Standard: <https://www.iso.org/standard/77451.html>
