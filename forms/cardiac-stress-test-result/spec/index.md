# Cardiac Stress Test Result — living spec

Living domain spec for the cardiac stress / exercise test result (report) form.
The schema in [`../sql/`](../sql) is the source of truth; this spec describes the
behaviour the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `cardiac_stress_test_result` | Main result/report record (source of truth). |
| `cardiac_stress_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `cardiac_stress_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `cardiac_stress_test_result_grade_flag` | Safety-critical flags. |

## Result record (`cardiac_stress_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Examination:** `test_type` (exercise-treadmill-ecg / stress-echo /
  dobutamine-stress-echo / myocardial-perfusion-spect / stress-cardiac-mri /
  other), `protocol`.
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Haemodynamic & exercise response:** `maximum_heart_rate_bpm`,
  `percent_predicted_heart_rate`, `exercise_duration_minutes`, `mets_achieved`,
  `peak_blood_pressure`, `blood_pressure_response` (normal / hypertensive /
  hypotensive / flat).
- **Findings:** structured booleans `ischaemic_st_changes`, `chest_pain_induced`,
  `arrhythmia_induced`, `terminated_early`, `test_positive`, `test_negative`,
  `test_inconclusive`, plus `reason_for_termination`.
- **Prognostic score:** `duke_treadmill_score` (≈ −25 … +15).
- **Conclusion:** `impression` (≤2000), `reporting_category` (risk label),
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`cardiac_stress_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ risk label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result is a critical result (strongly positive test, exertional
hypotension, ischaemia at low workload, or a high-risk Duke treadmill score),
Axis D **must** be `critical-alert` and a `critical-result-alert` flag **must**
be present, irrespective of the other axes.

## Rules and flags

- `cardiac_stress_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `cardiac_stress_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
