# Toxicology Test Result — living spec

Living domain spec for the toxicology result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `toxicology_test_result` | Main result/report record (source of truth). |
| `toxicology_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `toxicology_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `toxicology_test_result_grade_flag` | Safety-critical flags. |

## Result record (`toxicology_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Specimen & context:** `specimen_condition` (satisfactory / insufficient /
  delayed), `clinical_history`, `suspected_agent`, `time_since_ingestion_hours`.
- **Result values:** `paracetamol_level_mg_l`, `salicylate_level_mg_l`,
  `ethanol_level`, `lithium_level_mmol_l`, `digoxin_level`,
  `carboxyhaemoglobin_percent`, `drugs_of_abuse_screen`, `specific_drug_level`.
- **Interpretation:** `paracetamol_nomogram` (above-treatment-line /
  below-treatment-line / not-applicable), `overall_result_status` (normal /
  abnormal / critical), `toxic_level_present`, `findings_narrative` (≤2000).
- **Conclusion:** `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`toxicology_test_result_grade`)

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

If the result describes a toxic level — `paracetamol_nomogram =
above-treatment-line`, or `toxic_level_present`, or `overall_result_status =
critical` — then Axis A **must** be `critical`, Axis D **must** be
`critical-alert` with an urgent antidote action (e.g. start N-acetylcysteine /
NAC for paracetamol), and a `critical-result-alert` flag **must** be present,
irrespective of the other axes.

## Rules and flags

- `toxicology_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `toxicology_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
