# Safety Case Notes — Fall Risk Assessment

## Regulatory framework

- DCB 0129 / DCB 0160.
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- MDCG 2019-11 Rev.1.
  https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en
- UK Medical Devices Regulations 2002.
- UK MHRA *Software and AI as a Medical Device*.
  https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device
- ISO/IEC/IEEE 26514:2022.

## Device classification position

The form computes the MFS total deterministically from clinician input
and maps to risk bands published by Morse. The clinical decision to
implement a prevention plan remains with the clinician. Under MDCG
2019-11 the device is software intended to provide information used in
diagnosis or management.

## Hazards and mitigations

| Hazard | Mitigation |
| --- | --- |
| Under-grading fall risk in inpatient setting | MFS scoring is deterministic; "high" band triggers mandatory CG161 multifactorial assessment prompt |
| Missed anticoagulant + fall combination | Step 5 records anticoagulants; any anticoagulant + history of falls escalates to "critical" |
| Missed cognitive impairment | Step 8 cognitive screen is mandatory at MFS ≥ 25 |
| Missed vision impairment | Step 6 vision screen is mandatory at MFS ≥ 25 or age ≥ 65 |
| Home hazards not addressed | Step 7 home-environment domain mandatory for community patients; HOME FAST items recorded |
| Prevention plan absent | Step 10 mandatory before save; "high"-band patients require named lead and follow-up date |
| Falls without injury under-reported | Step 2 prompts for both injurious and non-injurious falls in the last 12 months |
| Patient unable to self-report | Form supports proxy completion by carer / family; mode recorded in metadata |

## Recurrent-fall escalation

If recurrent falls with injury are recorded, the form:

- Forces composite to "critical"
- Prompts the clinician to consider syncope work-up (NICE TA29 / NG136
  *Hypertension* not directly applicable but referenced for orthostatic
  hypotension)
- Signposts the NICE CG161 multifactorial intervention pathway

## Information governance

- UK GDPR / DPA 2018.
- NHS DSPT compliance.
- Patient-identifiable data restricted to treating team; carer access is
  consent-based.

## Audit and traceability

- Every assessment is timestamped and attributed.
- Computed MFS and clinician-confirmed prevention plan stored side by side.
- Reassessment cadence is captured at the form level (admission, weekly,
  after-fall, change in clinical condition).

## Patient and carer involvement

- Carer / family contribution is recorded where the patient has cognitive
  impairment.
- Patient's stated falls fear (e.g., FES-I score) can be added in free
  text where the validated instrument is licensed separately.
