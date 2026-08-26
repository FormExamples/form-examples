# CT Scan Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
CT (computed tomography) examinations. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting standards

### RCR — Standards for the interpretation and reporting of imaging investigations

The Royal College of Radiologists (RCR) standards provide a baseline that all
radiology reports should achieve, so the quality and consistency of imaging
interpretation can be assured. The guidance is written by and for radiologists
but applies to **all who interpret and report imaging, regardless of
professional background** (radiologists, reporting radiographers, and other
reporting clinicians).

Key principles relevant to this form:

- **Actionable reporting** — a report should clearly address the clinical
  question, highlight the relevant findings, and offer guidance on further
  management. This maps to the form's `impression` and `recommended_follow_up`
  fields and the follow-up-urgency axis.
- **Structured sections** — clinical history, technique, comparison, findings,
  and an impression/conclusion. The report-completeness axis scores presence of
  these mandatory sections.
- **Communication of critical, urgent, and unexpected significant findings** —
  the report must record that such a finding was communicated and to whom; this
  drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- Standards for interpretation and reporting of imaging investigations (third
  edition), RCR.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- RCR clinical radiology publications index.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/>

## Structured-reporting categories and incidental findings

### ACR Lung-RADS

ACR Lung-RADS is a structured assessment-and-management categorization system
for lung-cancer-screening CT. Its category label is an example of the value the
form stores in the grade's `reporting_category` field for chest/lung studies.

- ACR Lung-RADS.
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Lung-Rads>

### ACR Incidental Findings Committee white papers

Incidentally discovered abnormalities are a common problem: more than an
estimated 1.5 million pulmonary nodules are found on thoracic CT each year, and
low follow-up rates plague the field. The ACR Incidental Findings Committee
white papers give algorithmic, evidence-plus-expert-opinion guidance on managing
commonly encountered incidental findings, which underpins the form's
`incidental_finding` structured flag and the `incidental-finding` safety-flag
category.

- Managing Incidental Findings on Thoracic CT: Lung Findings — A White Paper of
  the ACR Incidental Findings Committee, *JACR*, September 2021.
  <https://www.jacr.org/article/S1546-1440(21)00376-8/abstract>
- ACR Lung Cancer Screening CT Incidental Findings Quick Reference Guide.
  <https://thoracicrad.org/wp-content/uploads/2021/11/ACR-LCS-IF-one-pager.pdf>
- ACR Incidental Findings Committee (white-paper series).
  <https://www.acr.org/Clinical-Resources/Incidental-Findings>

## Appropriateness and dose context (carried from the request)

- ACR Appropriateness Criteria. <https://acsearch.acr.org/list>
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification and dose audit; dose-length product / DLP recorded per study).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCR actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| ACR Lung-RADS / structured categories | `reporting_category` (Axis B) |
| ACR incidental-findings white papers | `incidental_finding`, `incidental-finding` flag |
| IR(ME)R dose audit | `radiation_dose_dlp` |
