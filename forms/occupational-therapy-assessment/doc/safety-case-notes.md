# Safety Case Notes — Occupational Therapy Assessment

## Regulatory framework

- DCB 0129 / DCB 0160.
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- MDCG 2019-11 Rev.1.
  https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en
- UK Medical Devices Regulations 2002.
- UK MHRA *Software and AI as a Medical Device*.
- ISO/IEC/IEEE 26514:2022.

## Device classification position

The form records client-rated COPM performance and satisfaction and
averages them deterministically per the COPM manual. The intervention
plan (step 10) is a clinical judgment; the device is decision support.
Under MDCG 2019-11 the device is software providing information used in
management of functioning.

## Hazards and mitigations

| Hazard | Mitigation |
| --- | --- |
| Patient lacks capacity to rate COPM problems | Step 2 captures capacity status; proxy mode allowed and recorded |
| COPM problems mis-prioritised | Therapist confirms top-5 with client; the form records all elicited problems plus the prioritised top-5 |
| Cultural misinterpretation of leisure / productivity categories | Step 5 leisure category is open to client's framing; therapist records cultural context where relevant |
| Safety risk identified during home visit | Step 8 environmental section captures urgent hazards (no working alarms, trip hazards, unsafe heating); urgent items trigger immediate-action prompt |
| Safeguarding concern (adult or child) | Therapist obligation under the Care Act 2014 to raise a safeguarding alert; the form has a safeguarding-flag field that is also written to the local safeguarding log when set |
| Capacity decline between assessments | Repeat assessment cadence recorded; comparison to prior COPM held in the record |
| Equipment recommended but not provided | Step 10 records recommendation, responsible service, and expected date |
| Patient-identifying photographs | Step 8 photos require explicit consent and are stored encrypted within DSPT-compliant boundary |

## Information governance

- UK GDPR / DPA 2018.
- NHS DSPT compliance.
- COPM responses contain sensitive information about daily-living
  difficulties; access restricted to the treating team and authorised
  carers.

## Licensing

COPM is copyrighted by Mary Law et al. and distributed by CAOT
Publications ACE. Sites using this form must hold a valid COPM licence
(per https://www.thecopm.ca/). The form's PDF report includes the
attribution required by the COPM manual.

## Audit and traceability

- All client and therapist ratings are timestamped and attributed.
- Score, category, and goals stored alongside the raw responses.
- Reassessment cadence captured at the form level.

## Vulnerable groups

- Children: paediatric pathway uses Perceived Efficacy and Goal Setting
  System (PEGS) as an analogue (referenced, not embedded).
- People with learning disabilities: visual-analogue rating supported in
  step 6 / 7.
