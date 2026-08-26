# Safety-case notes — DVLA M1 implementation

The M1 form replicates a paper questionnaire issued by the DVLA Drivers
Medical Group. The implementation is a structured data-capture tool, not a
medical device that makes a fitness-to-drive determination.

## Intended use

- Collect a structured psychiatric and behavioural history equivalent to
  the paper DVLA M1 questionnaire.
- Produce a clinician-readable summary aligned with the DVLA "Assessing
  fitness to drive" guide chapters on psychiatric disorders and substance
  misuse.
- Persist the dataset for transmission to DVLA Drivers Medical Group.

It is **not** intended to make automated licensing decisions or to replace
the DVLA Medical Adviser review.

## Regulatory classification

Under MDCG 2019-11 Rev.1 (EU MDR) and UK Medical Devices Regulations 2002
(SI 2002/618):

- Faithful data-capture of an authority questionnaire, with no scoring
  engine producing a clinical recommendation, generally falls outside the
  medical-device definition.
- Adding interpretive logic (e.g. automatic "may not drive" verdict) would
  push the system into IVDR / MDR scope, at minimum Class IIa under MDR
  Rule 11.

This implementation deliberately stays on the data-capture side. Any
"flagged issues" output records statements made by the respondent against
guide chapters; it does not produce a fitness verdict.

## Special-category data handling

Mental-health responses are Article 9 UK GDPR "special category" data and
must be processed with controls equivalent to NHS clinical records:

- TLS 1.2+ in transit; at-rest encryption (AES-256 or hardware equivalent).
- Role-based access control with least-privilege and audit logging.
- Retention aligned with DVLA Drivers Medical Group's retention schedule
  and the NHS Records Management Code of Practice (2023).
  <https://transform.england.nhs.uk/information-governance/guidance/records-management-code/>

## Hazard log (selection)

1. **Suicidality not surfaced to a clinician** — questionnaire includes
   explicit prompts for current suicidal ideation; submission cannot
   complete without the clinician acknowledging high-risk flags.
2. **Substance-use mis-classification** — controlled vocabularies (DM+D /
   SNOMED CT UK Drug Extension) used for medication and drug names.
3. **Identity confusion** — driver number (DVLA format) plus NHS number
   plus date of birth captured.
4. **Stigmatizing language in reports** — generated report uses neutral,
   guide-aligned wording (e.g. "persistent alcohol misuse" not "alcoholic").

## Governance references

- UK MHRA — Software and AI as a medical device:
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- DCB0129 / DCB0160 NHS clinical safety standards:
  <https://digital.nhs.uk/services/clinical-safety>
- ISO 14971:2019 — Risk management for medical devices.

## Out of scope

- Automated diagnosis or treatment recommendations.
- Direct integration with police PNC / alcohol-conviction records (these
  flow to DVLA via a separate statutory channel).
