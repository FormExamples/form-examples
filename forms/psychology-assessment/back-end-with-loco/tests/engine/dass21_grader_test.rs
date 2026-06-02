use psychology_assessment_loco_crate::engine::dass21_grader::{calculate_dass21, grade};
use psychology_assessment_loco_crate::engine::dass21_rules::dass21_rules;
use psychology_assessment_loco_crate::engine::types::*;

/// Build an assessment with every DASS-21 item answered at the given score.
fn dass_at(score: i32) -> AssessmentData {
    let s = Some(score);
    AssessmentData {
        dass_depression: DassDepression {
            item3_could_not_experience_positive: s,
            item5_difficult_initiating: s,
            item10_nothing_to_look_forward_to: s,
            item13_downhearted_blue: s,
            item16_unable_to_become_enthusiastic: s,
            item17_not_worth_much: s,
            item21_life_meaningless: s,
        },
        dass_anxiety: DassAnxiety {
            item2_dryness_of_mouth: s,
            item4_breathing_difficulty: s,
            item7_trembling: s,
            item9_panic_worry: s,
            item15_closed_to_panic: s,
            item19_heart_action_aware: s,
            item20_scared_without_reason: s,
        },
        dass_stress: DassStress {
            item1_hard_to_wind_down: s,
            item6_over_react: s,
            item8_nervous_energy: s,
            item11_agitated_easily: s,
            item12_difficult_to_relax: s,
            item14_intolerant: s,
            item18_touchy_easily: s,
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_case_is_normal_and_unanswered() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.depression.raw, 0);
    assert_eq!(result.depression.scaled, 0);
    assert_eq!(result.depression.answered, 0);
    assert_eq!(result.depression.severity, "normal");
    assert_eq!(result.anxiety.severity, "normal");
    assert_eq!(result.stress.severity, "normal");
    assert!(result.fired_rules.is_empty());
}

#[test]
fn all_zero_responses_are_normal_and_fully_answered() {
    let data = dass_at(0);
    let result = grade(&data);
    assert_eq!(result.depression.raw, 0);
    assert_eq!(result.depression.scaled, 0);
    assert_eq!(result.depression.answered, 7);
    assert_eq!(result.depression.severity, "normal");
    assert_eq!(result.anxiety.severity, "normal");
    assert_eq!(result.stress.severity, "normal");
    assert_eq!(result.fired_rules.len(), 21);
}

#[test]
fn all_threes_are_extremely_severe() {
    let data = dass_at(3);
    let result = grade(&data);
    // Each subscale: raw 21, scaled 42 -> extremely-severe.
    assert_eq!(result.depression.raw, 21);
    assert_eq!(result.depression.scaled, 42);
    assert_eq!(result.depression.severity, "extremely-severe");
    assert_eq!(result.anxiety.severity, "extremely-severe");
    assert_eq!(result.stress.severity, "extremely-severe");
}

#[test]
fn depression_cutoffs_match_dass42_norms() {
    // scaled = 9 -> normal; 10 -> mild; 14 -> moderate; 21 -> severe; 28 -> extremely-severe.
    use psychology_assessment_loco_crate::engine::utils::classify_dass_depression;
    assert_eq!(classify_dass_depression(0), "normal");
    assert_eq!(classify_dass_depression(9), "normal");
    assert_eq!(classify_dass_depression(10), "mild");
    assert_eq!(classify_dass_depression(13), "mild");
    assert_eq!(classify_dass_depression(14), "moderate");
    assert_eq!(classify_dass_depression(20), "moderate");
    assert_eq!(classify_dass_depression(21), "severe");
    assert_eq!(classify_dass_depression(27), "severe");
    assert_eq!(classify_dass_depression(28), "extremely-severe");
}

#[test]
fn anxiety_cutoffs_match_dass42_norms() {
    use psychology_assessment_loco_crate::engine::utils::classify_dass_anxiety;
    assert_eq!(classify_dass_anxiety(7), "normal");
    assert_eq!(classify_dass_anxiety(8), "mild");
    assert_eq!(classify_dass_anxiety(9), "mild");
    assert_eq!(classify_dass_anxiety(10), "moderate");
    assert_eq!(classify_dass_anxiety(14), "moderate");
    assert_eq!(classify_dass_anxiety(15), "severe");
    assert_eq!(classify_dass_anxiety(19), "severe");
    assert_eq!(classify_dass_anxiety(20), "extremely-severe");
}

#[test]
fn stress_cutoffs_match_dass42_norms() {
    use psychology_assessment_loco_crate::engine::utils::classify_dass_stress;
    assert_eq!(classify_dass_stress(14), "normal");
    assert_eq!(classify_dass_stress(15), "mild");
    assert_eq!(classify_dass_stress(18), "mild");
    assert_eq!(classify_dass_stress(19), "moderate");
    assert_eq!(classify_dass_stress(25), "moderate");
    assert_eq!(classify_dass_stress(26), "severe");
    assert_eq!(classify_dass_stress(33), "severe");
    assert_eq!(classify_dass_stress(34), "extremely-severe");
}

#[test]
fn rule_ids_are_unique_and_total_21() {
    let rules = dass21_rules();
    assert_eq!(rules.len(), 21);
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn partially_answered_only_counts_answered_items() {
    let mut data = AssessmentData::default();
    data.dass_depression.item3_could_not_experience_positive = Some(3);
    data.dass_depression.item5_difficult_initiating = Some(2);
    // Other 5 depression items remain None.
    let (depression, anxiety, stress, fired) = calculate_dass21(&data);
    assert_eq!(depression.raw, 5);
    assert_eq!(depression.scaled, 10);
    assert_eq!(depression.answered, 2);
    assert_eq!(depression.severity, "mild");
    assert_eq!(anxiety.answered, 0);
    assert_eq!(stress.answered, 0);
    assert_eq!(fired.len(), 2);
}
