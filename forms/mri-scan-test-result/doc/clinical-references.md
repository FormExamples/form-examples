# MRI Scan Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
MRI (magnetic resonance imaging) examinations. These sources anchor the
four-axis interpretation grade, the structured-reporting categories, and the
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

- **Actionable reporting** — a report should answer the clinical question, and
  when an abnormality is seen a diagnosis and the next step of management should
  be offered. This maps to the form's `impression` and `recommended_follow_up`
  fields and the follow-up-urgency axis.
- **Structured sections** — clinical history, technique (for MRI, the pulse
  sequences performed), comparison, findings, and an impression/conclusion. The
  report-completeness axis scores presence of these mandatory sections.
- **Reporting priority and prompt communication** — imaging is classified as
  critical, urgent, routine, or research, and reports should be communicated
  promptly; critical, urgent, and unexpected significant findings must be
  recorded as communicated and to whom. This drives the
  `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- Standards for interpretation and reporting of imaging investigations (third
  edition), RCR.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- RCR clinical radiology publications index.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/>

## Structured-reporting categories (Axis B)

Structured reporting is well established in MRI through ACR reporting and data
systems. The category label is the value the form stores in the grade's
`reporting_category` field.

### ACR PI-RADS (prostate MRI)

The Prostate Imaging Reporting and Data System (PI-RADS), a joint development of
the ACR, ESUR, and the AdMeTech Foundation, standardizes the acquisition,
interpretation, and reporting of multiparametric prostate MRI. Components
(T2-weighted, diffusion-weighted, and dynamic contrast-enhanced imaging) are
scored and combined into an assessment category of **1–5**, where 5 is most
likely to represent clinically significant prostate cancer.

- ACR PI-RADS.
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/PI-RADS>

### ACR BI-RADS (breast MRI)

The Breast Imaging Reporting and Data System (BI-RADS) provides standardized
breast imaging terminology, report organization, and a final assessment
category (**0–6**) for mammography, ultrasound, and MRI of the breast, conveying
an approximate risk of malignancy and the recommended management.

- ACR BI-RADS.
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS>

Where no region-specific data system applies, a **Likert** score may be stored
in the same field.

## Appropriateness and MR safety context (carried from the request)

- ACR Appropriateness Criteria. <https://acsearch.acr.org/list>
- ACR Manual on MR Safety (MR Safe / Conditional / Unsafe labelling, implant
  screening — applied at the request/vetting stage, not at reporting).
  <https://www.acr.org/Clinical-Resources/Radiology-Safety/MR-Safety>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCR actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| ACR PI-RADS / BI-RADS / Likert | `reporting_category` (Axis B) |
| RCR / structured findings | `cord_compression`, `haemorrhage`, `infarct`, `demyelination`, `mass_or_lesion`, `disc_herniation`, `infection_inflammation`, `incidental_finding` |
