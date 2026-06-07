# Audit Trail Rules

The Care Privacy Notice produces an acknowledgment record. This document
specifies how the record is retained, when it must be re-issued, and how
the controller demonstrates compliance with UK GDPR Article 5(2)
accountability.

## Retention period

The acknowledgment record is part of the patient's GP record and is
retained per the NHS Records Management Code of Practice 2021, which sets
the retention period for the GP electronic patient record at the lifetime
of the patient plus 10 years:

- NHS England — Records Management Code of Practice:
  <https://www.nhsx.nhs.uk/information-governance/guidance/records-management-code/>

## Re-issue triggers

The controller must re-issue the notice (and require a new acknowledgment)
when one of the following events occurs:

| Trigger | Why |
| --- | --- |
| The controller's identity changes (e.g. practice merger, list dispersal) | Art. 13(1)(a) identity changed |
| New category of recipient added | Art. 13(1)(e) recipients changed |
| Purpose of processing changes materially | Art. 13(1)(c) purpose changed |
| Statutory basis cited in the notice is amended | Art. 13(1)(c) basis changed |
| The patient registers with the practice for the first time | Art. 13 trigger event |

The form's `practice_config` block carries an integer version number; the
engine surfaces a `flag_acknowledgment_outdated` issue on the dashboard
when the patient's acknowledgment version differs from the current notice
version.

## Demonstrating accountability (Art. 5(2))

Article 5(2) UK GDPR requires the controller to demonstrate compliance
with the data-protection principles. The form contributes the following
artefacts to that evidence base:

- The acknowledgment record (patient identity, version of notice, date).
- The notice text itself, versioned in the practice's document management
  system.
- An export of the dashboard showing acknowledgment coverage across the
  patient list — the practice's Caldicott Guardian uses this for the
  annual Data Security and Protection Toolkit return.

NHS Data Security and Protection Toolkit:
<https://www.dsptoolkit.nhs.uk/>

## Disclosure to the data subject

A patient is entitled under Article 15 UK GDPR to access their personal
data, which includes the acknowledgment record. The form's `patient`
table indexes by NHS number so a Subject Access Request can be fulfilled
without searching free-text.

ICO Subject Access guidance:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/>

## Sensitive defaults

The acknowledgment record is **not** itself special-category data, but it
sits within the patient record and therefore inherits the access controls
applied to the wider record. The practice's Role-Based Access Control
(RBAC) must permit:

- Read by the patient's registered GP and practice staff (legitimate
  relationship).
- Read by the practice's Information Governance Lead and Caldicott
  Guardian for compliance auditing.

No external recipient — including NHS England, CQC, or research bodies —
should be granted access to the acknowledgment record itself.
