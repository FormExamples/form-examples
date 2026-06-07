# The Framingham Heart Study cohort

Brief reference describing the Framingham Heart Study and how the 1998
"Hard CHD" model fits in the wider Framingham equation family.

## The study

The Framingham Heart Study (FHS) is a longitudinal cardiovascular cohort
study established in 1948 in Framingham, Massachusetts, sponsored by the
National Heart, Lung, and Blood Institute (NHLBI) and Boston University.

- Study home page: <https://framinghamheartstudy.org/>
- NHLBI overview: <https://www.nhlbi.nih.gov/science/framingham-heart-study-fhs>

The Original Cohort (n = 5,209) was enrolled in 1948. The Offspring Cohort
(n = 5,124) was enrolled in 1971 — this is the cohort used by Wilson 1998.
The Third Generation Cohort (n = 4,095) was enrolled in 2002. Omni
Cohorts 1 (1994) and 2 (2003) extended representation of African-American,
Hispanic, Asian, Indian, Pacific-Islander, and Native-American participants.

## Equation family

| Equation | Outcome | Year | Citation |
| --- | --- | --- | --- |
| Anderson Framingham | CHD (broad) | 1991 | Anderson KM et al. *Cardiovascular disease risk profiles.* Am Heart J 1991;121(1 Pt 2):293-298. PMID: 1985385. |
| Wilson Hard CHD (this form) | MI or coronary death | 1998 | Wilson PWF et al. *Prediction of coronary heart disease using risk factor categories.* Circulation 1998;97(18):1837-1847. DOI: 10.1161/01.CIR.97.18.1837. |
| ATP III simplified | MI or coronary death | 2002 | NCEP ATP III Final Report. NIH Pub. 02-5215. |
| D'Agostino General CVD | Total CVD | 2008 | D'Agostino RB Sr et al. *General cardiovascular risk profile for use in primary care.* Circulation 2008;117(6):743-753. DOI: 10.1161/CIRCULATIONAHA.107.699579. PMID: 18212285. |
| FHS office-based | Total CVD (no lipids) | 2008 | Same paper (D'Agostino 2008), Table 4. |

This form implements the **Wilson 1998 Hard CHD** model.

## Successors used elsewhere in this repository

- *Predicting risk of cardiovascular disease events* form implements the
  AHA PREVENT equations (Khan et al. 2023).
- *Systematic Coronary Risk Evaluation 2 — Diabetes* form implements
  SCORE2-Diabetes (Hageman et al. 2023).
- *Heart Health Check* form implements a simplified QRISK3-style score.

The cardiology and primary-care community typically uses one
contemporaneous risk calculator (PREVENT or SCORE2 in 2024–2026). Framingham
remains in clinical use largely for historical comparison and for
populations where it has been recalibrated locally.

## References

- Framingham Heart Study. <https://framinghamheartstudy.org/>
- NHLBI Framingham Heart Study overview.
  <https://www.nhlbi.nih.gov/science/framingham-heart-study-fhs>
- Wilson PWF et al. 1998. Circulation 1998;97(18):1837-1847.
  DOI: 10.1161/01.CIR.97.18.1837.
- D'Agostino RB Sr et al. 2008. Circulation 2008;117(6):743-753.
  DOI: 10.1161/CIRCULATIONAHA.107.699579.
- Anderson KM et al. 1991. Am Heart J 1991;121(1 Pt 2):293-298.
  PMID: 1985385.
