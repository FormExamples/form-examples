# Mammography Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
mammography examinations. These sources anchor the four-axis interpretation
grade, the ACR BI-RADS structured-reporting categories, the breast-density
classification, and the critical-result alerting rules used by this form.

## Structured reporting — ACR BI-RADS

### BI-RADS final assessment categories

The ACR Breast Imaging Reporting and Data System (BI-RADS) standardizes
mammographic reporting through seven final assessment categories (0–6). It is the
single most important structured score this form records (`bi_rads_category`),
and it determines management.

- **Category 0 — incomplete:** additional imaging (or comparison with priors) is
  needed before a final assessment can be made.
- **Category 1 — negative:** no suspicious findings.
- **Category 2 — benign:** definitely benign findings.
- **Category 3 — probably benign:** ≤ 2 % likelihood of malignancy; short-interval
  (typically 6-month) follow-up to establish stability.
- **Category 4 — suspicious:** subdivided into **4a** (low suspicion), **4b**
  (intermediate suspicion), and **4c** (moderate suspicion); tissue diagnosis /
  biopsy is recommended.
- **Category 5 — highly suggestive of malignancy:** ≥ 95 % likelihood of
  malignancy; biopsy required.
- **Category 6 — known biopsy-proven malignancy.**

There are four BI-RADS management options: additional imaging, routine-interval
mammography, short-term follow-up, and biopsy. Only BI-RADS 0/1/2 may be assigned
to a screening study; BI-RADS 3/4/5/6 are reserved for diagnostic mammograms
after a complete imaging work-up.

This maps directly onto the form's BI-RADS → axes rule: 1–2 = normal / routine;
3 = abnormal / recommended short-interval follow-up; 4–5 = abnormal or critical /
urgent biopsy referral; 0 = inconclusive / further-imaging; 6 = known malignancy.

Sources:

- ACR BI-RADS® (Breast Imaging Reporting & Data System).
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS>
- Mammography BI-RADS Grading (StatPearls).
  <https://www.ncbi.nlm.nih.gov/books/NBK539816/>
- Breast Imaging Reporting and Data System (StatPearls).
  <https://www.ncbi.nlm.nih.gov/books/NBK459169/>

### Breast density (ACR composition)

BI-RADS classifies breast composition into four density categories: **a** =
almost entirely fatty (< 25 % glandular); **b** = scattered fibroglandular
densities (25–50 %); **c** = heterogeneously dense (51–75 %); **d** = extremely
dense (> 75 %). Sensitivity of screening mammography is lower in dense breasts
(c/d) because of the masking effect of fibroglandular tissue, which may prompt
supplemental imaging. The form stores this in `breast_density`.

## Reporting standards and screening context

### RCR — breast imaging guidance

The Royal College of Radiologists guidance on screening and symptomatic breast
imaging anchors the actionable-reporting and structured-sections principles
behind the form's report-completeness axis and its impression /
recommended-follow-up fields, and recommends that breast density be stated using
the BI-RADS Atlas reporting system for surveillance reports in high-risk
individuals.

- RCR — Guidance on screening and symptomatic breast imaging (2025).
  <https://www.rcr.ac.uk/media/043jyjqj/guidance-on-screening-and-symptomatic-breast-imaging-2025.pdf>

### NHS Breast Screening Programme (NHSBSP)

The NHSBSP defines the routine screening age range and high-risk surveillance
pathways and the read/report workflow for screening mammograms (where only
BI-RADS 0/1/2 may be assigned before recall to assessment).

- NHS population screening — breast.
  <https://www.gov.uk/topic/population-screening-programmes/breast>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| ACR BI-RADS final assessment categories 0–6 | `bi_rads_category` (main table); grade `reporting_category` (Axis B); Axis A + Axis D mapping |
| BI-RADS management options (follow-up / biopsy) | `recommended_follow_up`; follow-up-urgency axis; `abnormal-requiring-action` / `urgent-referral` flags |
| ACR breast-density categories a–d | `breast_density` |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| BI-RADS lesion descriptors (mass, calcifications, distortion, asymmetry) | structured finding booleans (`mass`, `calcifications`, `architectural_distortion`, `asymmetry`, `skin_or_nipple_change`, `lymphadenopathy`) |
| NHSBSP screening-vs-diagnostic constraint | `exam_type`; BI-RADS category permitted set |
