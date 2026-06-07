# Instrument provenance — Encounter Satisfaction Score (ESS)

The Encounter Satisfaction Score (ESS) used by this form is a composite
inspired by two widely used patient-experience instruments:

- **Patient Satisfaction Questionnaire — short form (PSQ-18)** —
  developed at RAND in the early 1990s as a short form of the longer
  PSQ-III. Eighteen items across seven subscales (general satisfaction,
  technical quality, interpersonal manner, communication, financial
  aspects, time spent with doctor, accessibility/convenience), scored on
  a 5-point Likert scale.
  - Authoritative source: RAND Health Care, Patient Satisfaction
    Questionnaire from RAND Health Care.
    <https://www.rand.org/health-care/surveys_tools/psq.html>
  - Original technical report: Marshall GN, Hays RD. *The Patient
    Satisfaction Questionnaire Short-Form (PSQ-18).* RAND, 1994.
    Report no. P-7865. <https://www.rand.org/pubs/papers/P7865.html>

- **HCAHPS — Hospital Consumer Assessment of Healthcare Providers and
  Systems** — the standardised inpatient experience survey administered
  to discharged patients in the US Medicare programme, maintained by the
  Centers for Medicare & Medicaid Services (CMS) and the Agency for
  Healthcare Research and Quality (AHRQ).
  - Programme home: <https://hcahpsonline.org/>
  - CMS overview: <https://www.cms.gov/medicare/quality/initiatives/hospital-quality-initiative/hcahps-patients-perspectives-care-survey>
  - AHRQ CAHPS family: <https://www.ahrq.gov/cahps/index.html>

- **CG-CAHPS — Clinician & Group CAHPS** — the AHRQ outpatient
  counterpart of HCAHPS, surveying patient experience of primary and
  specialty care visits.
  - CG-CAHPS home: <https://www.ahrq.gov/cahps/surveys-guidance/cg/index.html>

## Domain mapping

| ESS domain (this form)        | Closest PSQ-18 / HCAHPS / CG-CAHPS analogue |
| ----------------------------- | ------------------------------------------- |
| Access & Scheduling           | PSQ-18 *Accessibility/Convenience*; CG-CAHPS *Getting timely appointments, care, and information* |
| Communication                 | PSQ-18 *Communication*; HCAHPS *Communication with Doctors / Nurses*; CG-CAHPS *How well providers communicate with patients* |
| Staff & Professionalism       | PSQ-18 *Interpersonal Manner*; HCAHPS *Courtesy and respect* items |
| Care Quality                  | PSQ-18 *Technical Quality*; HCAHPS *Overall hospital rating* (Q21) |
| Environment                   | HCAHPS *Cleanliness of hospital environment*, *Quietness of hospital environment* |
| Overall Satisfaction          | PSQ-18 *General Satisfaction*; HCAHPS *Recommend this hospital* (Q22) |

## Notes on the 5-point Likert scoring

HCAHPS uses a *frequency* scale ("Never / Sometimes / Usually /
Always") for most items rather than a satisfaction scale, and a 0–10
*Overall hospital rating* item. PSQ-18 uses a 5-point *agreement* scale.
The ESS in this form simplifies both into a 5-point *satisfaction*
scale; this is a documented divergence from the original instruments
and means ESS scores are not directly comparable to published HCAHPS or
PSQ-18 benchmarks.

## Composite scoring

The ESS composite is the arithmetic mean of all answered Likert items,
with `null` items excluded from the denominator. This is the approach
documented for the PSQ-18 subscale means (Marshall & Hays, 1994).
HCAHPS instead reports the percentage of patients selecting the
top-box response per item; this form does not implement top-box
scoring.
