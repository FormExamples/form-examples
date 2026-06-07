# IPSS Grading Rules

The International Prostate Symptom Score (IPSS) is the AUA Symptom Index
plus a single quality-of-life question. It is the standard instrument
worldwide for measuring lower urinary tract symptoms (LUTS) attributable
to benign prostatic hyperplasia (BPH) in adult males.

- Original publication: Barry MJ, Fowler FJ, O'Leary MP, Bruskewitz RC,
  Holtgrewe HL, Mebust WK, Cockett ATK. *The American Urological
  Association Symptom Index for benign prostatic hyperplasia.* Journal
  of Urology 1992; 148(5): 1549-1557. PMID: 1279218.
- The AUA Symptom Index was adopted by the WHO International Consultation
  on BPH in 1993 as the IPSS — the two scoring sheets are identical.
- AUA BPH Guideline (most recent edition):
  https://www.auanet.org/guidelines-and-quality/guidelines/benign-prostatic-hyperplasia-(bph)-guideline

## Scoring

Seven symptom items each scored 0-5 over the past month:

| # | Item | Range |
| --- | --- | --- |
| 1 | Incomplete emptying | 0-5 |
| 2 | Frequency | 0-5 |
| 3 | Intermittency | 0-5 |
| 4 | Urgency | 0-5 |
| 5 | Weak stream | 0-5 |
| 6 | Straining | 0-5 |
| 7 | Nocturia | 0-5 |

Total symptom score: **0-35**.

A separate quality-of-life question (often called the IPSS-QoL or
"bother score") is scored 0-6 (0 = Delighted, 6 = Terrible) and is
reported alongside the symptom score but is not added into the 0-35.

## Severity banding

| Total | Band |
| --- | --- |
| 0-7 | Mild |
| 8-19 | Moderate |
| 20-35 | Severe |

These thresholds are from Barry et al. 1992 and are reproduced in the
EAU and AUA BPH guidelines.

## EAU / NICE / AUA guideline use

- European Association of Urology (EAU) *Management of Non-Neurogenic
  Male LUTS* guideline.
  https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts
- NICE CG97 *Lower urinary tract symptoms in men: management.*
  https://www.nice.org.uk/guidance/cg97
- AUA BPH Guideline (see link above).

All three use IPSS as the entry-level patient-reported symptom measure
and use the Barry 1992 cut-offs.

## Implementation rules

| Rule ID | Behaviour |
| --- | --- |
| R-IPSS-MISS | If any item is unanswered, total is null and band is "Incomplete". |
| R-IPSS-BAND | Banding follows Barry 1992 (0-7 / 8-19 / 20-35). |
| R-IPSS-QOL | Bother ≥ 4 ("Mostly dissatisfied" / "Unhappy" / "Terrible") raises a "consider intervention" flag regardless of symptom score. |
| R-IPSS-RETENTION | Patient-reported episode of acute urinary retention raises an urgent referral flag (independent of IPSS). |
| R-IPSS-HAEMATURIA | Visible haematuria raises a 2-week-wait flag per NICE NG12 Section 1.6. |

## Other rules

| Rule ID | Behaviour |
| --- | --- |
| R-UROL-CKD | eGFR < 60 mL/min/1.73 m² on Step 6 raises a renal-function flag (NICE NG203 CKD). |
| R-UROL-PSA | PSA above the age-banded threshold raises a 2-week-wait suspected prostate cancer flag per NICE NG12. |
| R-UROL-VISIBLE-HAEM | Painless visible haematuria in adult ≥ 45 raises a 2-week-wait bladder cancer flag per NICE NG12. |
