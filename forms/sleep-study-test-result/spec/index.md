# Sleep Study Test Result — living spec

Living domain spec for the sleep study result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics (with BMI and neck circumference). |
| `clinician` | Reporting clinician (report author/signer). |
| `sleep_study_test_result` | Main result/report record (source of truth). |
| `sleep_study_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `sleep_study_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `sleep_study_test_result_grade_flag` | Safety-critical flags. |

## Result record (`sleep_study_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Study:** `study_type` (home-sleep-apnoea-test / polysomnography /
  overnight-oximetry / multiple-sleep-latency-test / actigraphy / other),
  `study_adequacy` (adequate / limited / failed).
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Metrics:** `total_recording_time_hours`, `total_sleep_time_hours`,
  `apnoea_hypopnoea_index` (AHI), `oxygen_desaturation_index` (ODI),
  `minimum_spo2_percent`, `time_below_90_percent_spo2` (T90),
  `mean_heart_rate_bpm`.
- **Interpretation:** `osa_severity` (none / mild / moderate / severe).
- **Findings:** structured booleans `obstructive_sleep_apnoea`,
  `central_sleep_apnoea`, `periodic_limb_movements`, `nocturnal_hypoventilation`,
  `significant_desaturation`, `normal_study`; `findings_narrative` (≤2000).
- **Conclusion:** `impression` (≤2000), `reporting_category` (AHI-band label),
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`sleep_study_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ AHI-band label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a critical finding — severe OSA (AHI ≥ 30) with
significant desaturation, or nocturnal hypoventilation — Axis D **must** be
`critical-alert`, the recommendation an urgent CPAP / ventilation review, and a
`critical-result-alert` flag **must** be present, irrespective of the other axes.
Occupational-driver (DVLA) implications are noted for severe daytime-sleepiness /
severe OSA results.

## Rules and flags

- `sleep_study_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `sleep_study_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
