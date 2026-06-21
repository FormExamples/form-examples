# Colonoscopy Test Result — living spec

Living domain spec for the colonoscopy result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician / endoscopist (report author/signer). |
| `colonoscopy_test_result` | Main result/report record (source of truth). |
| `colonoscopy_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `colonoscopy_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `colonoscopy_test_result_grade_flag` | Safety-critical flags. |

## Result record (`colonoscopy_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Procedure:** `procedure` (colonoscopy / flexible-sigmoidoscopy /
  ct-colonography / other), `extent_reached` (caecum / terminal-ileum /
  hepatic-flexure / splenic-flexure / descending-colon / rectum-sigmoid /
  incomplete), `bowel_preparation_quality` (excellent / good / adequate / poor),
  `sedation_used`.
- **Clinical context:** `clinical_history`.
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `polyps_found`, `mass_lesion`, `diverticulosis`, `inflammation_ibd`,
  `angiodysplasia`, `bleeding_source_identified`, `normal_examination`.
- **Polyps & tissue:** `polyp_count`, `largest_polyp_mm`, `biopsy_taken`,
  `polypectomy_performed`, `complication` (none / bleeding / perforation / other).
- **Conclusion:** `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`colonoscopy_test_result_grade`)

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

If the result describes a critical finding (e.g. obstructing or suspicious mass,
or perforation), Axis D **must** be `critical-alert` and a
`critical-result-alert` flag **must** be present, irrespective of the other axes.

## Rules and flags

- `colonoscopy_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `colonoscopy_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
