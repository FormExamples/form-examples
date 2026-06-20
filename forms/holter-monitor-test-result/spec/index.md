# Holter Monitor Test Result — living spec

Living domain spec for the Holter monitor result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `holter_monitor_test_result` | Main result/report record (source of truth). |
| `holter_monitor_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `holter_monitor_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `holter_monitor_test_result_grade_flag` | Safety-critical flags. |

## Result record (`holter_monitor_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `monitor_type`
  (24-hour / 48-hour / 7-day / 14-day / event-recorder /
  implantable-loop-recorder / other), `performed_date`, `reported_date`.
- **Recording quality:** `recording_duration_hours`, `analysed_percent`.
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Rhythm & rate summary:** `predominant_rhythm`
  (sinus / atrial-fibrillation / paced / other), `mean_heart_rate_bpm`,
  `minimum_heart_rate_bpm`, `maximum_heart_rate_bpm`, `longest_pause_seconds`,
  `ventricular_ectopic_percent`, `supraventricular_ectopic_percent`.
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `atrial_fibrillation_detected`, `significant_pauses`,
  `ventricular_tachycardia`, `supraventricular_tachycardia`,
  `high_grade_av_block`, `symptom_rhythm_correlation`, `normal_study`.
- **Conclusion:** `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`holter_monitor_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-monitoring /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a critical finding — ventricular tachycardia, a pause
> 3 seconds, high-grade (Mobitz II / third-degree) AV block, or fast atrial
fibrillation — Axis D **must** be `critical-alert` and a `critical-result-alert`
flag **must** be present, irrespective of the other axes.

## Rules and flags

- `holter_monitor_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `holter_monitor_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-recording,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
