# Echocardiogram Test Result — living spec

Living domain spec for the echocardiogram result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `echocardiogram_test_result` | Main result/report record (source of truth). |
| `echocardiogram_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `echocardiogram_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `echocardiogram_test_result_grade_flag` | Safety-critical flags. |

## Result record (`echocardiogram_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `echo_type` (transthoracic-tte /
  transoesophageal-toe / stress-echo / contrast-echo / other), `report_status`
  (preliminary / final / amended / cancelled), `study_quality` (good / adequate
  / limited / poor), `performed_date`, `reported_date`.
- **Clinical context:** `clinical_history`.
- **LV function & dimensions:** `lv_ejection_fraction_percent`, `lv_function`
  (normal / mildly-impaired / moderately-impaired / severely-impaired),
  `lv_internal_diameter_diastole_mm`.
- **Valves:** `aortic_stenosis`, `aortic_regurgitation`, `mitral_stenosis`,
  `mitral_regurgitation` (none / mild / moderate / severe).
- **Pulmonary pressure:** `pulmonary_artery_systolic_pressure_mmhg`.
- **Structured findings:** `lv_hypertrophy`, `regional_wall_motion_abnormality`,
  `pericardial_effusion`, `vegetation`, `intracardiac_thrombus`, `normal_study`.
- **Findings & conclusion:** `findings_narrative` (≤2000),
  `comparison_with_previous`, `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`echocardiogram_test_result_grade`)

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

If the result describes a critical finding (severe valve disease, vegetation /
suspected endocarditis, large pericardial effusion or tamponade, severe LV
impairment, intracardiac thrombus), Axis D **must** be `critical-alert` and a
`critical-result-alert` flag **must** be present, irrespective of the other axes.

## Rules and flags

- `echocardiogram_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `echocardiogram_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, severe-valve-disease, suspected-endocarditis,
  pericardial-effusion-tamponade, severe-lv-impairment, intracardiac-thrombus,
  discrepancy-with-request, abnormal-requiring-action, urgent-referral,
  limited-study-quality, unexpected-finding, missing-impression,
  missing-measurement, other), `priority` (low / medium / high), `description`,
  `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
