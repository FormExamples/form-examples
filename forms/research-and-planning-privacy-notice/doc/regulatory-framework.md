# Regulatory Framework

The Research and Planning Privacy Notice covers the use of patient personal
data for two purposes that fall **outside** direct care: medical research,
and planning / commissioning of NHS services (including national clinical
audits). The notice satisfies UK GDPR Article 13 transparency and records
the patient's National Data Opt-Out preference.

## Primary instruments

- **UK GDPR** Articles 6, 9, 13, 21, 89 — research and statistical
  purposes safeguards:
  <https://www.legislation.gov.uk/eur/2016/679/contents>
- **Data Protection Act 2018** (c. 12), Part 2 Chapter 2 and Schedule 1
  Part 1 paragraphs 3 and 4 (research safeguards) —
  <https://www.legislation.gov.uk/ukpga/2018/12/schedule/1>
- **NHS Act 2006** s.251 — statutory mechanism to set aside the common-law
  duty of confidentiality for defined research and planning purposes —
  <https://www.legislation.gov.uk/ukpga/2006/41/section/251>
- **Health and Social Care Act 2012** ss.254, 259 — Secretary of State
  Directions for data flows to NHS England —
  <https://www.legislation.gov.uk/ukpga/2012/7/contents>

## Lawful basis articulation

For NHS research and planning, the canonical bases are:

- UK GDPR Article 6(1)(e) — task carried out in the public interest.
- UK GDPR Article 9(2)(j) — processing necessary for archiving, scientific
  or historical research, or statistical purposes, in accordance with
  Article 89(1) and authorized by UK law.
- UK GDPR Article 9(2)(h) — provision of health care, where the planning
  flow is necessary to commission or audit a service.

Reference: DPA 2018 Schedule 1 Part 1 paragraphs 3 (statutory etc and
government purposes) and 4 (research, statistics etc).

## Common-law duty and s.251 support

The common-law duty of confidentiality cannot be discharged by UK GDPR
alone. For non-anonymized research and planning flows, the controller
typically relies on:

- Explicit patient consent under the Common Law (and Article 6(1)(a) /
  9(2)(a)), or
- An NHS Act 2006 s.251 approval from the Confidentiality Advisory Group
  setting aside the duty for the specified purpose. The CAG register is
  public:
  <https://www.hra.nhs.uk/approvals-amendments/what-approvals-do-i-need/confidentiality-advisory-group/>

## National Data Opt-Out

The National Data Opt-Out (Type 1, since superseded, and the National Data
Opt-Out itself) allows patients to opt out of the use of their
confidential patient information for research and planning purposes
beyond their direct care.

- NHS England — National Data Opt-Out:
  <https://digital.nhs.uk/services/national-data-opt-out>
- NHS England — National Data Opt-Out operational policy:
  <https://digital.nhs.uk/services/national-data-opt-out/operational-policy-guidance-document>

Where the patient has opted out, the controller must suppress the
patient's data from the relevant flow unless an exemption applies (for
example, statutory disclosure under another instrument, or anonymization
to the standard of the ICO anonymization code).

## Patient choice in this form

The form captures three patient signals:

| Signal | Effect |
| --- | --- |
| Acknowledgment checkbox | Confirms Article 13 transparency duty satisfied |
| Opt-out preference | Records the patient's National Data Opt-Out election (Type 2 / national) |
| Full name + date | Audit trail |

The opt-out preference is propagated to the practice's Type 2 / national
opt-out register; the form does not itself implement suppression in
downstream flows.

## Anonymization

Where data can be effectively anonymized to the standard of the ICO
Anonymization Code, the resulting dataset falls outside UK GDPR and the
patient's opt-out is not engaged. The form's dashboard does not anonymize;
the controller must apply the code separately.

ICO Anonymization, pseudonymization and privacy enhancing technologies
guidance:
<https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/anonymization-pseudonymization-and-privacy-enhancing-technologies/>

## Professional and ethical context

- NHS Confidentiality Code of Practice (2003) — archived:
  <https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.dh.gov.uk/en/Publicationsandstatistics/Publications/PublicationsPolicyAndGuidance/DH_4069253>
- HRA / NHS Research Ethics Committee approvals:
  <https://www.hra.nhs.uk/>
- GMC *Confidentiality* (2017), paragraphs 92–110 on disclosures for
  research:
  <https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/confidentiality>
