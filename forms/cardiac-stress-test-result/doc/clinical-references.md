# Cardiac Stress Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
cardiac stress / exercise tests. These sources anchor the four-axis
interpretation grade, the Duke-treadmill-score risk stratification, and the
critical-result alerting rules used by this form.

## Exercise-testing standards and prognosis

### ACC/AHA Guidelines for Exercise Testing

The ACC/AHA exercise-testing guidelines define how an exercise test is conducted,
when it must be **terminated**, and how its results are used for **prognosis**.
Key principles relevant to this form:

- **Test termination and exertional hypotension** — a fall in systolic blood
  pressure of more than 10 mmHg below baseline despite an increasing workload,
  when accompanied by other evidence of ischaemia, is an *absolute* indication
  to stop the test. This maps to the form's `blood_pressure_response`
  (`hypotensive`), `terminated_early`, and `reason_for_termination` fields and
  drives the `critical-result-alert` flag.
- **Prognostic interpretation** — exercise testing is used not only to detect
  ischaemia but to risk-stratify the patient, which underpins the result
  classification (Axis A) and severity / structured-reporting (Axis B) axes.
- **Adequacy** — an adequate exercise test reaches ≥85% of the age-predicted
  maximum heart rate; submaximal or uninterpretable tests are recorded as
  inconclusive (`test_inconclusive`, `percent_predicted_heart_rate`).

Source:

- ACC/AHA 2002 Guideline Update for Exercise Testing.
  <https://www.ahajournals.org/doi/10.1161/01.cir.0000034670.06526.15>
- ACC/AHA Guidelines for Exercise Testing (executive summary).
  <https://www.ahajournals.org/doi/10.1161/01.CIR.96.1.345>

## Risk stratification

### Duke treadmill score

The Duke treadmill score (DTS) is a validated point system that predicts
five-year mortality from a treadmill ECG exercise test. It combines three
measured terms:

```
DTS = exercise time (minutes) − (5 × maximal ST deviation in mm) − (4 × angina index)
```

where the angina index is 0 (no angina), 1 (non-limiting angina), or 2 (exercise-
limiting angina), and ST deviation is the maximal change (depression or
elevation) in any lead except aVR. The score ranges from about **−25 (highest
risk)** to **+15 (lowest risk)** and defines three risk bands:

| Risk band | Score | Approx. 5-year survival |
| --- | --- | --- |
| Low risk | ≥ +5 | ~97% |
| Intermediate risk | −10 to +4 | ~90% |
| High risk | ≤ −11 | ~65% |

The score is stored in `duke_treadmill_score`; its risk band is captured in the
grade's `reporting_category` (Axis B). A **high-risk** Duke score is treated as
a critical result: it auto-escalates the follow-up-urgency axis (Axis D) to
`critical-alert` and raises the `critical-result-alert` flag.

Source:

- Mark DB et al. Use of a Prognostic Treadmill Score in Identifying Diagnostic
  Coronary Disease Subgroups, *Circulation*, 1998;98:1622–1630.
  <https://www.ahajournals.org/doi/10.1161/01.cir.98.16.1622>

### ESC chronic coronary syndromes and multimodality AUC (context)

ESC and ACC/AHA guidance place exercise ECG and stress imaging within the
diagnostic and risk-assessment pathway for chronic coronary disease; the
selected test type (`test_type`) and the structured findings feed the result
classification and severity axes.

- 2024 ESC Guidelines for the management of chronic coronary syndromes.
  <https://academic.oup.com/eurheartj/article/45/36/3415/7743115>
- ACC/AHA/ASE/ASNC/.../STS 2023 Multimodality Appropriate Use Criteria for the
  Detection and Risk Assessment of Chronic Coronary Disease.
  <https://www.jacc.org/doi/10.1016/j.jacc.2023.03.410>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| ACC/AHA test termination / exertional hypotension | `blood_pressure_response`, `terminated_early`, `reason_for_termination`, `critical-result-alert` flag |
| ACC/AHA prognostic interpretation | `result_classification` (Axis A), `abnormality_severity` (Axis B) |
| ACC/AHA adequacy (≥85% predicted HR) | `percent_predicted_heart_rate`, `test_inconclusive` |
| Duke treadmill score | `duke_treadmill_score`, `reporting_category` (Axis B risk band) |
| RCR / ACC/AHA actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| Mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| Critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
