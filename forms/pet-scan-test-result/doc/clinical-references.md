# PET Scan Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
PET-CT (positron emission tomography) examinations. These sources anchor the
four-axis interpretation grade, the structured-reporting categories (Deauville,
PERCIST), and the critical-result alerting rules used by this form.

## Reporting standards

### RCR — Standards for the interpretation and reporting of imaging investigations

The Royal College of Radiologists (RCR) standards provide a baseline that all
imaging reports should achieve, so the quality and consistency of imaging
interpretation can be assured. The guidance applies to **all who interpret and
report imaging, regardless of professional background** (nuclear-medicine
physicians, radiologists, and other reporting clinicians).

Key principles relevant to this form:

- **Actionable reporting** — a report should clearly address the clinical
  question, highlight the relevant findings, and offer guidance on further
  management. This maps to the form's `impression` and `recommended_follow_up`
  fields and the follow-up-urgency axis.
- **Structured sections** — clinical history, technique / acquisition,
  comparison, findings, and an impression/conclusion. The report-completeness
  axis scores presence of these mandatory sections.
- **Communication of critical, urgent, and unexpected significant findings** —
  the report must record that such a finding was communicated and to whom; this
  drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- Standards for interpretation and reporting of imaging investigations (third
  edition), RCR.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>

## Structured-reporting categories

### Deauville 5-point score (lymphoma)

The 5-point Deauville score describes a lesion's FDG avidity relative to two
internal reference points within the individual patient — the **mediastinal
blood pool** and the **liver**. It is the international standard for response
assessment of lymphomas with FDG-PET/CT and is incorporated into the **Lugano
classification** for both Hodgkin and non-Hodgkin lymphoma.

| Score | Criterion |
| --- | --- |
| 1 | No uptake above background |
| 2 | Uptake ≤ mediastinum |
| 3 | Uptake > mediastinum but ≤ liver |
| 4 | Uptake moderately > liver |
| 5 | Uptake markedly > liver and/or new lesion(s) |
| X | New areas of uptake unlikely to be lymphoma-related |

Scores 1–3 generally represent a complete metabolic response; scores 4–5
indicate residual or (with increasing uptake / new lesions) progressive
metabolic disease. The score is stored free-text in `reporting_category`.

- Chemotherapy Response Assessment by FDG-PET-CT in Early-stage Classical Hodgkin
  Lymphoma: Moving Beyond the Five-Point Deauville Score.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6033266/>

### PERCIST (solid tumours)

PET Response Criteria in Solid Tumors (PERCIST) defines metabolic response
between two time-points using the lean-body-mass-corrected peak SUV (SULpeak) of
a target lesion measured against a liver (or aortic) threshold:

- **Complete metabolic response (CMR)** — resolution of measurable target-lesion
  uptake below liver / background and no new lesions.
- **Partial metabolic response (PMR)** — ≥30 % reduction in target SULpeak with
  an absolute drop ≥0.8 SUL units.
- **Stable metabolic disease (SMD)** — neither PMR, CMR, nor PMD; no new lesions.
- **Progressive metabolic disease (PMD)** — >30 % increase in SULpeak (>0.8 SUL
  units) or new lesions.

PERCIST maps directly onto the `treatment_response` field (complete / partial /
stable / progressive) and may also be recorded in `reporting_category`.

- PET response criteria in solid tumors.
  <https://en.wikipedia.org/wiki/PET_response_criteria_in_solid_tumors>
- From RECIST to PERCIST: Evolving Considerations for PET Response Criteria in
  Solid Tumors, *Journal of Nuclear Medicine*.
  <https://jnm.snmjournals.org/content/50/Suppl_1/122S>

## Acquisition, preparation, and dose context

- EANM procedure guidelines for tumour imaging with [18F]FDG PET/CT (v3.0) —
  fasting and glucose-control thresholds (FDG uptake quality needs blood glucose
  control, typically below ~11 mmol/L) and administered-activity guidance.
  <https://www.sciencedirect.com/science/article/pii/S3051292125000065>
- SNMMI — 18F-FDG PET and PET/CT Patient Preparation (glucose 7–11 mmol/L
  target). <https://tech.snmjournals.org/content/42/1/5>
- UK Ionising Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification and dose audit; administered activity recorded per study).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCR actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| Lugano / Deauville score | `reporting_category` (Axis B) |
| PERCIST response categories | `treatment_response`, `reporting_category` (Axis B) |
| EANM glucose-control guidance | `blood_glucose_mmol_l` |
| IR(ME)R / EANM dose audit | `injected_activity_mbq` |
