# Microbiology Culture Test Result — living spec

Living domain spec for the microbiology culture result (report) form. The schema
in [`../sql/`](../sql) is the source of truth; this spec describes the behaviour
the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `microbiology_culture_test_result` | Main result/report record (source of truth). |
| `microbiology_culture_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `microbiology_culture_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `microbiology_culture_test_result_grade_flag` | Safety-critical flags. |

## Result record (`microbiology_culture_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / interim / final / amended / cancelled), `performed_date`,
  `reported_date`.
- **Specimen:** `specimen_type` (blood-culture / urine / wound-swab / sputum /
  throat-swab / stool / csf / tissue / catheter-tip / genital-swab / other),
  `specimen_site_detail`, `specimen_condition` (satisfactory / contaminated /
  insufficient / delayed).
- **Clinical context:** `clinical_history`.
- **Microscopy & culture:** `gram_stain_result`, `culture_result` (no-growth /
  mixed-growth / significant-growth / positive), `organism_isolated`,
  `second_organism_isolated`, `colony_count`.
- **Sensitivities & resistance:** `antibiotic_sensitivities`, `resistance_mrsa`,
  `resistance_esbl`, `resistance_cpe`.
- **Specialised tests:** `c_difficile_toxin` (positive / negative / not-tested),
  `acid_fast_bacilli` (positive / negative / not-tested), `pcr_result`.
- **Findings & conclusion:** `critical_organism`, `findings_narrative` (≤2000),
  `impression` (≤2000), `reporting_category`, `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`microbiology_culture_test_result_grade`)

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

If the result describes a critical organism — a positive blood culture, a CSF
isolate, a CPE (`resistance_cpe`), or any record where `critical_organism` is
true — Axis D **must** be `critical-alert` and a `critical-result-alert` flag
**must** be present, irrespective of the other axes. This mirrors RCPath
critical-result communication: the result must be actively telephoned to the
requesting / infection team and documented.

## Rules and flags

- `microbiology_culture_test_result_grade_rule`: one row per fired rule with
  `rule_id`, `axis` (classification / severity / completeness / follow-up),
  `category`, `description`. Rule IDs are stable and shared across
  implementations.
- `microbiology_culture_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
