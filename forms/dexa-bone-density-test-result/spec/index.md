# DEXA Bone Density Test Result — living spec

Living domain spec for the DEXA bone-density result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `dexa_bone_density_test_result` | Main result/report record (source of truth). |
| `dexa_bone_density_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `dexa_bone_density_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `dexa_bone_density_test_result_grade_flag` | Safety-critical flags. |

## Result record (`dexa_bone_density_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Examination:** `scan_region` (hip / spine / hip-and-spine / forearm /
  whole-body / other), `examination_adequacy` (adequate / limited /
  non-diagnostic).
- **Clinical context:** `clinical_history`.
- **Quantitative findings:** `lumbar_spine_t_score`, `lumbar_spine_z_score`,
  `femoral_neck_t_score`, `femoral_neck_z_score`, `total_hip_t_score`,
  `lowest_t_score`, `bone_mineral_density_g_cm2`.
- **Interpretation:** `who_classification` (normal / osteopenia / osteoporosis /
  severe-osteoporosis).
- **Fracture risk:** `frax_major_fracture_percent`, `frax_hip_fracture_percent`.
- **Structured finding:** `vertebral_fracture_identified`.
- **Comparison:** `comparison_with_previous`, `percent_change_since_previous`.
- **Conclusion:** `impression` (≤2000), `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`dexa_bone_density_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ WHO-class label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### T-score / WHO → axes mapping

The lowest (most negative) T-score drives the WHO densitometric classification,
which is carried in `reporting_category`:

| Lowest T-score | WHO classification | Axis A | Axis D |
| --- | --- | --- | --- |
| T ≥ −1.0 | normal | normal | routine |
| −1.0 > T > −2.5 | osteopenia | abnormal | recommended |
| T ≤ −2.5 | osteoporosis | abnormal | urgent |
| T ≤ −2.5 with vertebral / fragility fracture | severe osteoporosis | abnormal / critical | critical-alert |

### Escalation invariant

If the result describes **severe osteoporosis** (T ≤ −2.5 with a fragility or
vertebral fracture) or `vertebral_fracture_identified` is true, Axis D **must**
be at least `urgent` (escalating to `critical-alert`) and an
`abnormal-requiring-action` / `urgent-referral` flag **must** be present,
irrespective of the other axes.

## Rules and flags

- `dexa_bone_density_test_result_grade_rule`: one row per fired rule with
  `rule_id`, `axis` (classification / severity / completeness / follow-up),
  `category`, `description`. Rule IDs are stable and shared across
  implementations.
- `dexa_bone_density_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
