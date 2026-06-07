# Braden Scale Grading Rules

The Braden Scale for Predicting Pressure Sore Risk was developed by
Barbara Braden and Nancy Bergstrom in 1987. It is the most widely used
pressure ulcer risk-assessment instrument in adult acute and long-term
care globally.

- Original publication: Bergstrom N, Braden BJ, Laguzza A, Holman V.
  *The Braden Scale for Predicting Pressure Sore Risk.* Nursing Research
  1987; 36(4): 205-210. PMID: 3299278.
- Instrument home page (Prevention Plus, the licensor):
  https://www.bradenscale.com

## Sub-scales

The Braden Scale has six sub-scales. Five are scored 1-4 and one
(friction and shear) is scored 1-3.

| Sub-scale | Range | Meaning of 1 | Meaning of highest |
| --- | --- | --- | --- |
| Sensory perception | 1-4 | Completely limited | No impairment |
| Moisture | 1-4 | Constantly moist | Rarely moist |
| Activity | 1-4 | Bedfast | Walks frequently |
| Mobility | 1-4 | Completely immobile | No limitations |
| Nutrition | 1-4 | Very poor | Excellent |
| Friction and shear | 1-3 | Problem | No apparent problem |

Total range: **6 (highest risk) to 23 (no risk)**.

## Risk banding

Standard banding for adults (Braden 2001 published cut-offs):

| Total | Risk band |
| --- | --- |
| ≥ 19 | No risk |
| 15-18 | Mild risk |
| 13-14 | Moderate risk |
| 10-12 | High risk |
| ≤ 9 | Very high risk |

These thresholds are the basis of the categories used by this form's
engine.

## Use in NICE / NHS guidance

- NICE CG179 *Pressure ulcers: prevention and management* (2014):
  https://www.nice.org.uk/guidance/cg179. NG179 specifies that a
  validated scale (Braden, Waterlow or Norton) should be used as an
  adjunct to clinical judgement, not a substitute for it.
- NHS Improvement *Pressure ulcers: revised definition and measurement*
  framework (2018) for staging.

## EPUAP / NPIAP / PPPIA pressure ulcer staging

Wound staging in Step 6 follows the international classification system
published by the European Pressure Ulcer Advisory Panel (EPUAP), the
US National Pressure Injury Advisory Panel (NPIAP) and the Pan Pacific
Pressure Injury Alliance (PPPIA), latest edition (2019):

| Stage | Definition |
| --- | --- |
| 1 | Non-blanchable erythema of intact skin |
| 2 | Partial-thickness skin loss with exposed dermis |
| 3 | Full-thickness skin loss |
| 4 | Full-thickness skin and tissue loss |
| Unstageable | Obscured full-thickness skin and tissue loss |
| Deep tissue injury | Persistent non-blanchable deep red, maroon or purple discolouration |

Source: NPIAP / EPUAP / PPPIA *Prevention and Treatment of Pressure
Ulcers/Injuries: Clinical Practice Guideline.* 3rd edition, 2019.
https://npiap.com

## TIME wound bed assessment

Step 6 uses the TIME framework (Tissue, Inflammation/infection,
Moisture imbalance, Edge of wound), originally described by:

- Schultz GS et al. *Wound bed preparation: a systematic approach to
  wound management.* Wound Repair and Regeneration 2003; 11 Suppl 1:
  S1-28. PMID: 12654015. DOI: 10.1046/j.1524-475X.11.s2.1.x.

## Implementation rules in this engine

| Rule ID | Behaviour |
| --- | --- |
| R-BRADEN-MISS | If any sub-scale is unanswered, total is null and band is "Incomplete"; no risk inference. |
| R-BRADEN-BAND | Banding follows Braden 2001 cut-offs (≤ 9, 10-12, 13-14, 15-18, ≥ 19). |
| R-BRADEN-VHIGH | Score ≤ 9 raises an urgent pressure-ulcer-prevention flag and prompts immediate tissue-viability referral. |
| R-WOUND-STAGE | Stage 3, 4, or unstageable wound raises an urgent tissue-viability flag. |
| R-WOUND-DTI | Deep tissue injury raises a "monitor for deterioration" flag. |
