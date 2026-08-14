# Safety Case Notes — Post-Operative Report

## Regulatory framework

- DCB 0129 / DCB 0160.
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- MDCG 2019-11 Rev.1.
  https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en
- UK Medical Devices Regulations 2002.
  https://www.legislation.gov.uk/uksi/2002/618/contents
- UK MHRA *Software and AI as a Medical Device*.
  https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device
- ISO/IEC/IEEE 26514:2022.

## Device classification position

The form is a structured clinical record with Clavien–Dindo grading
computed from the clinician's recorded complications. Grading is decision
support; the clinician retains the final say. Under MDCG 2019-11 the
device is software intended to provide information for management of
disease.

## Hazards and mitigations

| Hazard | Mitigation |
| --- | --- |
| Missed complication on handover | Step 9 mandates explicit complication review with Clavien–Dindo grading; PDF report includes complications section with grade for every reported event |
| Under-graded complication | Drop-down forces selection across all Clavien–Dindo grades; IIIa/IIIb distinction prompted by anaesthesia field |
| Specimen lost or unlabelled | Step 7 records each specimen with destination; mismatch with theatre log fires a flag |
| Inadequate VTE prophylaxis plan | Step 10 enforces VTE risk assessment + prophylaxis choice per NICE NG89 |
| Incorrect antibiotic prophylaxis recorded | Step 10 references NICE NG125; antibiotic, dose, timing structured |
| Missed sepsis escalation | Step 9 prompts NG51 escalation pathway when sepsis features recorded |
| Never event suspicion not escalated | Step 9 explicit checkbox; positive selection forces critical grade and Datix prompt |
| Inadequate post-op fluid plan | Step 10 references CG174 IV-fluid algorithm |
| Wrong patient identifiers | Step 1 requires patient identifier cross-check (NHS number, DOB, wristband) |

## Information governance

- UK GDPR / DPA 2018.
- NHS DSPT compliance.
- Access restricted to treating team and authorized auditors.
- Audit trail is append-only; corrections are addenda, not edits.

## Reporting integration

- Datix or equivalent local incident system is the formal route for
  never events and serious incidents. This form raises the flag and
  signposts the system; it does not file the report.
- Coroner / medical examiner notification pathway is signposted where
  Grade V (death) is recorded; see *Medical examiner system* guidance,
  https://www.england.nhs.uk/establishing-medical-examiner-system-nhs/

## Author attribution

- Each field carries author and timestamp.
- The composite Clavien–Dindo grade is stored as both computed and
  clinician-confirmed values.
- PDF rendering shows both for audit.
