# Urinalysis Test Result — living spec

Living domain spec for the urinalysis result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `urinalysis_test_result` | Main result/report record (source of truth). |
| `urinalysis_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `urinalysis_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `urinalysis_test_result_grade_flag` | Safety-critical flags. |

## Result record (`urinalysis_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Specimen:** `specimen_type` (midstream / catheter / clean-catch / 24h /
  random), `specimen_condition` (satisfactory / contaminated / insufficient /
  delayed).
- **Clinical context:** `clinical_history`.
- **Dipstick:** `leucocytes`, `nitrites`, `protein`, `blood`, `glucose`,
  `ketones`, `bilirubin` (each negative / trace / 1+ / 2+ / 3+, or
  negative / positive for nitrites), `ph` and `specific_gravity` (numeric).
- **Microscopy:** `red_cell_count`, `white_cell_count`, `epithelial_cells`,
  `casts`, `organisms_seen` (boolean), `crystals`.
- **Culture:** `culture_result` (no-growth / mixed-growth-likely-contaminant /
  significant-growth), `organism_isolated`, `colony_count_cfu_ml`,
  `antibiotic_sensitivities`.
- **Interpretation:** `overall_result_status` (normal / abnormal / critical),
  `findings_narrative` (≤2000), `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`urinalysis_test_result_grade`)

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

If the result describes a critical finding (significant growth in pregnancy, a
critical organism, or findings suggesting urosepsis / visible haematuria), Axis D
**must** be `critical-alert` and a `critical-result-alert` flag **must** be
present, irrespective of the other axes.

## Rules and flags

- `urinalysis_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `urinalysis_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
