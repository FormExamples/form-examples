# Hearing Test Result — living spec

Living domain spec for the hearing test result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `hearing_test_result` | Main result/report record (source of truth). |
| `hearing_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `hearing_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `hearing_test_result_grade_flag` | Safety-critical flags. |

## Result record (`hearing_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Examination:** `test_type` (pure-tone-audiometry / tympanometry /
  speech-audiometry / otoacoustic-emissions / auditory-brainstem-response /
  newborn-hearing-screen / other), `test_reliability` (good / fair / poor).
- **Clinical context:** `clinical_history`.
- **Audiometry & interpretation:** `pure_tone_average_right_db`,
  `pure_tone_average_left_db`, `hearing_loss_type_{right,left}` (none /
  conductive / sensorineural / mixed), `hearing_loss_severity_{right,left}`
  (normal / mild / moderate / moderately-severe / severe / profound, BSA
  descriptors), `tympanometry_type_{right,left}` (Jerger A / As / Ad / B / C).
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `hearing_loss_present`, `asymmetric_loss`, `sudden_sensorineural_loss`,
  `conductive_component`, `normal_hearing`.
- **Conclusion:** `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`hearing_test_result_grade`)

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

If the result describes a critical finding — **sudden sensorineural hearing
loss** or **marked asymmetry** (retrocochlear red flag) — Axis D **must** be
`critical-alert` and a `critical-result-alert` flag **must** be present,
irrespective of the other axes.

## Rules and flags

- `hearing_test_result_grade_rule`: one row per fired rule with `rule_id`, `axis`
  (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `hearing_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, sudden-sensorineural-loss,
  asymmetric-loss-retrocochlear, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, unreliable-test,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
