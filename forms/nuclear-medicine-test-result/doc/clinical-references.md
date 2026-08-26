# Nuclear Medicine Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
nuclear medicine (radionuclide scan) examinations. These sources anchor the
four-axis interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting standards

### BNMS — British Nuclear Medicine Society clinical guidelines

The British Nuclear Medicine Society (BNMS), established in 1966, is the UK
forum for nuclear medicine. Its clinical-guidelines library covers procedure and
reporting standards across radionuclide imaging and endorses the EANM procedure
guidelines (for example for bone scintigraphy). These standards inform the
mandatory report sections and the structured impression captured by this form.

- BNMS clinical guidelines.
  <https://www.bnms.org.uk/page/BNMSClinicalGuidelines>
- BNMS endorsed EANM guidelines.
  <https://www.bnms.org.uk/page/EANMGuidelines>

### RCR — Standards for the interpretation and reporting of imaging investigations

The Royal College of Radiologists (RCR) standards provide a baseline that all
imaging reports should achieve. The guidance applies to **all who interpret and
report imaging, regardless of professional background** (nuclear-medicine
physicians, radiologists, and other reporting clinicians).

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

- Standards for interpretation and reporting of imaging investigations (third
  edition), RCR.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>

## Structured-reporting categories

### V/Q (ventilation–perfusion) lung scan — PE probability

For pulmonary-embolism (PE) imaging, the form stores a PE-probability category in
the grade's `reporting_category` field. Two complementary systems are used:

- **SNMMI modified PIOPED II** categories: *high probability* (≥2 large
  mismatched segmental V/Q defects), *normal* (no perfusion defects), *very low*,
  and *non-diagnostic / intermediate* (all other findings). A **high-probability**
  category is a **critical finding** and drives the `critical-result-alert` flag
  and an Axis D *critical-alert*.
- **EANM** holistic V/P SPECT criteria: PE is indicated by a mismatch of at least
  one segment or two subsegments conforming to pulmonary vascular anatomy
  (wedge-shaped defects). The EANM cut-off for a positive study is one segmental
  or two subsegmental mismatched defects, which yields very low rates of
  non-diagnostic reports.

- EANM guideline for ventilation/perfusion SPECT for the diagnosis of pulmonary
  embolism and beyond.
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6813289/>
- SNM Practice Guideline for Lung Scintigraphy 4.0, *J Nucl Med Technol*.
  <https://tech.snmjournals.org/content/40/1/57>

### Bone scan, myocardial perfusion, and renal studies

- **Bone scan:** multiple skeletal foci suggest a **metastatic pattern**
  (`metastatic_pattern`), a critical finding when widespread.
- **Myocardial perfusion:** reversible/fixed perfusion defects
  (`perfusion_defect`) and gated ejection fraction (`ejection_fraction_percent`)
  drive severity and follow-up; BNMS/BNCS audit parameters underpin the
  mandatory report content.
- **Renal (DMSA / MAG3):** differential (split) function percentages
  (`split_function_left_percent` / `split_function_right_percent`) and
  photopenic scarring (`photopenic_area`).

- BNMS — Heart Scan (Technetium Myocardial Perfusion Scan).
  <https://www.bnms.org.uk/patients-information-sheets/heart-scan.html>

## Dose context

- UK Ionizing Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification and dose audit; administered activity in MBq recorded per study
  and compared against diagnostic reference levels, DRLs).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCR / BNMS actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| SNMMI modified PIOPED II / EANM V/Q | `reporting_category` (Axis B), `perfusion_defect` |
| Bone-scan metastatic pattern | `metastatic_pattern`, `abnormal_uptake` |
| Gated cardiac / renal quantification | `ejection_fraction_percent`, `split_function_left_percent`, `split_function_right_percent` |
| IR(ME)R dose audit | `injected_activity_mbq` |
