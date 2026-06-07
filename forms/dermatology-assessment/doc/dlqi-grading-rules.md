# DLQI Grading Rules

The Dermatology Life Quality Index (DLQI) is a 10-item dermatology-specific
quality-of-life instrument developed by Finlay and Khan at the Department of
Dermatology, Cardiff University, in 1994. It is the most widely used
dermatology-specific quality-of-life questionnaire in clinical practice and
clinical trials.

- Original publication: Finlay AY, Khan GK. "Dermatology Life Quality Index
  (DLQI) — a simple practical measure for routine clinical use." Clinical
  and Experimental Dermatology, 1994; 19(3): 210-216. PMID: 8033378.
- Instrument page (publisher / licensor): https://www.cardiff.ac.uk/medicine/resources/quality-of-life-questionnaires/dermatology-life-quality-index

## Scoring

The questionnaire has 10 items covering the previous 7 days. Each item is
scored on a 4-point Likert scale:

| Response | Score |
| --- | --- |
| Not at all / Not relevant | 0 |
| A little | 1 |
| A lot | 2 |
| Very much | 3 |

Maximum total score: 30. Higher score = greater impairment of
health-related quality of life.

Question 7 (work / study) has a special handling rule: if the patient
selects "yes" (prevented from working or studying), the score for that
item is 3 and the remaining sub-question is skipped.

## Banding (Hongbo et al. 2005)

The standard severity banding is taken from Hongbo Y, Thomas CL,
Harrison MA, Salek MS, Finlay AY. "Translating the science of quality of
life into practice: what do dermatology life quality index scores mean?"
Journal of Investigative Dermatology, 2005; 125(4): 659-664.
PMID: 16185263. DOI: 10.1111/j.0022-202X.2005.23621.x.

| Total | Band | Interpretation |
| --- | --- | --- |
| 0-1 | No effect | No effect at all on patient's life |
| 2-5 | Small | Small effect |
| 6-10 | Moderate | Moderate effect |
| 11-20 | Very large | Very large effect |
| 21-30 | Extremely large | Extremely large effect |

## Minimal clinically important difference

A change of 4 points is the established MCID in chronic skin disease
populations, supported by Basra MKA, Salek MS, Camilleri L, Sturkey R,
Finlay AY. "Determining the minimal clinically important difference and
responsiveness of the Dermatology Life Quality Index (DLQI): further data."
Dermatology, 2015; 230(1): 27-33. PMID: 25613671.

## Use in NICE technology appraisals

The DLQI is the qualifying instrument for biologic therapy access in
several NICE technology appraisals for severe psoriasis, including:

- NICE TA103, TA134, TA146, TA180, TA350, TA511 and successors —
  eligibility thresholds typically require **DLQI > 10** in addition to
  a PASI threshold.
- NICE clinical guideline CG153 *Psoriasis: assessment and management*:
  https://www.nice.org.uk/guidance/cg153

## Licensing

The DLQI is copyrighted by AY Finlay and GK Khan, Cardiff University,
1992. Use in routine NHS clinical care is granted without a fee.
Commercial use requires a licence; see the Cardiff licensing page.

## Implementation rules in this engine

| Rule ID | Behaviour |
| --- | --- |
| R-DLQI-MISS | If any item is unanswered, total is reported as null and band is "Incomplete"; no severity inference is made. |
| R-DLQI-Q7 | Question 7 sub-item handled per Cardiff scoring guide. |
| R-DLQI-BAND | Banding follows Hongbo 2005 cut-offs. |
| R-DLQI-MCID | A delta of ≥ 4 between two timepoints is flagged as clinically meaningful. |
