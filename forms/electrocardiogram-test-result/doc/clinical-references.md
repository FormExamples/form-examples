# Electrocardiogram Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
ECG (electrocardiogram) examinations. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting and interpretation standards

### AHA/ACCF/HRS — Standardization and Interpretation of the Electrocardiogram

The AHA/ACCF/HRS *Recommendations for the Standardization and Interpretation of
the Electrocardiogram* provide a standardized vocabulary of diagnostic
statements and modifiers and define the technical recording conventions for the
standard 12-lead ECG (ten electrodes; 10 mm/mV amplitude; 25 mm/s; 5–10 s
duration). They underpin the form's structured findings, the `interpretation`
narrative, the `reporting_category` label, and the report-completeness axis.

Key principles relevant to this form:

- **Standardized interpretation statements** — a finite, consistent diagnostic
  vocabulary (rhythm, conduction, chamber enlargement, ischaemia/infarction).
  This maps to the structured finding booleans and the `reporting_category`
  field.
- **Mandatory report content** — rate, rhythm, intervals (PR / QRS / QT/QTc),
  axis, and an overall interpretation. The report-completeness axis scores
  presence of these mandatory elements.
- **Communication of critical findings** — acute ischaemia/infarction and
  malignant arrhythmia require timely communication; this drives the
  `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- Recommendations for the Standardization and Interpretation of the
  Electrocardiogram (AHA/ACCF/HRS), *Circulation*.
  <https://www.ahajournals.org/doi/10.1161/circulationaha.106.180200>
- AHA/ACCF/HRS Recommendations Part VI: Acute Ischemia/Infarction, *JACC*.
  <https://www.jacc.org/doi/10.1016/j.jacc.2008.12.016>

## Acute ischaemia / STEMI criteria

### Fourth Universal Definition of Myocardial Infarction (2018)

ST-segment-elevation myocardial infarction (STEMI) is defined by new ST-segment
elevation at the J point in at least two contiguous leads: ≥ 1 mm in leads other
than V2–V3, and age- and sex-specific thresholds in V2–V3 (≥ 1.5 mm in women,
≥ 2.5 mm in men < 40 years, ≥ 2 mm in men ≥ 40 years), in the absence of left
ventricular hypertrophy and bundle branch block. This underpins the
`st_elevation` structured flag and the critical-result auto-escalation rule.

- Fourth Universal Definition of Myocardial Infarction (2018), *Circulation*.
  <https://www.ahajournals.org/doi/10.1161/CIR.0000000000000617>
- Acute ST-Segment Elevation Myocardial Infarction (STEMI) — StatPearls / NCBI
  Bookshelf.
  <https://www.ncbi.nlm.nih.gov/books/NBK532281/>

## QT / QTc prolongation

A normal QTc is generally < 450 ms in men and < 460 ms in women. A QTc ≥ 500 ms
(or an increase of > 60 ms from baseline) is markedly prolonged and confers a
substantially increased risk of torsades de pointes; this threshold underpins
the critical-result auto-escalation for prolonged QTc. The Bazett correction
(QTc = QT / √RR) is the most widely used in clinical practice.

- QT interval — LITFL ECG library.
  <https://litfl.com/qt-interval-ecg-library/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| AHA/ACCF/HRS standardized statements | `rhythm`, `cardiac_axis`, structured finding booleans, `reporting_category` |
| AHA/ACCF/HRS mandatory report content | report-completeness axis (`report_completeness_percent`); `ventricular_rate_bpm`, `pr_interval_ms`, `qrs_duration_ms`, `qt_interval_ms`, `qtc_ms` |
| AHA/ACCF/HRS Part VI acute ischaemia | `st_elevation`, `st_depression`, `t_wave_inversion`, `ischaemia` |
| Fourth Universal Definition of MI (STEMI) | `st_elevation`; critical-result auto-escalation |
| QTc ≥ 500 ms torsades risk | `qtc_ms`; critical-result auto-escalation |
| Critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
