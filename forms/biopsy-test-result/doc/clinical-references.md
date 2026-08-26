# Biopsy Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
biopsy histopathology specimens. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting standards

### RCPath — Standards and datasets for reporting cancers

The Royal College of Pathologists (RCPath) cancer datasets standardize cancer
reporting among pathologists, defining the range of acceptable practice for
handling pathology specimens and enhancing cancer diagnosis and treatment
quality. Each dataset specifies **core (required)** items — the robust,
evidence-based data needed for cancer staging, management, and prognosis — and
**non-core (recommended)** items.

Key principles relevant to this form:

- **Core data items** — diagnosis, tumour type, histological grade, resection
  margins, and lymphovascular invasion are core items across most RCPath
  datasets. These map to the form's `diagnosis`, `tumour_type`,
  `histological_grade`, `resection_margins`, and `lymphovascular_invasion`
  fields and drive the severity axis.
- **Structured report sections** — clinical history, macroscopic description,
  microscopic description, diagnosis, and impression/conclusion. The
  report-completeness axis scores presence of these mandatory sections.
- **Communication of critical and unexpected significant findings** — an
  unexpected malignancy or an involved resection margin must be communicated and
  recorded; this drives the `critical_result_communicated` / `reported_to`
  fields and the `critical-result-alert` safety flag.

Sources:

- Cancer datasets and tissue pathways, RCPath.
  <https://www.rcpath.org/profession/guidelines/cancer-datasets-and-tissue-pathways.html>
- Example: Dataset for histopathological reporting of colorectal cancer (G049),
  RCPath (TNM8-aligned).
  <https://www.rcpath.org/static/c8b61ba0-ae3f-43f1-85ffd3ab9f17cfe6/c19a5cd7-3485-44c2-b5e1c87154830582/G049-Dataset-for-histopathological-reporting-of-colorectal-cancer.pdf>

## Staging and structured grading

### TNM8 (UICC)

The TNM Classification of Malignant Tumours, 8th edition (Union for
International Cancer Control, 2017) is the staging framework incorporated across
RCPath cancer datasets (e.g. cutaneous squamous cell carcinoma, endometrial,
colorectal, and prostate datasets). A TNM8 category is an example of the value
the form stores in the grade's `reporting_category` field.

- TNM Classification of Malignant Tumours, UICC.
  <https://www.uicc.org/resources/tnm>

### ICCR — International Collaboration on Cancer Reporting

ICCR develops internationally standardized, evidence-based datasets for the
pathology reporting of cancer specimens, composed of Required (core) and
Recommended (non-core) elements. ICCR datasets reduce development effort for
RCPath and CAP checklists and underpin the structured items (specimen adequacy,
resection margins, lymphovascular invasion) the form captures.

- ICCR publications.
  <https://www.iccr-cancer.org/publications/>

## Coding

### SNOMED CT

SNOMED CT provides morphology and topography codes for the histopathological
diagnosis, stored in the form's `snomed_code` field for interoperability.

- SNOMED International. <https://www.snomed.org/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCPath core data items | `diagnosis`, `tumour_type`, `histological_grade`, `resection_margins`, `lymphovascular_invasion`, severity axis |
| RCPath mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCPath critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| TNM8 / ICCR structured grading | `reporting_category` (Axis B) |
| ICCR specimen-adequacy item | `specimen_adequacy` |
| SNOMED CT coding | `snomed_code` |
