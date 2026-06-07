# Safety Case Notes — Mobility Assessment

## Regulatory framework

- DCB 0129 / DCB 0160.
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- MDCG 2019-11 Rev.1.
  https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en
- UK Medical Devices Regulations 2002.
- UK MHRA *Software and AI as a Medical Device*.
- ISO/IEC/IEEE 26514:2022.

## Device classification position

The form computes the POMA combined score deterministically and maps it
to the published Tinetti risk bands. The clinical decision to act
(referral to physiotherapy, falls clinic, change of aid) remains with the
clinician. Under MDCG 2019-11 the device is software for information used
in management of mobility impairment and fall risk.

## Hazards and mitigations

| Hazard | Mitigation |
| --- | --- |
| Patient injured during assessment | Assessor pre-check (step 2) includes safe-to-assess flag; if unsafe, partial assessment allowed with explicit "unsafe to assess" outcome |
| TUG performed without adequate space / aid | Step 6 records space available and aid used; deviations flagged |
| Under-grading mobility risk due to "best-effort" misinterpretation | Tinetti scoring is deterministic per the published rubric; the form prompts the assessor to score the typical performance, not the best performance, per Tinetti 1986 |
| Missed cardiovascular cause of falls | Step 3 fall history captures syncope features; flag triggers cardiology referral prompt |
| Anticoagulant + high fall risk | Step 9 captures anticoagulants; combination raises composite to critical and prompts shared decision making on continuation |
| Cognitive impairment compromising self-report | Step 2 captures cognitive status; below threshold triggers proxy / observed assessment mode |
| Wrong patient or wrong-side measurement | Step 1 enforces identifier cross-check; laterality captured for ROM |

## Reassessment cadence

- Inpatient: on admission, weekly, after any fall, after any change in
  mobility status.
- Community: on referral, after intervention milestones, after any fall.

## Information governance

- UK GDPR / DPA 2018.
- NHS DSPT compliance.
- Patient-identifiable data restricted to treating team.

## Assistive devices

- Step 8 records aid type, prescriber, and date.
- Wrong-size or poorly maintained aid is itself a fall risk; the form
  prompts the assessor to record condition and fit.

## Audit and traceability

- Every score is timestamped and attributed.
- Computed POMA, TUG, and Barthel stored alongside clinician-confirmed
  category.
- PDF report shows score breakdown, category, and recommended actions.
