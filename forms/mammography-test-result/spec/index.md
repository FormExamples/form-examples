# Mammography Test Result — living spec

Living domain spec for the mammography result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `mammography_test_result` | Main result/report record (source of truth; carries the BI-RADS category). |
| `mammography_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `mammography_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `mammography_test_result_grade_flag` | Safety-critical flags. |

## Result record (`mammography_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Examination:** `exam_type` (screening / diagnostic / symptomatic /
  surveillance / other), `laterality` (left / right / bilateral),
  `examination_adequacy` (adequate / limited / non-diagnostic), `breast_density`
  (a / b / c / d — ACR composition).
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Findings:** `findings_narrative` (≤2000), plus structured booleans `mass`,
  `calcifications`, `architectural_distortion`, `asymmetry`,
  `skin_or_nipple_change`, `lymphadenopathy`, `incidental_finding`.
- **Measurements:** `largest_lesion_size_mm`.
- **Conclusion:** `impression` (≤2000), `bi_rads_category`
  (0 / 1 / 2 / 3 / 4a / 4b / 4c / 5 / 6 — the key structured score),
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`mammography_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ BI-RADS label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### BI-RADS → axes mapping

`reporting_category` carries the BI-RADS final assessment category, which maps to
Axis A and Axis D:

| BI-RADS | Axis A classification | Axis D follow-up urgency |
| --- | --- | --- |
| 0 | inconclusive | recommended (further imaging) |
| 1, 2 | normal | routine |
| 3 | abnormal | recommended (short-interval follow-up) |
| 4a, 4b | abnormal | urgent (biopsy referral) |
| 4c, 5 | critical | urgent (biopsy referral) |
| 6 | abnormal (known malignancy) | recommended |

### Escalation invariant

If `bi_rads_category` is 4 (any subdivision) or 5, Axis D **must** be at least
`urgent` and the `abnormal-requiring-action` and `urgent-referral` flags **must**
be present, irrespective of the other axes. An unexpected significant finding
auto-escalates Axis D to `critical-alert` and raises a `critical-result-alert`
flag.

## Rules and flags

- `mammography_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `mammography_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
