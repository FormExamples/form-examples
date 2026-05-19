# Grading Rules

The grading engine encodes four independent rule sets. Each rule has a
stable identifier (`R-…`) that is persisted to the
`united_kingdom_statement_of_fitness_for_work_grade_rule` audit table.

## Validity rules (R-VALID-…)

Fired before any other rules. Any high-priority validity failure
supersedes the recommendation with `review_for_validity`.

| Rule ID | Trigger | Flag | Priority |
| --- | --- | --- | --- |
| R-VALID-NAME-001 | `clinician.name` empty | `invalid_no_name` | high |
| R-VALID-PROFESSION-001 | `clinician.profession` empty | `invalid_no_profession` | high |
| R-VALID-PRACTICE-001 | `medical_practice.postal_address_as_full_text` empty | `invalid_no_practice_address` | high |
| R-VALID-REASON-001 | `diagnosis.is_non_medical = 'yes'` | `non_medical_reason_detected` | medium |

## Adaptation rules (R-ADAPT-…)

Apply only when `fitness_for_work = 'may_be_fit'`.

| Rule ID | Trigger | Intensity | Notes |
| --- | --- | --- | --- |
| R-ADAPT-NONE-001 | 0 tick boxes selected | `none` | also fires `may_be_fit_no_adaptations` flag |
| R-ADAPT-LIGHT-001 | 1 tick box selected | `light` | typically a phased return |
| R-ADAPT-MOD-001 | 2 tick boxes selected | `moderate` | |
| R-ADAPT-SUB-001 | 3 tick boxes selected | `substantial` | suggests occupational-health referral |
| R-ADAPT-COMP-001 | 4 tick boxes selected | `comprehensive` | suggests occupational-health and Access to Work |
| R-ADAPT-COMMENT-001 | `comments` empty when `may_be_fit` | n/a | fires `may_be_fit_no_comments` flag |

## Period rules (R-PERIOD-…)

Computed from either `period_duration_value + period_duration_unit` or
`period_from + period_to`. The period in days drives classification.

| Rule ID | Trigger | Compliance | Notes |
| --- | --- | --- | --- |
| R-PERIOD-SELF-001 | period < 7 days | `self_cert_range` | fires `self_cert_range` flag |
| R-PERIOD-COMPLIANT-001 | 7 ≤ period ≤ 28 days | `compliant` | |
| R-PERIOD-LONG-001 | 28 < period ≤ 90 days | `long_term` | fires `long_absence_four_weeks` flag |
| R-PERIOD-12W-001 | period > 84 days | n/a | fires `long_absence_twelve_weeks` flag |
| R-PERIOD-MAX-001 | period > 90 days AND first 6 months of condition | `exceeds_initial_max` | fires `duration_exceeds_3_months_in_first_6_months` flag (high) |
| R-PERIOD-VERY-001 | period > 180 days | `very_long_term` | |

## Safety-flag rules (R-SAFE-…)

Independent of the fitness category and adaptation count.

| Rule ID | Trigger | Flag | Priority |
| --- | --- | --- | --- |
| R-SAFE-DISABILITY-001 | diagnosis matches HIV, cancer, MS | `automatic_disability` | medium |
| R-SAFE-MH-001 | `diagnosis.category = 'mental_health'` | `mental_health_condition` | medium |
| R-SAFE-DRIVE-001 | comments regex matches "should not drive" / "must not drive" | `driving_restriction_recommended` | medium |
| R-SAFE-SAFEGUARDING-001 | `safeguarding_concern = 'yes'` | `safeguarding_concern` | high |
| R-SAFE-PRIVATE-001 | `clinician.is_private_practice = 'yes'` | `private_practice` | low |
| R-SAFE-DISCHARGE-001 | `issue_setting = 'secondary_care_discharge'` | `secondary_care_discharge` | medium |
| R-SAFE-NEW-AUTH-001 | `clinician.profession ∈ {nurse, occupational_therapist, pharmacist, physiotherapist}` | `new_authority_hcp` | low |
| R-SAFE-REVIEW-001 | `will_assess_again = 'yes'` | `ongoing_review_required` | low |

## Recommendation table

Recommendation is the worst-severity match of the rules above.

| Recommendation | Driver |
| --- | --- |
| `review_for_validity` | any `invalid_no_*` flag fired |
| `refer_access_to_work` | `automatic_disability` OR `very_long_term` |
| `refer_occupational_health` | `substantial` / `comprehensive` adaptations OR `long_term` |
| `refer_employment_advisor` | period ≥ 12 weeks AND fitness = `not_fit` |
| `standard` | otherwise |

## Test fixtures

Each rule has at least one positive and one negative fixture in
`front-end-form-with-svelte/src/lib/grading/grader.test.ts`.
