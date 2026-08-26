# Compliance Mapping

This document maps each clause of the Research and Planning Privacy Notice
to the UK GDPR / DPA 2018 / NHS-Act 2006 instrument that authorizes the
processing, and shows how the form's signals (acknowledgment + opt-out)
are recorded for audit.

## Article 13 fulfilment matrix

| Art. 13 item | Where satisfied in the notice |
| --- | --- |
| 13(1)(a) controller identity & contact | "Who we are" block |
| 13(1)(a) DPO contact | "Data Protection Officer" block |
| 13(1)(c) purposes and legal basis | "What we use your information for" lists research and planning purposes with citations to Art. 6(1)(e), Art. 9(2)(j), and Art. 9(2)(h) |
| 13(1)(e) recipients | Each research / planning recipient is named (NHS England, NIHR, named CAG-approved studies) |
| 13(1)(f) international transfers | Stated; reliance on adequacy decisions or Standard Contractual Clauses |
| 13(2)(a) retention | Cross-references NHS Records Management Code |
| 13(2)(b) rights | Access, rectification, restriction, objection (Art. 21), portability not applicable |
| 13(2)(d) complaint to ICO | "How to complain" links to ico.org.uk |
| 13(2)(e) statutory or contractual nature | Optional; non-consent flows rely on s.251 approval or anonymization |
| 13(2)(f) automated decision-making | Stated as not applicable |

## Per-flow mapping

| Flow | UK GDPR Art. 6 basis | UK GDPR Art. 9 basis | Common-law support | Opt-out applicable? |
| --- | --- | --- | --- | --- |
| National clinical audit (e.g. National Diabetes Audit) | 6(1)(e) | 9(2)(h) | s.251 CAG approval | Yes |
| Service-planning (commissioning, ICB analytics) | 6(1)(e) | 9(2)(h) | s.251 CAG approval | Yes |
| Approved research (HRA + CAG approval) | 6(1)(e) | 9(2)(j) | s.251 CAG approval | Yes |
| Consented research | 6(1)(a) | 9(2)(a) | patient consent | Patient consent overrides |
| Anonymized statistics | Outside UK GDPR | n/a | Anonymization Code | No (data is not personal) |

## Form fields ↔ audit role

| Field | Audit purpose |
| --- | --- |
| `confirmed` | Evidences Art. 13 transparency duty satisfied |
| `opt_out_preference` (`opt-in` / `opt-out` / `unspecified`) | Records the patient's National Data Opt-Out election |
| `full_name` | Identifies the data subject |
| `acknowledged_date` | Fixes the Art. 13 timing and opt-out election date |

## Rights interaction (research basis)

Article 89 UK GDPR authorizes Member State law to derogate from certain
data-subject rights where personal data is processed for scientific
research. DPA 2018 Schedule 2 Part 6 paragraph 27 implements this and
provides:

- Article 21 (objection) does not apply where exercising it would
  seriously impair the achievement of the research objective and the
  processing is necessary for an archiving / research / statistical purpose.
- Article 15 (access) is restricted where likewise.

ICO research provisions:
<https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/data-protection-and-research-information/>

## NHS Data Opt-Out compliance

The form records the patient's opt-out election. NHS England requires the
controller to suppress data from flows in scope of the National Data Opt-
Out within a defined operational window. The form does **not** itself
suppress data: it is the controller's responsibility to propagate the
election to the National Data Opt-Out service and to downstream extracts.

Operational policy:
<https://digital.nhs.uk/services/national-data-opt-out/operational-policy-guidance-document>

## Information for users

The notice is structured to meet ISO/IEC/IEEE 26514:2022 §7 content design,
with plain-English headings, explicit examples of recipient bodies, and
linked references to each authoritative instrument.

Standard:
<https://www.iso.org/standard/77451.html>
