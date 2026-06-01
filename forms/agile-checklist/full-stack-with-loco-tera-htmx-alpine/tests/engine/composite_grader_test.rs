use std::collections::BTreeMap;

use agile_checklist_tera_crate::engine::composite_grader::grade;
use agile_checklist_tera_crate::engine::items::all_items;
use agile_checklist_tera_crate::engine::types::*;
use agile_checklist_tera_crate::engine::utils::{band_for, derive_maturity};

fn assessment_with_answers(answers: BTreeMap<String, String>) -> AssessmentData {
    AssessmentData {
        respondent: Respondent {
            respondent_name: "Test Respondent".to_string(),
            respondent_role: "scrum-master".to_string(),
            team: "Aurora".to_string(),
            organisation: "Acme Engineering".to_string(),
            assessment_date: "2026-06-01".to_string(),
            assessment_period: "Q2 2026".to_string(),
            is_anonymous: "no".to_string(),
        },
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
fn band_thresholds() {
    assert_eq!(band_for(Some(75.0)), Band::High);
    assert_eq!(band_for(Some(74.0)), Band::Mid);
    assert_eq!(band_for(Some(50.0)), Band::Mid);
    assert_eq!(band_for(Some(49.0)), Band::Low);
    assert_eq!(band_for(None), Band::Unanswered);
}

#[test]
fn maturity_thresholds() {
    assert_eq!(derive_maturity(Some(90.0)), Maturity::Optimising);
    assert_eq!(derive_maturity(Some(89.0)), Maturity::Mature);
    assert_eq!(derive_maturity(Some(75.0)), Maturity::Mature);
    assert_eq!(derive_maturity(Some(50.0)), Maturity::Developing);
    assert_eq!(derive_maturity(Some(49.0)), Maturity::Initial);
    assert_eq!(derive_maturity(Some(24.0)), Maturity::AdHoc);
    assert_eq!(derive_maturity(None), Maturity::InsufficientData);
}

#[test]
fn empty_assessment_is_insufficient_data() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.maturity, "insufficient-data");
    assert_eq!(result.answered_count, 0);
}

#[test]
fn all_yes_is_optimising() {
    let data = assessment_with_answers(answer_all("yes"));
    let result = grade(&data);
    assert_eq!(result.maturity, "optimising");
    assert_eq!(result.overall_percent, Some(100.0));
}

#[test]
fn all_no_is_ad_hoc_with_section_flags() {
    let data = assessment_with_answers(answer_all("no"));
    let result = grade(&data);
    assert_eq!(result.maturity, "ad-hoc");
    assert_eq!(result.overall_percent, Some(0.0));
    let cats: Vec<&str> = result
        .additional_flags
        .iter()
        .map(|f| f.category.as_str())
        .collect();
    assert!(cats.contains(&"teams-autonomy-risk"));
    assert!(cats.contains(&"stakeholders-trust-risk"));
    assert!(cats.contains(&"practices-discipline-risk"));
}

#[test]
fn fewer_than_30_is_insufficient_data() {
    let mut answers = BTreeMap::new();
    answers.insert("t01".to_string(), "yes".to_string());
    answers.insert("t02".to_string(), "yes".to_string());
    let data = assessment_with_answers(answers);
    let result = grade(&data);
    assert_eq!(result.maturity, "insufficient-data");
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.category == "insufficient-data")
    );
}

#[test]
fn fired_rules_emit_one_per_section() {
    let data = assessment_with_answers(answer_all("yes"));
    let result = grade(&data);
    // Three sections always produce three coaching rules (teams, stakeholders,
    // practices), one each.
    assert_eq!(result.fired_rules.len(), 3);
    let sections: Vec<&str> = result.fired_rules.iter().map(|r| r.section.as_str()).collect();
    assert!(sections.contains(&"teams"));
    assert!(sections.contains(&"stakeholders"));
    assert!(sections.contains(&"practices"));
}
