# Safety-case notes — DVLA B1 implementation

This form is a screening / data-collection instrument, not an in-vehicle
medical device. It does not by itself make the licensing decision: the DVLA
Medical Adviser does. Nonetheless, errors in capture, transmission, or
classification of B1 data could contribute to a fitness-to-drive
mis-determination.

## Intended use

- Collect a structured neurological history equivalent to the paper
  DVLA B1 questionnaire.
- Produce a clinician-readable summary aligned with the DVLA "Assessing
  fitness to drive" guide.
- Persist the dataset for transmission to DVLA Drivers Medical Group.

It is **not** intended to make automated licensing decisions or to replace
the DVLA Medical Adviser review.

## Regulatory classification

Under MDCG 2019-11 Rev.1 (EU MDR) and the UK Medical Devices Regulations
2002 (SI 2002/618):

- Pure data-capture replicating an authority questionnaire, with no
  diagnosis, treatment, or scoring engine that drives a clinical decision,
  is generally not a medical device.
- Adding interpretive logic (e.g. an automated traffic-light recommendation
  per chapter) would push the system into IVDR / MDR scope, at minimum
  Class I or potentially Class IIa under MDR Rule 11.

This implementation deliberately stays on the data-capture side of that
boundary. The "flagged issues" output records statements made by the
respondent against guide chapters; it does not output a fitness verdict.

## Hazard log (selection)

1. **Under-reporting of seizure or syncope episodes** — wizard prompts
   include explicit examples; clinician confirmation step required before
   submission.
2. **Mistranscription of medication names** — controlled vocabulary tied
   to dm+d / SNOMED CT UK Drug Extension where possible.
3. **Loss of submitted record** — append-only audit log; `created_at`,
   `updated_at`, `deleted_at` on every table; soft delete only.
4. **Identity confusion** — driver number (DVLA format) plus NHS number
   plus date of birth captured and triple-checked at submission.

## Governance references

- UK MHRA — "Software and AI as a medical device":
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- DCB0129 / DCB0160 NHS clinical safety standards (apply to NHS
  deployments): <https://digital.nhs.uk/services/clinical-safety>
- ISO 14971:2019 — Application of risk management to medical devices.

## Out of scope for the safety case

- In-vehicle telematics, simulator testing, on-road assessment by
  approved driving instructors (these are managed by Driving Mobility
  centres, not by this form).
