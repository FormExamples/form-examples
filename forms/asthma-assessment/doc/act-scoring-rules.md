# Asthma Control Test (ACT) scoring rules

## Instrument

The **Asthma Control Test (ACT)** is a 5-item patient-completed questionnaire
developed by Nathan et al. (2004) to assess asthma control in patients ≥12
years. A separate Childhood ACT exists for ages 4-11.

- Nathan RA, Sorkness CA, Kosinski M, et al. *Development of the Asthma
  Control Test: a survey for assessing asthma control*. Journal of Allergy and
  Clinical Immunology 2004;113:59-65. PMID: 14713908.
  DOI: 10.1016/j.jaci.2003.09.008
- Schatz M, Sorkness CA, Li JT, et al. *Asthma Control Test: reliability,
  validity, and responsiveness in patients not previously followed by asthma
  specialists*. J Allergy Clin Immunol 2006;117:549-56. PMID: 16522452

## Items

Each item is scored 1-5; total ranges 5-25.

| # | Item (4-week recall) | Score |
| --- | --- | --- |
| 1 | How much of the time did your asthma keep you from getting as much done at work, school, or home? | 5 = none of the time → 1 = all of the time |
| 2 | How often have you had shortness of breath? | 5 = not at all → 1 = more than once a day |
| 3 | How often did your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) wake you up at night or earlier than usual in the morning? | 5 = not at all → 1 = 4 or more nights a week |
| 4 | How often have you used your rescue inhaler or nebulizer medication (such as albuterol)? | 5 = not at all → 1 = 3 or more times per day |
| 5 | How would you rate your asthma control during the past 4 weeks? | 5 = completely controlled → 1 = not controlled at all |

## Category cut-points

| Score | Category | Interpretation |
| --- | --- | --- |
| 20-25 | Well controlled | Continue current step; consider step-down if stable ≥3 months |
| 16-19 | Not well controlled | Step up; check adherence and inhaler technique |
| 5-15 | Very poorly controlled | Step up; consider oral corticosteroid course and specialist referral |

The 20-point control threshold is supported by Schatz et al. 2006 with
sensitivity and specificity ≈70-80% against specialist assessment.

## Minimal clinically important difference (MCID)

- MCID = **3 points** (Schatz M et al. *J Allergy Clin Immunol*
  2009;124:719-23. PMID: 19767070).

## Childhood ACT

- For ages 4-11, the **Childhood ACT** (cACT) is used: 4 child-completed items
  + 3 parent-completed items, total 0-27. Cut-point ≤19 indicates not well
  controlled (Liu AH et al. *J Allergy Clin Immunol* 2007;119:817-25.
  PMID: 17353040).

## Flagged-issue triggers

The engine raises a flagged issue when any of the following hold:

- ACT score ≤15 → "Very poorly controlled — review treatment step per NICE
  NG245 / GINA 2024 and consider oral prednisolone rescue".
- ACT score 16-19 → "Not well controlled — check inhaler technique and
  adherence; step up therapy".
- Increase in rescue β2-agonist use to >3 times/day → "Over-reliance on
  SABA; consider MART regime (formoterol/ICS) per NICE NG245".
- ≥2 exacerbations requiring oral steroids in past year (Step 7) → "Severe
  asthma referral criterion per BTS/SIGN".

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [assessment-protocol.md](assessment-protocol.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
