# DAS28 Grading Rules

The Disease Activity Score in 28 joints (DAS28) is the most widely used
composite disease-activity index for rheumatoid arthritis (RA). It
combines a 28-joint tender-joint count, a 28-joint swollen-joint count,
an acute-phase marker (ESR or CRP), and the patient's global health
visual analogue scale.

- Original publication (DAS): van der Heijde DM, van 't Hof MA, van
  Riel PL, Theunisse LA, Lubberts EW, van Leeuwen MA, van Rijswijk MH,
  van de Putte LB. *Judging disease activity in clinical practice in
  rheumatoid arthritis: first step in the development of a disease
  activity score.* Annals of the Rheumatic Diseases 1990; 49(11):
  916-920. PMID: 2256738.
- DAS28 variant: Prevoo MLL et al. *Modified disease activity scores
  that include twenty-eight–joint counts. Development and validation
  in a prospective longitudinal study of patients with rheumatoid
  arthritis.* Arthritis & Rheumatism 1995; 38(1): 44-48. PMID: 7818570.
- DAS-Score web reference (Nijmegen). https://www.das-score.nl/

## 28-joint set

The DAS28 examines the following joint groups bilaterally:

- Shoulders
- Elbows
- Wrists
- Metacarpophalangeal joints 1-5 (MCP)
- Proximal interphalangeal joints 1-5 (PIP)
- Knees

Total: 28 joints (each scored 0/1 for tenderness and 0/1 for swelling).

The DAS28 deliberately excludes feet, ankles, and the cervical spine.

## Formulae

Let TJC28 = 28-joint tender-joint count, SJC28 = 28-joint swollen-joint
count, GH = patient's general-health VAS (0-100).

**DAS28-ESR:**

DAS28-ESR = 0.56 × √TJC28 + 0.28 × √SJC28 + 0.70 × ln(ESR) + 0.014 × GH

**DAS28-CRP:**

DAS28-CRP = 0.56 × √TJC28 + 0.28 × √SJC28 + 0.36 × ln(CRP + 1) + 0.014 × GH + 0.96

Both variants are widely used. EULAR / NICE TA prefer DAS28-ESR for
historical comparability but accept DAS28-CRP.

## Activity bands (EULAR criteria)

| DAS28 | Activity |
| --- | --- |
| < 2.6 | Remission |
| 2.6 to ≤ 3.2 | Low |
| > 3.2 to ≤ 5.1 | Moderate |
| > 5.1 | High |

Source: Fransen J, van Riel PLCM. *The Disease Activity Score and the
EULAR response criteria.* Clinical and Experimental Rheumatology 2005;
23(5 Suppl 39): S93-99. PMID: 16273792.

## EULAR response criteria

The EULAR response classification compares change in DAS28 to current
activity:

| ΔDAS28 → | > 1.2 | > 0.6 and ≤ 1.2 | ≤ 0.6 |
| --- | --- | --- | --- |
| Current ≤ 3.2 | Good | Moderate | None |
| Current > 3.2 and ≤ 5.1 | Moderate | Moderate | None |
| Current > 5.1 | Moderate | None | None |

The engine reports EULAR response when a prior DAS28 is available in
the patient's record.

## Use in NICE TA biologic eligibility

NICE technology appraisals for biologic / targeted-synthetic DMARDs
(e.g. TA375, TA485, TA715, TA787 and successors) require **DAS28 > 5.1**
sustained over at least one month despite intensive cDMARD therapy,
as the standard threshold for high-cost-drug eligibility. The engine
surfaces this threshold as a flag but the eligibility decision is
made by the rheumatology MDT.

NICE rheumatoid arthritis index:
https://www.nice.org.uk/guidance/conditions-and-diseases/musculoskeletal-conditions/rheumatoid-arthritis

## Implementation rules

| Rule ID | Behaviour |
| --- | --- |
| R-DAS28-MISS | Missing TJC28, SJC28, ESR/CRP, or GH → DAS28 = null, band = "Incomplete". |
| R-DAS28-ESR | DAS28-ESR formula applied when ESR supplied. |
| R-DAS28-CRP | DAS28-CRP formula applied when CRP supplied and ESR absent. |
| R-DAS28-BAND | Banding per Fransen 2005. |
| R-DAS28-HIGH | DAS28 > 5.1 raises high-activity flag and "consider biologic eligibility" prompt. |
| R-DAS28-EULAR | If prior DAS28 present, EULAR response (Good / Moderate / None) computed. |
| R-EXTRA-FLAG | Extra-articular features on Step 5 (e.g. interstitial lung disease, vasculitis) raise multidisciplinary referral flag. |
