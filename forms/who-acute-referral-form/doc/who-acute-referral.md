# WHO Acute Referral Form

This form implements the WHO standardized acute referral form for
transferring patients between healthcare facilities — typically from a
lower-tier facility (rural health centre, district hospital) to a
higher-tier facility (referral hospital, tertiary centre).

## Authoritative WHO sources

- **Form PDF** — WHO. *Acute Referral Form*.
  <https://cdn.who.int/media/docs/default-source/integrated-health-services-(ihs)/csy/ect/acute-referral-form.pdf>
- **Emergency Care Toolkit** —
  <https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care>
- **WHO Basic Emergency Care (BEC).** Geneva: WHO; 2018.
  ISBN 978-92-4-151308-1.
  <https://www.who.int/publications/i/item/basic-emergency-care-approach-to-the-acutely-ill-and-injured>
- **WHO Integrated Management of Adolescent and Adult Illness (IMAI)**
  — referral framework.
  <https://www.who.int/publications/i/item/9789241544016>

## SBAR communication framework

The form structure follows **SBAR** — Situation, Background, Assessment,
Recommendations — which is the WHO-endorsed handover communication
framework.

| SBAR | Form section |
| --- | --- |
| **S**ituation | Chief complaint, primary diagnosis, pregnancy, other diagnoses, treatments initiated |
| **B**ackground | History of present illness, past medical / surgical history, ABCDE assessment |
| **A**ssessment | Clinical assessment, current vital signs, why referral is needed |
| **R**ecommendations | Treatment plan during transport, anticipated problems, precautions |

SBAR was developed by the US Navy and adopted into healthcare by Kaiser
Permanente in the early 2000s. WHO has incorporated it into the *High 5s*
patient-safety initiative and the *Multi-professional Patient Safety
Curriculum Guide* (2011).

References:
- Haig KM, Sutton S, Whittington J. SBAR: a shared mental model for
  improving communication between clinicians. *Jt Comm J Qual Patient
  Saf.* 2006;32(3):167-75. PMID: 16617948.
- WHO. *Patient safety curriculum guide: multi-professional edition*.
  Geneva: WHO; 2011. ISBN 978-92-4-150195-8.
  <https://www.who.int/publications/i/item/9789241501958>

## Two-party completion

The form is split into sections completed by the **initiating facility**
(referring the patient) and the **referral facility** (receiving the
patient).

### Initiating facility completes

- Patient identification
- Initiating facility identification and contact details
- Reason for referral
- Referral facility contacted (checkbox)
- Referral facility identification and contact details
- Ambulance details
- Transfer decision and departure times
- Mode of transfer (ground / air / sea)
- Situation, Background, Assessment, Recommendations
- Provider name and signature

### Referral facility completes

- Arrival time
- Receiving provider name
- Feedback checkbox confirming receipt and discussion

This two-party signoff creates an audit trail that the WHO IMAI referral
chain has been completed end-to-end.

## ABCDE assessment

The Background section captures an ABCDE summary that the initiating
facility verifies and the receiving facility relies on for handover
preparation. Each row has a Finding and an Intervention:

| Letter | Typical finding | Typical intervention |
| --- | --- | --- |
| A | Airway maintained / threatened | Repositioning, OPA, NPA, LMA, ETT |
| B | Breathing rate, oxygen requirement | O2 nasal / mask / NRB / BVM |
| C | Pulse, BP, capillary refill, bleeding | IV access, fluids, blood, TXA |
| D | AVPU/GCS, blood glucose | Glucose, antiepileptic, naloxone |
| E | Exposure, hypothermia, full inspection | Blankets, warmed fluids |

## Mode of transfer

Three modes captured:

- **Ground** (ambulance, public transport, private vehicle)
- **Air** (helicopter, fixed-wing)
- **Sea** (boat — common in island and coastal LMIC settings)

Each mode triggers different escort and equipment expectations. The form
captures expected duration and any anticipated transport-specific
hazards (motion sickness, hypoxia at altitude, time-to-care concerns).

## Precaution flags

Six precaution checkboxes:

- Highly infectious disease
- Spinal precautions
- Weight-bearing restrictions
- Fall risk
- Aspiration risk
- Other

These precautions are reproduced at the receiving facility's handover
briefing and entered into the receiving facility's bed-management system.

## Anticipated problems

The Recommendations section asks the initiating provider to anticipate
deterioration during transfer:

- Airway compromise risk (rising swelling, decreasing GCS).
- Haemorrhage risk (haemoglobin trend, ongoing bleeding).
- Cardiac arrest risk (significant arrhythmia, ischaemia).
- Seizure risk (eclampsia, active epilepsy).
- Hypoglycaemia risk (diabetic on insulin, sepsis).

For each, the form prompts the provider to state the management plan
during transport.

## Vital-sign trend

Current vital signs (the Assessment section) are recorded immediately
before departure so the receiving facility can compare trends and
identify deterioration during transport.

## Versioning note

The Acute Referral Form is part of the WHO Emergency Care Toolkit
Referral Forms package, first published with the BEC programme.
Implementations should record the SHA-256 of the downloaded PDF at the
time of import.

## References

- WHO. *Acute Referral Form* (PDF) — see header.
- WHO. *Basic Emergency Care*. 2018.
- WHO. *IMAI / IMAI-IMCI*.
  <https://www.who.int/publications/i/item/9789241544016>
- WHO. *Patient safety curriculum guide*. 2011. ISBN 978-92-4-150195-8.
- Haig KM, Sutton S, Whittington J. SBAR. *Jt Comm J Qual Patient Saf.*
  2006;32(3):167-75. PMID: 16617948.
- NICE NG94. *Emergency and acute medical care in over 16s: service
  delivery and organization*. 2018.
  <https://www.nice.org.uk/guidance/ng94>
