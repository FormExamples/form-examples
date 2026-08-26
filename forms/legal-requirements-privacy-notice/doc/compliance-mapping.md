# Compliance Mapping

This document maps each clause of the Legal Requirements Privacy Notice to
the statute and ICO guidance that authorizes the underlying processing,
and shows how the form's acknowledgment record evidences the controller's
UK GDPR Article 13 transparency duty.

## Statutory mapping per recipient

| Recipient | Authorizing instrument | UK GDPR Art. 6 basis | UK GDPR Art. 9 basis |
| --- | --- | --- | --- |
| NHS England (data flows under Secretary of State Directions) | Health and Social Care Act 2012 s.254 / s.259 | 6(1)(c) legal obligation | 9(2)(h) provision of health care |
| Care Quality Commission (regulator inspection data) | Health and Social Care Act 2008, s.62–s.65; Care Quality Commission (Registration) Regulations 2009 (SI 2009/3112) | 6(1)(c) legal obligation | 9(2)(h) provision of health care |
| UK Health Security Agency (notifiable disease) | Public Health (Control of Disease) Act 1984; Health Protection (Notification) Regulations 2010 (SI 2010/659) | 6(1)(c) legal obligation | 9(2)(i) public interest in public health |
| HM Coroner (death notification) | Coroners and Justice Act 2009, ss.1–7 | 6(1)(c) legal obligation | 9(2)(g) substantial public interest under DPA 2018 Schedule 1 Part 2 |
| Court order (specific legal proceedings) | Civil Procedure Rules / Criminal Procedure Rules disclosure orders | 6(1)(c) legal obligation | 9(2)(f) legal claims |

## UK GDPR Article 13 fulfilment matrix

| Art. 13 item | Where satisfied in the notice |
| --- | --- |
| 13(1)(a) controller identity & contact | "Who we are" block. |
| 13(1)(a) DPO contact | "Data Protection Officer" block. |
| 13(1)(c) purposes and legal basis | "Why we share information" lists each statutory recipient with the citing instrument. |
| 13(1)(e) recipients | Each recipient is explicitly named with a link to its own privacy notice. |
| 13(1)(f) international transfers | "Transfers outside the UK" — none for these flows. |
| 13(2)(a) retention | "How long we keep information" cross-references the NHS Records Management Code. |
| 13(2)(b) data-subject rights | "Your rights" — access, rectification, restriction, objection. Note: right to erasure and right to object do **not** apply where processing is on a legal basis (Art. 17(3)(b), Art. 21(1)). |
| 13(2)(d) right to complain to the ICO | "How to complain" links to ico.org.uk. |
| 13(2)(e) whether provision of data is statutory | The notice states each flow is **statutory** and the patient cannot opt out. |
| 13(2)(f) automated decision-making | Stated as not applicable. |

## Rights interaction

Where the lawful basis is Article 6(1)(c) (legal obligation), the
following Article-22-relevant rights are restricted:

| Right | Status under legal-obligation basis |
| --- | --- |
| Erasure (Art. 17) | Not applicable — Art. 17(3)(b) carve-out. |
| Restriction (Art. 18) | Limited applicability. |
| Objection (Art. 21) | Not applicable. |
| Data portability (Art. 20) | Not applicable (portability only applies to Art. 6(1)(a) or 6(1)(b)). |
| Access (Art. 15), Rectification (Art. 16) | Apply. |

ICO guidance on right to erasure under legal-obligation basis:
<https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-erasure/>

## Acknowledgment fields

| Field | Audit purpose |
| --- | --- |
| `confirmed` | Evidences the patient was given the opportunity to read the notice. |
| `full_name` | Identifies the data subject for the audit. |
| `acknowledged_date` | Fixes the Art. 13 timing point. |

These fields do **not** constitute consent under Art. 6(1)(a). The lawful
basis is and remains Art. 6(1)(c).

## NHS Data Security and Protection Toolkit

The acknowledgment record forms part of the practice's evidence for the
annual Data Security and Protection Toolkit submission:

<https://www.dsptoolkit.nhs.uk/>
