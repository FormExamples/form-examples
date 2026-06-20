# Cytology Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
cytology specimens. These sources anchor the four-axis interpretation grade, the
structured-reporting (grading) categories, and the critical-result alerting
rules used by this form.

## Reporting standards

### RCPath — Tissue pathways for diagnostic cytopathology

The Royal College of Pathologists (RCPath) tissue pathways set out the standards
for specimen procurement, preparation, fixation, microscopic assessment, and
reporting for non-gynaecological cytology — urine, serous-cavity effusions,
cerebrospinal fluid, and fine-needle aspirates. They define **specimen
adequacy** (satisfactory / unsatisfactory) and the structure of a cytology
report.

Key principles relevant to this form:

- **Specimen adequacy** — an unsatisfactory specimen cannot be interpreted and
  must trigger a repeat. This maps to `specimen_adequacy` and the
  `inadequate-technique` safety flag.
- **Structured report sections** — clinical history, specimen adequacy,
  microscopic description, diagnosis, and an impression/conclusion. The
  report-completeness axis scores presence of these mandatory sections.
- **Communication of critical and unexpected significant findings** — a
  malignant or high-grade result must be communicated and recorded; this drives
  the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Source:

- *Tissue pathways for diagnostic cytopathology*, RCPath.
  <https://www.rcpath.org/static/b328ab3d-f574-40f1-8717c32ccfc4f7d8/G086-Tissue-pathways-for-diagnostic-cytopathology.pdf>

## Structured-reporting (grading) categories

The free-text `cytology_result_category` and the structured `reporting_category`
hold the recognised grading category for the specimen type.

### NHS Cervical Screening Programme — dyskaryosis terminology

UK cervical smears are reported with British Society for Clinical Cytology
(BSCC) terminology — negative, borderline, low-grade dyskaryosis, high-grade
dyskaryosis (moderate / severe), and glandular neoplasia — which aligns with the
Bethesda system (NILM, ASC-US, LSIL, ASC-H, HSIL, AGC). Cytology now follows HPV
primary screening as a triage test. A **high-grade dyskaryosis** result is a
critical finding that escalates to urgent colposcopy.

- NHS Cervical Screening Programme and colposcopy management.
  <https://www.gov.uk/government/publications/cervical-screening-programme-and-colposcopy-management/1-introduction-and-programme-policy>

### RCPath Thy — thyroid FNA cytology

RCPath thyroid terminology assigns one of five categories: Thy1 (non-diagnostic;
Thy1c cystic), Thy2 (non-neoplastic / benign), Thy3 (Thy3a atypia, Thy3f
follicular neoplasm), Thy4 (suspicious of malignancy), and Thy5 (malignant). The
categories are diagnostic classes, not a progression. **Thy5** is a critical
finding and **Thy4** is abnormal-requiring-action.

- *Guidance on the reporting of thyroid cytology specimens*, RCPath.
  <https://www.rcpath.org/static/7d693ce4-0091-4621-97f79e2a0d1034d6/g089_guidance_on_reporting_of_thyroid_cytology_specimens.pdf>

### Breast FNA cytology — C categories

Breast fine-needle aspiration cytology is categorised C1 (inadequate), C2
(benign), C3 (atypia, probably benign), C4 (suspicious of malignancy), and C5
(malignant), as used in the NHS Breast Screening Programme. **C5** is a critical
finding and **C4** is abnormal-requiring-action.

- *Tissue pathways for diagnostic cytopathology*, RCPath (breast cytology).
  <https://www.rcpath.org/static/b328ab3d-f574-40f1-8717c32ccfc4f7d8/G086-Tissue-pathways-for-diagnostic-cytopathology.pdf>

### Urine and serous-fluid systems

- The Paris System for Reporting Urinary Cytology (negative / atypical /
  suspicious / high-grade urothelial carcinoma).
- The International System for Reporting Serous Fluid Cytopathology
  (non-diagnostic / negative / atypical / suspicious / malignant).

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCPath structured report sections | report-completeness axis (`report_completeness_percent`) |
| RCPath specimen adequacy | `specimen_adequacy`, `inadequate-technique` flag |
| RCPath critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| NHS cervical-screening dyskaryosis grades | `cytology_result_category`, `reporting_category` (Axis B) |
| RCPath Thy / breast C categories | `cytology_result_category`, `reporting_category` (Axis B) |
| Malignant / high-grade result → urgent colposcopy / MDT | `malignancy_present`, follow-up-urgency axis, `urgent-referral` flag |
| HPV primary screening triage | `hpv_result` |
