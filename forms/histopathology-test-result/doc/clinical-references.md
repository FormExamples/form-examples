# Histopathology Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
histopathology (cellular pathology) examinations. These sources anchor the
four-axis interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting standards

### RCPath — Cancer datasets and tissue pathways

The Royal College of Pathologists' (RCPath) *Datasets for histopathological
reporting on cancers* standardize cancer reporting among pathologists, define the
range of acceptable practice in handling pathology specimens, and improve the
quality of cancer diagnosis and treatment. Tissue pathways define best practice
for handling specimens from patients who do not have cancer.

Key principles relevant to this form:

- **Core data items** — each dataset mandates a minimum set of items required for
  cancer staging, optimal patient management, and prognosis, and these are
  mandated for inclusion in the Cancer Outcomes and Services Dataset (COSD).
  These map to the form's `diagnosis`, `tumour_type`, `histological_grade`,
  `tnm_pt` / `tnm_pn` / `tnm_pm`, `resection_margins`, and
  `lymphovascular_invasion` fields.
- **Structured proforma reporting** — the core pathological data items are
  summarized in a structured proforma, which may be combined with free text. The
  report-completeness axis scores presence of the mandatory sections
  (clinical history, macroscopic, microscopic, diagnosis, impression).
- **SNOMED coding** — datasets carry SNOMED CT topography / morphology codes in
  separate appendices; this drives the `snomed_code` field.

Sources:

- RCPath — Cancer datasets and tissue pathways (index).
  <https://www.rcpath.org/profession/guidelines/cancer-datasets-and-tissue-pathways.html>
- RCPath — Dataset for histopathological reporting of colorectal cancer
  (example cancer dataset with grade, pTNM, margins, and LVI core items).
  <https://www.rcpath.org/profession/guidelines/cancer-datasets-and-tissue-pathways.html>

## Grade and stage

### UICC/AJCC TNM 8th edition — pathological (pTNM) staging

The UICC *TNM Classification of Malignant Tumours, 8th edition* (published 2016)
is the internationally agreed standard for describing and categorizing cancer
stage. It defines separate clinical (cTNM), pathological (pTNM), and
post-neoadjuvant (ypTNM) classifications. The **pathological pTNM** — the primary
tumour (`pT`), regional lymph nodes (`pN`), and distant metastasis (`pM`)
categories assigned after examination of the resected specimen — is what this
form records in `tnm_pt`, `tnm_pn`, and `tnm_pm`. Histological **differentiation
grade** (well / moderately / poorly differentiated, or undifferentiated) is
captured in `histological_grade`.

Sources:

- UICC — TNM Classification of Malignant Tumours, 8th edition.
  <https://www.uicc.org/resources/tnm-classification-malignant-tumours-8th-edition>
- UICC — TNM publications and resources (incl. the TNM Supplement clarifying
  pathological pT / pN criteria).
  <https://www.uicc.org/what-we-do/sharing-knowledge/tnm/publications-and-resources>

## Critical-result communication

RCPath reporting standards require that critical, urgent, and unexpected
significant findings (e.g. an unexpected malignancy, or an involved margin on a
curative resection) are communicated directly to the requester and that the
communication is recorded. This drives the `critical_result_communicated` /
`reported_to` fields and the `critical-result-alert` safety flag.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCPath structured-proforma reporting | report-completeness axis (`report_completeness_percent`) |
| RCPath cancer-dataset core items | `diagnosis`, `tumour_type`, `histological_grade`, `resection_margins`, `lymphovascular_invasion`; Axis B `reporting_category` |
| UICC TNM 8th edition (pTNM) | `tnm_pt`, `tnm_pn`, `tnm_pm` |
| RCPath SNOMED appendices | `snomed_code` |
| RCPath critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
