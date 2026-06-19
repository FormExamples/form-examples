# Ultrasound Test Result — living spec

Living domain spec for the general (non-obstetric) ultrasound result (report)
form. The schema in [`../sql/`](../sql) is the source of truth; this spec
describes the behaviour the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `ultrasound_test_result` | Main result/report record (source of truth). |
| `ultrasound_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `ultrasound_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `ultrasound_test_result_grade_flag` | Safety-critical flags. |

## Result record (`ultrasound_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Examination:** `body_region` (abdomen / pelvis / renal-tract / liver-biliary
  / thyroid-neck / scrotum-testes / breast / soft-tissue / vascular-doppler /
  dvt-leg / carotid / msk-joint / other), `laterality`
  (left / right / bilateral / not-applicable), `examination_adequacy`
  (adequate / limited-body-habitus / non-diagnostic).
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `mass_or_lesion`, `cyst`, `gallstones`, `hydronephrosis`, `free_fluid`,
  `dvt_present`, `aneurysm`, `organ_enlargement`, `incidental_finding`.
- **Measurements:** `largest_lesion_size_mm`.
- **Conclusion:** `impression` (≤2000), `reporting_category` (free-text
  structured-reporting label, e.g. TI-RADS / breast U-classification),
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`ultrasound_test_result_grade`)

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

If the result describes a critical finding (DVT present, ruptured / large AAA,
sonographic signs of testicular torsion), Axis D **must** be `critical-alert`
and a `critical-result-alert` flag **must** be present, irrespective of the
other axes.

## Rules and flags

- `ultrasound_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `ultrasound_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
