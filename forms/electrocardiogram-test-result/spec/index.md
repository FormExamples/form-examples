# Electrocardiogram Test Result — living spec

Living domain spec for the ECG (electrocardiogram) result (report) form. The
schema in [`../sql/`](../sql) is the source of truth; this spec describes the
behaviour the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `electrocardiogram_test_result` | Main result/report record (source of truth). |
| `electrocardiogram_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `electrocardiogram_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `electrocardiogram_test_result_grade_flag` | Safety-critical flags. |

## Result record (`electrocardiogram_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `ecg_type`
  (resting-12-lead / exercise-stress / ambulatory-holter-24h / ambulatory-48h /
  event-recorder / other), `performed_date`, `reported_date`, `recording_quality`
  (good / adequate / poor).
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Rate, rhythm & intervals:** `ventricular_rate_bpm`, `rhythm`
  (sinus / atrial-fibrillation / atrial-flutter / svt / ventricular-tachycardia /
  heart-block / paced / other), `pr_interval_ms`, `qrs_duration_ms`,
  `qt_interval_ms`, `qtc_ms`, `cardiac_axis` (normal / left-deviation /
  right-deviation).
- **Findings:** structured booleans `st_elevation`, `st_depression`,
  `t_wave_inversion`, `pathological_q_waves`, `left_ventricular_hypertrophy`,
  `bundle_branch_block`, `ischaemia`, `normal_ecg`.
- **Interpretation & conclusion:** `interpretation` (≤2000), `impression`
  (≤2000), `reporting_category`, `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`electrocardiogram_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a critical finding (ST-elevation / STEMI, ventricular
tachycardia, complete heart block, or QTc ≥ 500 ms), Axis D **must** be
`critical-alert` and a `critical-result-alert` flag **must** be present,
irrespective of the other axes.

## Rules and flags

- `electrocardiogram_test_result_grade_rule`: one row per fired rule with
  `rule_id`, `axis` (classification / severity / completeness / follow-up),
  `category`, `description`. Rule IDs are stable and shared across
  implementations.
- `electrocardiogram_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
