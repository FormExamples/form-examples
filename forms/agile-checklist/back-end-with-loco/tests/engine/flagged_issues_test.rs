use std::collections::BTreeMap;

use agile_checklist_loco_crate::engine::composite_grader::grade;
use agile_checklist_loco_crate::engine::items::all_items;
use agile_checklist_loco_crate::engine::types::*;

fn assessment_with_answers(answers: BTreeMap<String, String>) -> AssessmentData {
    AssessmentData {
        respondent: Respondent::default(),
        answers,
        action_plan: ActionPlan::default(),
    }
}

fn answer_all(value: &str) -> BTreeMap<String, String> {
    let mut m = BTreeMap::new();
    for item in all_items() {
        m.insert(item.id.to_string(), value.to_string());
    }
    m
}

#[test]
fn finished_work_flag() {
    let mut answers = answer_all("yes");
    answers.insert("t08".to_string(), "no".to_string());
    answers.insert("p12".to_string(), "no".to_string());
    let data = assessment_with_answers(answers);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.category == "finished-work-risk")
    );
}

#[test]
fn experimentation_blocked_flag() {
    let mut answers = answer_all("yes");
    answers.insert("s09".to_string(), "no".to_string());
    answers.insert("s10".to_string(), "no".to_string());
    let data = assessment_with_answers(answers);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.category == "experimentation-blocked")
    );
}

#[test]
fn learning_stalled_flag() {
    let mut answers = answer_all("yes");
    answers.insert("t17".to_string(), "no".to_string());
    answers.insert("t18".to_string(), "no".to_string());
    let data = assessment_with_answers(answers);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.category == "learning-stalled")
    );
}

#[test]
fn psych_safety_flag_on_any_no() {
    let mut answers = answer_all("yes");
    answers.insert("t22".to_string(), "no".to_string());
    let data = assessment_with_answers(answers);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.category == "psychological-safety-risk")
    );
}

#[test]
fn not_applicable_excluded_from_denominator() {
    let mut answers = answer_all("yes");
    for item in agile_checklist_loco_crate::engine::items::TEAMS_ITEMS {
        answers.insert(item.id.to_string(), "not-applicable".to_string());
    }
    let data = assessment_with_answers(answers);
    let result = grade(&data);
    assert_eq!(result.teams.applicable_count, 0);
    assert!(result.teams.percent.is_none());
    // Overall is None because one section is unanswered.
    assert!(result.overall_percent.is_none());
    assert_eq!(result.maturity, "insufficient-data");
}

#[test]
fn section_imbalance_flag() {
    // Teams all yes, stakeholders all no, practices all yes -> spread > 30%.
    let mut answers = answer_all("yes");
    for item in agile_checklist_loco_crate::engine::items::STAKEHOLDERS_ITEMS {
        answers.insert(item.id.to_string(), "no".to_string());
    }
    let data = assessment_with_answers(answers);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.category == "section-imbalance")
    );
}

#[test]
fn no_high_priority_flags_on_all_yes() {
    let data = assessment_with_answers(answer_all("yes"));
    let result = grade(&data);
    let highs: Vec<&str> = result
        .additional_flags
        .iter()
        .filter(|f| f.priority == "high")
        .map(|f| f.category.as_str())
        .collect();
    assert!(
        highs.is_empty(),
        "expected no high-priority flags, found {:?}",
        highs
    );
}
