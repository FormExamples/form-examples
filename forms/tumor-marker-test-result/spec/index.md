# Tumor Marker Test Result — living spec

Living domain spec for the serum tumour-marker result (report) form. The schema
in [`../sql/`](../sql) is the source of truth; this spec describes the behaviour
the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `tumor_marker_test_result` | Main result/report record (source of truth). |
| `tumor_marker_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `tumor_marker_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `tumor_marker_test_result_grade_flag` | Safety-critical flags. |

## Result record (`tumor_marker_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Specimen & context:** `specimen_condition` (satisfactory / haemolysed /
  lipaemic / insufficient), `clinical_history`, `known_cancer_site`.
- **Measured values (NUMERIC, `NULL` when not measured):** `psa`, `ca125`,
  `ca19_9`, `carcinoembryonic_antigen_cea`, `alpha_fetoprotein_afp`, `beta_hcg`,
  `ca15_3`, `lactate_dehydrogenase_ldh`, `calcitonin`, `chromogranin_a`.
- **Trend:** `previous_value`, `trend` (rising / stable / falling /
  not-applicable), `comparison_with_previous`.
- **Interpretation:** `overall_result_status` (normal / abnormal / critical),
  `markedly_elevated`, `findings_narrative` (≤2000), `impression` (≤2000),
  `reporting_category`, `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`tumor_marker_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / repeat-marker /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

A **markedly elevated** value or a **rising trend on treatment** sets Axis A to
*abnormal* and escalates Axis D toward *urgent*. A **very high AFP / beta-hCG**
(germ-cell pattern) **must** set Axis D to `critical-alert` and a
`critical-result-alert` flag **must** be present, irrespective of the other axes.

## Rules and flags

- `tumor_marker_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `tumor_marker_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
