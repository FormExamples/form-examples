# Compliance Mapping

The twelve principles in the Code of Conduct Notice mirror the substantive
duties imposed by GMC *Good Medical Practice* (2024), the NHS
Constitution, the NMC Code, and adjacent professional codes. This document
maps each principle to its authoritative source so the controller can
demonstrate that the local restatement is consistent with the regulatory
baseline.

## Principle ↔ source mapping

The actual twelve principles are defined per provider in the
practice-customisable notice block; the canonical mappings below cover the
twelve-principle structure used in the monorepo's reference notice.

| # | Principle | GMC *Good Medical Practice* (2024) | NHS Constitution | Statutory hook |
| --- | --- | --- | --- | --- |
| 1 | Put patient interests first | Domain 1 (Knowledge, skills and development) and Domain 2 (Patients, partnership and communication) | "Patients first" value | NHS Act 2006 s.1 (duty) |
| 2 | Respect dignity and autonomy | Domain 2 | "Respect" value | Equality Act 2010 |
| 3 | Provide good clinical care | Domain 1 | "High quality care" pledge | NHS Standard Contract |
| 4 | Keep up-to-date | Domain 1 — continuing professional development | "Improving lives" pledge | Revalidation Regulations 2012 |
| 5 | Work in teams | Domain 3 (Colleagues, culture and safety) | "Working together" value | NHS Constitution |
| 6 | Be honest and act with integrity | Domain 4 (Trust and professionalism) | "Everyone counts" value | Fitness to Practise rules |
| 7 | Respect confidentiality | Domain 2 (privacy & confidentiality) | NHS Code of Practice | UK GDPR; common-law duty |
| 8 | Obtain informed consent | Domain 2 | NHS Constitution | *Montgomery* [2015] UKSC 11; MCA 2005 |
| 9 | Safeguard vulnerable persons | Domain 3 (safety) | NHS Constitution | Care Act 2014; Children Act 1989/2004 |
| 10 | Speak up about safety concerns | Domain 3 (raise concerns) | Freedom to Speak Up | Public Interest Disclosure Act 1998 |
| 11 | Treat colleagues with respect | Domain 3 (workplace culture) | "Respect" value | Equality Act 2010 |
| 12 | Promote equality and inclusion | Domain 2 (responsive to patients) | "Everyone counts" value | Equality Act 2010 |

## Statutory references

- GMC *Good Medical Practice* (2024) —
  <https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/good-medical-practice>
- NHS Constitution —
  <https://www.gov.uk/government/publications/the-nhs-constitution-for-england>
- Equality Act 2010 —
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- Care Act 2014 —
  <https://www.legislation.gov.uk/ukpga/2014/23/contents>
- Children Act 2004 —
  <https://www.legislation.gov.uk/ukpga/2004/31/contents>
- Public Interest Disclosure Act 1998 —
  <https://www.legislation.gov.uk/ukpga/1998/23/contents>
- Mental Capacity Act 2005 —
  <https://www.legislation.gov.uk/ukpga/2005/9/contents>

## Acknowledgment fields ↔ audit role

| Field | Audit purpose |
| --- | --- |
| `confirmed` | Evidences staff member has read the notice |
| `full_name` | Identifies the acknowledging staff member |
| `acknowledged_date` | Fixes the date from which compliance is expected |

The acknowledgment is **not** a contract amendment; it is an evidence
artefact that the staff member has been informed. The employer's
contractual right to require compliance arises from the employment
contract, not from the acknowledgment.

## Information governance

- Lawful basis for storage of the acknowledgment: UK GDPR Art. 6(1)(b)
  (contract performance) and Art. 6(1)(c) (legal obligation).
- Retention: per the NHS Records Management Code of Practice 2021,
  HR records are typically retained for 6 years after the staff member
  leaves employment (or longer under specific statutory schedules).

NHS England Records Management Code:
<https://www.nhsx.nhs.uk/information-governance/guidance/records-management-code/>

## ISO/IEC/IEEE 26514:2022

The notice is structured per the standard's §7 content design rules with
plain-English principle statements and explicit cross-references to each
authoritative source.
