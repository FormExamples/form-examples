# ESAS-r Grading Rules

The Edmonton Symptom Assessment System (ESAS) is a 10-symptom
self-report instrument developed by Bruera and colleagues in 1991 for
palliative care. The Edmonton Symptom Assessment System — revised
(ESAS-r) is the 2011 reworked version with clarified item wording.
ESAS / ESAS-r is the most widely used symptom-screening tool in
palliative care worldwide.

- Original publication: Bruera E, Kuehn N, Miller MJ, Selmser P, Macmillan
  K. *The Edmonton Symptom Assessment System (ESAS): a simple method
  for the assessment of palliative care patients.* Journal of
  Palliative Care 1991; 7(2): 6-9. PMID: 1714502.
- Revised version: Watanabe SM, Nekolaichuk C, Beaumont C, Johnson L,
  Myers J, Strasser F. *A multicenter study comparing two numerical
  versions of the Edmonton Symptom Assessment System in palliative care
  patients.* Journal of Pain and Symptom Management 2011; 41(2):
  456-468. PMID: 21145202.
- Instrument home page: Alberta Health Services / Cancer Care Alberta.
  https://www.albertahealthservices.ca/info/page12595.aspx

## Items

ESAS-r has 10 symptoms, each rated 0-10:

| # | Symptom |
| --- | --- |
| 1 | Pain |
| 2 | Tiredness (fatigue) |
| 3 | Drowsiness |
| 4 | Nausea |
| 5 | Lack of appetite |
| 6 | Shortness of breath |
| 7 | Depression |
| 8 | Anxiety |
| 9 | Wellbeing |
| 10 | Other symptom (patient-specified) |

Each symptom is rated 0 (no symptom) to 10 (worst possible). Total
score range: 0-100.

## Severity bands

Banding follows widely used cut-offs in the palliative literature
(Selby D et al. 2010; Hui & Bruera 2017 reviews):

| Total | Band |
| --- | --- |
| 0-10 | None |
| 11-30 | Mild |
| 31-60 | Moderate |
| 61-100 | Severe |

ESAS does not have a single universally published total cut-off; the
above bands are derived from the four-tier convention used by Alberta
Health Services and reproduced in many UK hospices.

## Individual-symptom alert

Independent of the total, **any single symptom score ≥ 7** is treated as
a clinically significant burden warranting urgent review. This
threshold is based on Selby D, Cascella A, Gardiner K et al. *A single
set of numerical cut-points to define moderate and severe symptoms for
the Edmonton Symptom Assessment System.* Journal of Pain and Symptom
Management 2010; 39(2): 241-249. PMID: 19963335.

## Performance-status instruments

Step 4 records performance status using one of:

| Instrument | Range | Source |
| --- | --- | --- |
| Palliative Performance Scale (PPSv2) | 0-100, decrements of 10 | Anderson F, Downing GM, Hill J, Casorso L, Lerch N. *Palliative Performance Scale (PPS): a new tool.* Journal of Palliative Care 1996; 12(1): 5-11. PMID: 8857241. |
| Karnofsky Performance Status (KPS) | 0-100 | Karnofsky DA, Burchenal JH. 1949. |
| ECOG Performance Status | 0-5 | Oken MM et al. 1982. PMID: 7165009. |

The engine records whichever was used; it does not auto-convert
between them.

## Implementation rules

| Rule ID | Behaviour |
| --- | --- |
| R-ESAS-MISS | Any of 10 symptoms unanswered → total = null, band = "Incomplete". |
| R-ESAS-BAND | Banding per Selby 2010 cut-offs. |
| R-ESAS-ANY7 | Any single symptom ≥ 7 → urgent-review flag (independent of total). |
| R-ESAS-PAIN | Pain ≥ 7 → analgesic-review flag. |
| R-ESAS-DEPR | Depression ≥ 7 → psychosocial / spiritual review flag. |
| R-ESAS-DYSPNOEA | Shortness of breath ≥ 7 → respiratory symptom-control flag. |
| R-PPS-LOW | PPS ≤ 30 → hospice / end-of-life pathway flag. |
| R-PROG-DAYS | Clinician estimate of "days" prognosis → goals-of-care / RESPECT review flag. |
