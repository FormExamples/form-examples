# KDIGO CKD Staging Rules

The renal assessment is aligned to the KDIGO (Kidney Disease: Improving
Global Outcomes) classification of chronic kidney disease (CKD), which
stratifies CKD by **GFR category** (G1-G5) and **albuminuria category**
(A1-A3). A composite risk (Low / Moderate / High / Very High) is then
read off the KDIGO "heatmap".

- Primary publication: KDIGO 2012 Clinical Practice Guideline for the
  Evaluation and Management of Chronic Kidney Disease. Kidney
  International Supplements 2013; 3(1): 1-150.
  https://kdigo.org/guidelines/ckd-evaluation-and-management/
- Updated KDIGO 2024 CKD Guideline.
  https://kdigo.org/guidelines/ckd-evaluation-and-management/

The 2024 update revises drug-management and risk-equation guidance but
retains the G-stage / A-stage grid used here.

## GFR categories

Estimated glomerular filtration rate (eGFR), mL/min/1.73 m²:

| Category | eGFR | Description |
| --- | --- | --- |
| G1 | ≥ 90 | Normal or high |
| G2 | 60-89 | Mildly decreased |
| G3a | 45-59 | Mildly to moderately decreased |
| G3b | 30-44 | Moderately to severely decreased |
| G4 | 15-29 | Severely decreased |
| G5 | < 15 | Kidney failure |

In adults, KDIGO 2024 recommends the **CKD-EPI 2021 (race-free)**
creatinine equation as the preferred eGFR calculator. The engine
records the eGFR value as supplied by the laboratory and assumes the
supplied value follows the local laboratory's reported equation.

## Albuminuria categories

Urinary albumin-to-creatinine ratio (ACR), mg/mmol:

| Category | ACR | Description |
| --- | --- | --- |
| A1 | < 3 | Normal to mildly increased |
| A2 | 3-30 | Moderately increased (formerly "microalbuminuria") |
| A3 | > 30 | Severely increased (formerly "macroalbuminuria") |

Equivalent mg/g values: A1 < 30, A2 30-300, A3 > 300.

## KDIGO heatmap (composite risk)

The combined GFR × ACR risk grid (Figure 6 of the KDIGO 2012 guideline,
retained in 2024):

| | A1 | A2 | A3 |
| --- | --- | --- | --- |
| G1 | Low | Moderate | High |
| G2 | Low | Moderate | High |
| G3a | Moderate | High | Very high |
| G3b | High | Very high | Very high |
| G4 | Very high | Very high | Very high |
| G5 | Very high | Very high | Very high |

Where:

- G1 / A1 with no other markers of kidney damage is **not CKD** — the
  patient is reported as "no CKD" and the heatmap entry is a default.
- A "marker of kidney damage" includes abnormal imaging, biopsy
  findings, urinary sediment abnormalities, or a renal transplant
  recipient status — Step 7 captures these.

## NICE alignment

- NICE NG203 *Chronic kidney disease: assessment and management* (2021,
  updated 2024). https://www.nice.org.uk/guidance/ng203

NG203 adopts the KDIGO classification verbatim and adds UK-specific
prescribing and referral recommendations. The engine's composite risk
matches the NG203 risk grid.

## AKI screening (informative)

Step 5 captures the most recent creatinine and a baseline value where
available. Acute kidney injury is detected per the KDIGO AKI criteria:

| AKI stage | Criterion |
| --- | --- |
| 1 | Creatinine 1.5-1.9 × baseline or ≥ 26.5 µmol/L rise in 48 h |
| 2 | Creatinine 2.0-2.9 × baseline |
| 3 | Creatinine ≥ 3.0 × baseline, or ≥ 354 µmol/L, or starting RRT |

Source: KDIGO AKI Clinical Practice Guideline 2012.
https://kdigo.org/guidelines/acute-kidney-injury/

Any suspected AKI fires a separate urgent flag independent of the CKD
classification.

## Implementation rules

| Rule ID | Behaviour |
| --- | --- |
| R-KDIGO-MISS | Missing eGFR or ACR → composite = "Incomplete"; no risk inference. |
| R-KDIGO-G | GFR-to-stage mapping per KDIGO 2012/2024 cut-offs. |
| R-KDIGO-A | ACR-to-stage mapping per KDIGO 2012/2024 cut-offs. |
| R-KDIGO-COMPOSITE | Composite risk read from KDIGO heatmap. |
| R-AKI-DETECT | Creatinine rise meeting KDIGO AKI 1/2/3 fires urgent flag. |
| R-CKD-G4 | Stage G4 or G5 raises a renal-referral flag per NG203. |
| R-CKD-NEPHROTIC | ACR > 220 mg/mmol raises a "consider nephrotic syndrome" flag. |
