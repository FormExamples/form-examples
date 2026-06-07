# Clinical Guideline Alignment

The ophthalmology assessment records a standard clinic-room examination
and produces a visual-impairment band and a set of urgent-referral
flags. The following authoritative sources informed the field set.

## NICE guidance

| Code | Title | URL |
| --- | --- | --- |
| NG81 | Glaucoma: diagnosis and management | https://www.nice.org.uk/guidance/ng81 |
| NG82 | Cataracts in adults: management | https://www.nice.org.uk/guidance/ng77 (NG77 — cataracts) |
| NG28 | Type 2 diabetes in adults: management (retinopathy items) | https://www.nice.org.uk/guidance/ng28 |
| TA / NICE TAs | Anti-VEGF agents for wet AMD and diabetic macular oedema | https://www.nice.org.uk/guidance/conditions-and-diseases/eye-conditions |

(NG codes change over time. The parent NICE eye-conditions index is the
durable link.)

## Royal College of Ophthalmologists (RCOphth)

RCOphth publishes the UK clinical guidance for cataract surgery, glaucoma,
AMD, diabetic retinopathy, paediatric ophthalmology, and uveitis.

Index: https://www.rcophth.ac.uk/clinical-guidelines/

Key documents this assessment is compatible with:

- RCOphth Cataract Surgery Guidelines (most recent revision).
- RCOphth Diabetic Retinopathy Guidelines.
- RCOphth Glaucoma Guidelines.
- RCOphth Age-Related Macular Degeneration Guidelines.

The exact year of each document drifts; the index above is the
canonical entry point.

## American Academy of Ophthalmology (AAO)

The AAO publishes the Preferred Practice Pattern (PPP) series. Index:
https://www.aao.org/education/guidelines-browse

Examples:

- Primary Open-Angle Glaucoma PPP.
- Comprehensive Adult Medical Eye Evaluation PPP.
- Age-Related Macular Degeneration PPP.
- Diabetic Retinopathy PPP.

## NHS Diabetic Eye Screening Programme (DESP)

The English NHS DESP grades retinopathy on a 5-step scale (R0, R1, R2,
R3, M for maculopathy):

- NHS DESP guidance.
  https://www.gov.uk/topic/population-screening-programmes/diabetic-eye

The engine does not auto-grade DESP — it captures the DESP grade
verbatim from the patient's most recent screening report.

## WHO ICD-11

- WHO ICD-11 — Visual impairment, Code 9D90.
  https://icd.who.int/

## What this engine does NOT score

- We do not compute ETDRS-style detailed diabetic retinopathy grading.
- We do not compute glaucoma severity from HVF mean deviation.
- We do not compute AREDS / AREDS-2 simplified scale for AMD.
- We do not compute COMS / GMP ocular oncology staging.
- We do not produce refractive corrections or contact-lens fitting
  parameters — see the separate `eye-prescription` form.

## Carer / patient self-report caveats

Visual acuity is a clinician-measured field (Snellen chart / iCare /
auto-refractor). The engine accepts patient-reported VA only as a
"patient-reported" data source on Step 3, and the report explicitly
flags this provenance.
