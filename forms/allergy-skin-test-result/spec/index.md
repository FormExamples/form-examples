# Allergy Skin Test Result — living spec

Living domain spec for the allergy skin test result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `allergy_skin_test_result` | Main result/report record (source of truth). |
| `allergy_skin_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `allergy_skin_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `allergy_skin_test_result_grade_flag` | Safety-critical flags. |

## Result record (`allergy_skin_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `test_type` (skin-prick-test / intradermal-test
  / patch-test / specific-ige-blood / drug-provocation-challenge / other),
  `report_status` (preliminary / final / amended / cancelled), `performed_date`,
  `reported_date`.
- **Clinical context:** `clinical_history`.
- **Validity controls:** `antihistamines_withheld`, `positive_control_valid`.
- **Allergens and reactions:** `allergens_tested`, `wheal_sizes`,
  `specific_ige_results`, `sensitised_allergens`.
- **Structured summary:** `positive_reactions`, `sensitisation_confirmed`,
  `anaphylaxis_during_test`, `all_negative`, `test_invalid`.
- **Conclusion:** `interpretation` (≤2000), `impression` (≤2000),
  `reporting_category`.
- **Follow-up:** `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`allergy_skin_test_result_grade`)

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

### Classification and escalation invariant

- Clinically relevant **sensitisation** (`sensitisation_confirmed`) classifies the
  result as **abnormal**.
- **Anaphylaxis during the test** (`anaphylaxis_during_test`) classifies the
  result as **critical**, forces Axis D to `critical-alert`, and a
  `critical-result-alert` flag **must** be present, irrespective of the other axes.
- An **invalid test** (`test_invalid`) classifies the result as **inconclusive**.

## Rules and flags

- `allergy_skin_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `allergy_skin_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, anaphylaxis-during-test, clinically-relevant-sensitisation,
  discrepancy-with-request, abnormal-requiring-action, urgent-referral,
  invalid-test, unexpected-finding, missing-impression, missing-measurement,
  other), `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
