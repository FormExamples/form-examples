use learning_disability_assessment_tera_crate::engine::ld_grader::{
    classify_adaptive_score, grade, run_rules, severity_label,
};
use learning_disability_assessment_tera_crate::engine::rules::all_rules;
use learning_disability_assessment_tera_crate::engine::types::*;

fn data_with_adaptive(level: &str) -> AssessmentData {
    AssessmentData {
        adaptive_functioning: AdaptiveFunctioning {
            conceptual_language: level.to_string(),
            conceptual_reading_writing: level.to_string(),
            conceptual_money_time: level.to_string(),
            social_friendships: level.to_string(),
            social_empathy: level.to_string(),
            social_communication: level.to_string(),
            practical_self_care: level.to_string(),
            practical_home_living: level.to_string(),
            practical_community: level.to_string(),
            practical_work_school: level.to_string(),
        },
        reasonable_adjustments: ReasonableAdjustments {
            flag_on_record: "yes".to_string(),
            ..ReasonableAdjustments::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_is_mild() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.severity_category, "mild");
    assert_eq!(result.answered_count, 0);
    assert_eq!(result.adaptive_score, 0.0);
}

#[test]
fn all_independent_is_mild() {
    let data = data_with_adaptive("independent");
    let result = grade(&data);
    assert_eq!(result.severity_category, "mild");
    assert_eq!(result.answered_count, 10);
    assert_eq!(result.adaptive_score, 0.0);
}

#[test]
fn all_some_support_is_moderate() {
    let data = data_with_adaptive("some-support");
    let result = grade(&data);
    assert_eq!(result.severity_category, "moderate");
    assert_eq!(result.adaptive_score, 1.0);
}

#[test]
fn all_significant_support_is_severe() {
    let data = data_with_adaptive("significant-support");
    let result = grade(&data);
    assert_eq!(result.severity_category, "severe");
    assert_eq!(result.adaptive_score, 2.0);
}

#[test]
fn all_full_support_is_profound() {
    let data = data_with_adaptive("full-support");
    let result = grade(&data);
    assert_eq!(result.severity_category, "profound");
    assert_eq!(result.adaptive_score, 3.0);
}

#[test]
fn classify_thresholds() {
    assert_eq!(classify_adaptive_score(0.0), "mild");
    assert_eq!(classify_adaptive_score(0.99), "mild");
    assert_eq!(classify_adaptive_score(1.0), "moderate");
    assert_eq!(classify_adaptive_score(1.99), "moderate");
    assert_eq!(classify_adaptive_score(2.0), "severe");
    assert_eq!(classify_adaptive_score(2.59), "severe");
    assert_eq!(classify_adaptive_score(2.6), "profound");
    assert_eq!(classify_adaptive_score(3.0), "profound");
}

#[test]
fn severity_labels() {
    assert_eq!(severity_label("mild"), "Mild Learning Disability");
    assert_eq!(severity_label("moderate"), "Moderate Learning Disability");
    assert_eq!(severity_label("severe"), "Severe Learning Disability");
    assert_eq!(severity_label("profound"), "Profound Learning Disability");
    assert_eq!(severity_label("unknown"), "");
}

#[test]
fn rule_ids_are_unique_and_preserved() {
    let rules = all_rules();
    let ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    assert_eq!(ids.len(), 10);
    let expected = [
        "LD-CON-001",
        "LD-CON-002",
        "LD-CON-003",
        "LD-SOC-001",
        "LD-SOC-002",
        "LD-SOC-003",
        "LD-PRA-001",
        "LD-PRA-002",
        "LD-PRA-003",
        "LD-PRA-004",
    ];
    for id in expected {
        assert!(
            ids.contains(&id),
            "rule ID {id} must be preserved verbatim"
        );
    }
    let mut sorted = ids.clone();
    sorted.sort();
    let len_before = sorted.len();
    sorted.dedup();
    assert_eq!(sorted.len(), len_before, "rule IDs must be unique");
}

#[test]
fn partial_completion_classifies_on_mean() {
    let mut data = AssessmentData::default();
    // Two items at full-support, all others unanswered.
    data.adaptive_functioning.conceptual_language = "full-support".to_string();
    data.adaptive_functioning.practical_self_care = "full-support".to_string();
    let result = grade(&data);
    assert_eq!(result.answered_count, 2);
    assert_eq!(result.adaptive_score, 3.0);
    assert_eq!(result.severity_category, "profound");
}

#[test]
fn run_rules_only_emits_answered() {
    let mut data = AssessmentData::default();
    data.adaptive_functioning.social_empathy = "some-support".to_string();
    let fired = run_rules(&data);
    assert_eq!(fired.len(), 1);
    assert_eq!(fired[0].id, "LD-SOC-002");
    assert_eq!(fired[0].score, 1);
}
