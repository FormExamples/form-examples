# Colonoscopy Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
colonoscopy (lower-GI endoscopy) procedures. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting standards and quality indicators

### BSG / ACPGBI / JAG — colonoscopy key performance indicators and quality standards

The British Society of Gastroenterology (BSG), the Association of Coloproctology
of Great Britain and Ireland (ACPGBI), and the Joint Advisory Group on
Gastrointestinal Endoscopy (JAG) define the UK key performance indicators (KPIs)
and quality-assurance standards for colonoscopy. These standards exist to ensure
high-quality procedures and to minimize the risk of missed pathology and interval
cancers.

Key indicators relevant to this form:

- **Caecal intubation rate (completeness)** — a target rate of ≥90 %, with an
  aspirational 95 %. Documentation of caecal landmarks or the terminal ileum is
  expected. This maps to `extent_reached` (caecum / terminal-ileum vs incomplete)
  and the report-completeness axis.
- **Bowel-preparation quality** — adequacy of preparation governs whether the
  examination is diagnostic; poor preparation maps to `bowel_preparation_quality`
  and may raise an `inadequate-technique` flag.
- **Polyp detection and retrieval** — polyp detection rate and retrieval rate are
  KPIs; the form captures `polyps_found`, `polyp_count`, `largest_polyp_mm`,
  `biopsy_taken`, and `polypectomy_performed`.
- **Actionable reporting and critical-finding communication** — a report should
  address the clinical question and communicate critical / urgent findings; this
  drives `impression`, `recommended_follow_up`, `critical_result_communicated`,
  `reported_to`, and the `critical-result-alert` safety flag.

Sources:

- UK key performance indicators and quality assurance standards for colonoscopy.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC5136732/>
- Expert opinions and scientific evidence for colonoscopy key performance
  indicators.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC5136701/>
- BSG Endoscopy Quality Improvement Programme (EQIP): overview and progress.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6540284/>

## Structured-reporting categories and surveillance

### BSG / ACPGBI / PHE polyp-surveillance guidelines (2020)

The BSG, ACPGBI, and Public Health England (PHE) jointly publish post-polypectomy
and post-colorectal-cancer-resection surveillance guidelines. They provide an
evidence-based framework for surveillance colonoscopy intervals in people aged 18
and over. The risk stratification (number and size of adenomas, dysplasia) is an
example of the value the form stores in the grade's `reporting_category` field
and drives `recommended_follow_up`.

Key intervals relevant to the form:

- A **3-year surveillance interval** for patients with 5–10 adenomas < 10 mm or
  any adenoma ≥ 10 mm.
- Patients with 1–4 adenomas < 10 mm with low-grade dysplasia return to the
  screening programme rather than to endoscopic surveillance.
- Post-CRC-resection patients undergo a 1-year clearance colonoscopy, then a
  surveillance colonoscopy after a further 3 years.

These underpin `polyp_count`, `largest_polyp_mm`, `reporting_category`, and
`recommended_follow_up`.

- Polyp & colonoscopy surveillance guidelines: BSG / ACPGBI / PHE.
  <https://www.bsg.org.uk/clinical-resource/list-of-recommendations/>
- Summary and comparison of recently updated post-polypectomy surveillance
  guidelines.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10626009/>

## Critical and unexpected findings

A mass lesion suspicious for malignancy, an obstructing lesion, or a procedural
perforation are critical findings: they classify the result as `abnormal` or
`critical`, auto-escalate the follow-up-urgency axis to `critical-alert`
(typically an urgent MDT / colorectal-surgical referral), and raise the
`critical-result-alert` safety flag. The report must record that the finding was
communicated and to whom (`critical_result_communicated`, `reported_to`).

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| BSG / JAG caecal intubation KPI | `extent_reached`, report-completeness axis |
| BSG / JAG bowel-prep adequacy | `bowel_preparation_quality`, `inadequate-technique` flag |
| BSG / JAG polyp detection / retrieval | `polyps_found`, `polyp_count`, `largest_polyp_mm`, `biopsy_taken`, `polypectomy_performed` |
| BSG actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| BSG critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| BSG / ACPGBI / PHE polyp surveillance | `reporting_category` (Axis B), `recommended_follow_up` |
