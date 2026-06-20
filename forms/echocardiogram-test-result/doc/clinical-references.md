# Echocardiogram Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
echocardiogram (echo) studies. These sources anchor the four-axis interpretation
grade, the structured-reporting categories, and the critical-result alerting
rules used by this form.

## Reporting standards and minimum dataset

### BSE — minimum dataset for adult transthoracic echocardiography

The British Society of Echocardiography (BSE) minimum-dataset guideline outlines
the minimum dataset required to confirm normal cardiac structure and function
when performing a comprehensive standard adult transthoracic echocardiogram, and
is structured according to the recommended sequence of acquisition. It specifies
that the report should include patient height, weight, body surface area, heart
rate, and blood pressure, and that a comment should be made when rhythm, heart
rate, or blood pressure are likely to influence parameters of function.

Key principles relevant to this form:

- **Mandatory report sections** — clinical history, left-ventricular function,
  the four cardiac valves, pulmonary pressures, narrative findings, and an
  impression/conclusion. The report-completeness axis scores presence of these
  sections.
- **Study quality** — acoustic windows and image quality directly affect the
  diagnostic value of a study; a limited or poor study maps to the
  `study_quality` field, the `limited-study-quality` flag, and an *inconclusive*
  classification.
- **Communication of critical / urgent findings** — the report must record that
  such a finding was communicated and to whom; this drives the
  `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- A practical guideline for performing a comprehensive transthoracic
  echocardiogram in adults: the British Society of Echocardiography minimum
  dataset (*Echo Research & Practice*, 2020).
  <https://pubmed.ncbi.nlm.nih.gov/33112828/>
- A minimum dataset for a standard adult transthoracic echocardiogram: a
  guideline protocol from the British Society of Echocardiography.
  <https://echo.biomedcentral.com/articles/10.1530/ERP-14-0079>
- British Society of Echocardiography — protocols and reporting guidance.
  <https://www.bsecho.org/>

## Chamber quantification and severity grading

### ASE / EACVI — Recommendations for cardiac chamber quantification

The 2015 American Society of Echocardiography (ASE) and European Association of
Cardiovascular Imaging (EACVI) recommendations provide updated normal values for
all four cardiac chambers, compiled from considerably larger numbers of normal
subjects than previous guidance. For left-ventricular ejection fraction (LVEF)
they recommend sex-specific lower limits of normal (males <52 %, females <54 %),
and they define the quantitative basis for grading LV systolic function as
normal, mildly, moderately, or severely impaired. These thresholds underpin the
form's `lv_ejection_fraction_percent`, `lv_function`,
`lv_internal_diameter_diastole_mm`, and the abnormality-severity axis.

Sources:

- Recommendations for Cardiac Chamber Quantification by Echocardiography in
  Adults: An Update from the ASE and the EACVI (2015).
  <https://www.asecho.org/wp-content/uploads/2016/02/2015_ChamberQuantificationREV.pdf>
- Cardiac Chamber Quantification by Echo in Adults — ASE guideline index.
  <https://www.asecho.org/guideline/cardiac-chamber-quantification-by-echo-in-adults/>
- Normal reference intervals for cardiac dimensions and function for use in
  echocardiographic practice — a guideline from the British Society of
  Echocardiography. <https://pmc.ncbi.nlm.nih.gov/articles/PMC7040881/>

### Valve-disease severity and critical findings

Valvular stenosis and regurgitation are graded none / mild / moderate / severe
following recognised echocardiographic conventions; severe valve disease, a
valvular vegetation (suspected infective endocarditis), a large pericardial
effusion or tamponade physiology, severe LV impairment, and intracardiac
thrombus are treated as **critical findings** that auto-escalate the follow-up
urgency axis and raise dedicated safety flags.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| BSE mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| BSE study-quality guidance | `study_quality`, `limited-study-quality` flag |
| BSE critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| ASE/EACVI LVEF cut-offs | `lv_ejection_fraction_percent`, `lv_function`, `severe-lv-impairment` flag |
| ASE/EACVI chamber dimensions | `lv_internal_diameter_diastole_mm`, `lv_hypertrophy` |
| Valve-disease severity grading | `aortic_stenosis`, `aortic_regurgitation`, `mitral_stenosis`, `mitral_regurgitation`, `severe-valve-disease` flag |
| Endocarditis / thrombus / effusion | `vegetation`, `intracardiac_thrombus`, `pericardial_effusion`, and their flags |
