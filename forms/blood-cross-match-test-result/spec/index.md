# Blood Cross-Match Test Result — living spec

Living domain spec for the blood cross-match test result (report) form. The
schema in [`../sql/`](../sql) is the source of truth; this spec describes the
behaviour the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `blood_cross_match_test_result` | Main result/report record (source of truth). |
| `blood_cross_match_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `blood_cross_match_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `blood_cross_match_test_result_grade_flag` | Safety-critical flags. |

## Result record (`blood_cross_match_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`,
  `request_type` (group-and-save / crossmatch / antibody-screen / emergency-issue).
- **Clinical context:** `clinical_history`.
- **Grouping:** `abo_group` (a / b / o / ab), `rhd_group` (positive / negative),
  `historical_group_concordant`.
- **Antibody screen:** `antibody_screen_result` (negative / positive),
  `antibodies_identified`.
- **Crossmatch & components:** `crossmatch_result` (compatible / incompatible /
  electronic-issue / not-performed), `component` (red-cells / platelets /
  fresh-frozen-plasma / cryoprecipitate / none), `units_crossmatched`,
  `units_available`, `special_requirements`.
- **Identity safety:** `two_sample_rule_met`.
- **Conclusion:** `overall_result_status` (normal / abnormal / critical),
  `findings_narrative` (≤2000), `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`blood_cross_match_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-testing /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a critical result — an **incompatible crossmatch**,
**clinically-significant antibodies**, an **ABO discrepancy**
(`historical_group_concordant` false), or an **unmet two-sample rule**
(`two_sample_rule_met` false) — then Axis A **must** be `abnormal` or `critical`,
Axis D **must** be `critical-alert`, and `critical-result-alert` plus
`discrepancy-with-request` flags **must** be present, irrespective of the other
axes.

## Rules and flags

- `blood_cross_match_test_result_grade_rule`: one row per fired rule with
  `rule_id`, `axis` (classification / severity / completeness / follow-up),
  `category`, `description`. Rule IDs are stable and shared across
  implementations.
- `blood_cross_match_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
