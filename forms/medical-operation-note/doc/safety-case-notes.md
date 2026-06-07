# Safety Case Notes — Operation Note

## Regulatory framework

- DCB 0129 / DCB 0160 (NHS Clinical Risk Management Standards).
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- MDCG 2019-11 Rev.1 *Qualification and classification of software*.
  https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en
- UK Medical Devices Regulations 2002. https://www.legislation.gov.uk/uksi/2002/618/contents
- UK MHRA *Software and AI as a Medical Device*.
  https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device
- ISO/IEC/IEEE 26514:2022.

## Device classification position

The operation note is a structured clinical record with grading derived
from the operating team's findings. Grading is decision support: the
clinician retains the final say on the recorded grade. Under MDCG 2019-11
the device is software intended to provide information for diagnosis or
management of disease, with a clinician as actor of record.

## Hazards and mitigations

| Hazard | Mitigation |
| --- | --- |
| Wrong-patient note | Step 1 captures patient identifiers cross-referenced to the wristband / theatre list; mandatory before saving |
| Wrong-procedure recorded | Step 2 captures planned procedure and actual procedure separately; mismatch fires a safety flag |
| Retained foreign body | Step 4 records swab/needle/instrument counts; discrepancy is a hard-block on signing the note until reconciled |
| Incorrect specimen labelling | Step 7 records specimen list with destination; mismatch with theatre log fires a flag |
| Missed never event | Step 9 has explicit never-event suspicion checkbox; if set, composite is forced to Critical |
| Anaesthetic event under-reported | Step 5 captures anaesthetic incidents separately; free text plus structured event type |
| Late identification of intra-op complication | Step 9 dedicated Clavien–Dindo capture; any grade ≥ IIIa fires a flag |
| Inadequate handover | Step 10 forces structured post-op instructions (analgesia, observations, escalation thresholds, antibiotics, VTE prophylaxis) |
| Counterfeit or wrong implant | Step 7 records implant serial / batch / manufacturer; printed barcode-scannable in PDF |

## Legal record

UK case law and GMC *Good Medical Practice* require contemporaneous,
legible, dated, signed records. The form enforces:

- Timestamping on save and on signature.
- Author attribution for every field.
- Append-only audit trail; corrections are addenda, not edits.
- PDF rendering preserves the as-signed state.

GMC *Good Medical Practice* (2024 edition):
https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/good-medical-practice

## Information governance

- UK GDPR / Data Protection Act 2018.
- NHS DSPT (Data Security and Protection Toolkit).
- The op note contains identifiable patient data and is restricted to the
  treating team plus auditors.

## Never-event reporting

If a never-event flag is set, the form prompts to also raise a Datix /
incident report. The Datix is filed independently in the Trust's incident
system; this form provides the immediate flag, not the formal report.
