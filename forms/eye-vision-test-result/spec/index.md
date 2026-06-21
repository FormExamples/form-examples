# Eye Vision Test Result — living spec

Living domain spec for the eye vision test result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `eye_vision_test_result` | Main result/report record (source of truth). |
| `eye_vision_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `eye_vision_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `eye_vision_test_result_grade_flag` | Safety-critical flags. |

## Result record (`eye_vision_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `test_type` (visual-acuity /
  visual-fields / refraction / fundus-examination / optical-coherence-tomography /
  fluorescein-angiography / tonometry / slit-lamp / orthoptic-assessment /
  other), `performed_date`, `reported_date`.
- **Clinical context:** `clinical_history`.
- **Measurements:** `visual_acuity_right`, `visual_acuity_left` (text, e.g. 6/6),
  `intraocular_pressure_right_mmhg`, `intraocular_pressure_left_mmhg` (numeric,
  mmHg), `visual_field_result` (full / defect-right / defect-left /
  bilateral-defect).
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `reduced_visual_acuity`, `visual_field_defect`, `raised_intraocular_pressure`,
  `diabetic_retinopathy`, `optic_disc_abnormality`, `macular_abnormality`,
  `normal_examination`, plus `retinopathy_grade` (none / background /
  pre-proliferative / proliferative / maculopathy / not-applicable).
- **Conclusion:** `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`eye_vision_test_result_grade`)

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

If the result describes a critical finding (sudden visual loss, acutely raised
intraocular pressure, signs of giant cell arteritis, retinal detachment, or
proliferative diabetic retinopathy), Axis D **must** be `critical-alert`, the
`recommendation` **must** be `urgent-review` (urgent ophthalmology), and a
`critical-result-alert` flag **must** be present, irrespective of the other
axes.

## Rules and flags

- `eye_vision_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `eye_vision_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
