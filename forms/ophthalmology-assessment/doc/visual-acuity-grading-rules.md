# Visual Acuity Grading Rules

The ophthalmology assessment uses best-corrected visual acuity (BCVA)
in each eye plus anterior- and posterior-segment findings to grade
overall visual function and to fire urgent-referral flags.

## Visual acuity notation

Visual acuity is recorded per eye, using one of the standard equivalent
notations the engine accepts:

| Snellen (6 m) | Snellen (20 ft) | Decimal | logMAR |
| --- | --- | --- | --- |
| 6/6 | 20/20 | 1.0 | 0.0 |
| 6/9 | 20/30 | 0.67 | 0.18 |
| 6/12 | 20/40 | 0.5 | 0.30 |
| 6/18 | 20/60 | 0.33 | 0.48 |
| 6/24 | 20/80 | 0.25 | 0.60 |
| 6/36 | 20/120 | 0.17 | 0.78 |
| 6/60 | 20/200 | 0.1 | 1.0 |
| 3/60 | 20/400 | 0.05 | 1.3 |
| CF | Counts fingers | — | — |
| HM | Hand movements | — | — |
| LP | Light perception | — | — |
| NLP | No light perception | — | — |

The logMAR scale (logarithm of the minimum angle of resolution) is the
canonical scientific notation. Source: Bailey IL, Lovie JE. *New design
principles for visual acuity letter charts.* American Journal of
Optometry and Physiological Optics 1976; 53(11): 740-745. PMID: 998716.

## WHO visual impairment categories

Source: World Health Organization *ICD-11 — Visual impairment*
(Code 9D90). https://icd.who.int/

| Category | Distance VA in better eye (with available correction) |
| --- | --- |
| Mild or no impairment | Better than 6/18 (logMAR < 0.5) |
| Moderate impairment | 6/18 to better than 6/60 (logMAR 0.5 to < 1.0) |
| Severe impairment | 6/60 to better than 3/60 (logMAR 1.0 to < 1.3) |
| Blindness — category 3 | 3/60 to better than 1/60 (logMAR 1.3 to < 1.8) |
| Blindness — category 4 | Worse than 1/60 to light perception (logMAR ≥ 1.8 to LP) |
| Blindness — category 5 | No light perception |

These thresholds are the basis of the impairment-band field on Step 3.

## UK sight-impairment certification

UK clinicians may register a patient as Sight Impaired (SI, formerly
"partially sighted") or Severely Sight Impaired (SSI, formerly "blind")
under the Certificate of Vision Impairment (CVI) process:

- DH Certificate of Vision Impairment guidance.
  https://www.gov.uk/government/publications/certificate-of-vision-impairment-cvi-form
- RNIB CVI summary. https://www.rnib.org.uk

The thresholds are aligned with the WHO bands above; CVI completion is
a clinician action — this engine does not auto-certify CVI but raises a
"Consider CVI" flag when the better-eye logMAR ≥ 1.0.

## Anterior- and posterior-segment red-flag rules

Step 5 and Step 6 capture structured findings. The engine fires
urgent-referral flags on the following:

| Rule ID | Finding | Action |
| --- | --- | --- |
| R-OPH-IOP-HIGH | Intraocular pressure > 21 mmHg | Glaucoma referral (RCOphth glaucoma PPP) |
| R-OPH-IOP-CRIT | IOP ≥ 30 mmHg or pain | Emergency ophthalmology |
| R-OPH-RD | Sudden onset floaters + flashes + visual field defect | Emergency — suspected retinal detachment |
| R-OPH-WHITE-EYE | Acute red eye + reduced VA + photophobia | Same-day ophthalmology |
| R-OPH-AMD-SUSP | Sudden distortion / central scotoma in adult ≥ 50 | Suspected wet AMD — urgent macular referral |
| R-OPH-DR | Diabetic patient + reduced VA + new fundus findings | Urgent retinopathy review |
| R-OPH-AMAUR | Transient monocular vision loss | TIA pathway — urgent stroke referral |

## What this engine does NOT do

- We do not auto-grade diabetic retinopathy by ETDRS / NHS DESP grade —
  those are imaging-graded and require a graded image set.
- We do not auto-grade glaucoma severity by HVF mean deviation.
- We do not grade AMD by AREDS scale.
- We do not produce a refraction or prescription (see the separate
  `eye-prescription` form).
