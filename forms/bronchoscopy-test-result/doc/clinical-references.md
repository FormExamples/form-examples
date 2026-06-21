# Bronchoscopy Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
bronchoscopy (airway endoscopy) procedures. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting and quality standards

### BTS Quality Standards for Flexible Bronchoscopy in Adults

The British Thoracic Society (BTS) Quality Standards set out the expected
standards of care for flexible bronchoscopy, covering waiting times, safety,
outcome measures, and patient experience. They require units to collect
appropriate data and to achieve a minimum diagnostic sensitivity (a benchmark of
≥85 %) for visible mucosal / endobronchial tumour, which underpins this form's
`endobronchial_lesion` structured finding and the abnormality-severity axis.

Key principles relevant to this form:

- **Actionable reporting** — a report should clearly address the clinical
  question, document the findings, and offer guidance on further management. This
  maps to the form's `impression` and `recommended_follow_up` fields and the
  follow-up-urgency axis.
- **Structured documentation** — clinical history, the procedure and the extent
  of airway examined, the findings, the samples taken, and an
  impression/conclusion. The report-completeness axis scores presence of these
  mandatory sections.
- **Communication of critical, urgent, and unexpected significant findings** —
  the report must record that such a finding was communicated and to whom; this
  drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- BTS Quality Standards for Flexible Bronchoscopy in Adults.
  <https://www.brit-thoracic.org.uk/quality-improvement/quality-standards/flexible-bronchoscopy/>
- British Thoracic Society guideline for diagnostic flexible bronchoscopy in
  adults (Du Rand et al., *Thorax* 2013; NICE-accredited).
  <https://pubmed.ncbi.nlm.nih.gov/23860341/>
- British Thoracic Society guideline for advanced diagnostic and therapeutic
  flexible bronchoscopy in adults (2011; EBUS and interventions for central
  airway obstruction).
  <https://pubmed.ncbi.nlm.nih.gov/21987439/>

## Lung-cancer pathway and structured categories

### National Optimal Lung Cancer Pathway and NICE NG122

Where bronchoscopy reveals a suspected endobronchial tumour or obtains tissue for
diagnosis, the findings are reviewed by the lung-cancer **multidisciplinary team
(MDT)** to coordinate further staging and treatment. NICE NG122 recommends a
multimodality staging pathway (contrast CT, PET-CT, EBUS-TBNA, EUS-FNA, surgical
staging) that the MDT plans early; treatment with curative intent is invariably
multi-modality. This grounds the form's urgent **lung-cancer MDT referral**
behaviour, the `reporting_category` (Axis B) label, and the critical-result
escalation for a suspected tumour.

- National Optimal Lung Cancer Pathway (NOLCP).
  <https://rmpartners.nhs.uk/wp-content/uploads/2024/09/national-optimal-lung-cancer-pathway_v4_01jan2024.pdf>
- NICE NG122 *Lung cancer: diagnosis and management*.
  <https://www.nice.org.uk/guidance/ng122>

## Critical findings and complications

A small number of bronchoscopy findings demand immediate escalation regardless of
report completeness:

- **Suspected endobronchial tumour** → abnormal/critical classification, urgent
  lung-cancer MDT referral (Axis D), `critical-result-alert` and
  `urgent-referral` flags.
- **Massive haemoptysis** (active, significant bleeding) → critical
  classification, critical-alert urgency, `critical-result-alert` flag and
  immediate airway-protection escalation.
- **Procedural pneumothorax** → critical complication, critical-alert urgency,
  `critical-result-alert` flag and urgent imaging / drainage.

These map to the `endobronchial_lesion` and `bleeding` structured findings, the
`complication` field, and the escalation invariant in the grade contract.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| BTS actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| BTS mandatory documentation sections | report-completeness axis (`report_completeness_percent`) |
| BTS critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| BTS diagnostic-sensitivity benchmark | `endobronchial_lesion`, abnormality-severity axis |
| NOLCP / NICE NG122 lung-cancer MDT | `reporting_category` (Axis B), `recommended_follow_up`, `urgent-referral` flag |
| Suspected tumour / massive haemoptysis / pneumothorax | `complication`, escalation invariant, `critical-result-alert` flag |
