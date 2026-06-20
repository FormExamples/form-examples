# Coagulation Test Result — living spec

Living domain spec for the coagulation test result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `coagulation_test_result` | Main result/report record (source of truth). |
| `coagulation_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `coagulation_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `coagulation_test_result_grade_flag` | Safety-critical flags. |

## Result record (`coagulation_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Specimen & context:** `specimen_condition` (satisfactory / clotted /
  underfilled / haemolysed / insufficient), `clinical_history`,
  `on_anticoagulant`, `anticoagulant_agent`.
- **Result values:** `prothrombin_time_seconds`, `inr`,
  `activated_partial_thromboplastin_time_seconds`, `aptt_ratio`,
  `fibrinogen_g_l`, `d_dimer`, `thrombin_time_seconds`, `factor_assays`.
- **Findings:** `findings_narrative` (≤2000), `overall_result_status`
  (normal / abnormal / critical), `critical_value_present`,
  `critical_value_detail`.
- **Comparison:** `comparison_with_previous`, `reporting_category`.
- **Conclusion:** `impression` (≤2000), `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`coagulation_test_result_grade`)

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

If the result has `critical_value_present` (e.g. INR > 8, fibrinogen < 1.0 g/L,
or a DIC picture), Axis D **must** be `critical-alert` and a
`critical-result-alert` flag **must** be present, irrespective of the other axes.

## Rules and flags

- `coagulation_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `coagulation_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, specimen-quality-issue,
  unexpected-finding, missing-impression, missing-result-value, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
