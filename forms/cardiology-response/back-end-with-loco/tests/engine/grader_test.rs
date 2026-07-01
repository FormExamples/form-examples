//! Four-axis grading-engine tests, ported from `grader.test.ts`.

use std::collections::HashSet;

use cardiology_response_loco_crate::engine::grader::calculate_grade;

use super::fixtures::{
    create_critical_response, create_hfref_response, create_no_abnormality_response,
};

#[test]
fn grades_a_reassuring_complete_no_abnormality_response() {
    let g = calculate_grade(&create_no_abnormality_response());
    assert_eq!(g.response_classification, "no-abnormality");
    assert_eq!(g.severity, "none");
    assert_eq!(g.completeness_percent, 100);
    assert_eq!(g.follow_up_urgency, "routine");
    assert_eq!(g.recommendation, "no-action");
    assert_eq!(g.flags.len(), 0);
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-CLASS-NONE-01"));
}

#[test]
fn grades_a_cardiac_condition_hfref_response_as_major_urgent() {
    let g = calculate_grade(&create_hfref_response());
    assert_eq!(g.response_classification, "cardiac-condition");
    assert_eq!(g.severity, "major");
    assert_eq!(g.severity_category, "reduced-ejection-fraction");
    assert_eq!(g.follow_up_urgency, "urgent");
    assert_eq!(g.recommendation, "specialist-management");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-CLASS-CARDIAC-01"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-SEVERITY-MAJOR-03"));
    assert!(g.flags.iter().any(|f| f.category == "reduced-ejection-fraction"));
}

#[test]
fn auto_escalates_a_critical_result_to_critical_alert() {
    let g = calculate_grade(&create_critical_response());
    assert_eq!(g.response_classification, "critical");
    assert_eq!(g.severity, "major");
    assert_eq!(g.follow_up_urgency, "critical-alert");
    assert_eq!(g.target_timeframe, "immediate");
    assert_eq!(g.recommendation, "urgent-review");
    // The auto-escalation invariant rule fired.
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-FOLLOWUP-CRITICAL-01"));
    // The critical-finding flag is raised.
    assert!(g.flags.iter().any(|f| f.category == "critical-finding"));
}

#[test]
fn grades_a_low_ejection_fraction_as_reduced_even_without_the_flag() {
    let mut r = create_no_abnormality_response();
    r.non_cardiac_cause = false;
    r.primary_diagnosis_category = "heart-failure".to_string();
    r.diagnosis_narrative = "Heart failure.".to_string();
    r.lv_ejection_fraction_percent = Some(35.0);
    let g = calculate_grade(&r);
    assert_eq!(g.response_classification, "cardiac-condition");
    assert_eq!(g.severity, "major");
    assert!(g.fired_rules.iter().any(|rule| rule.rule_id == "R-SEVERITY-MAJOR-03"));
}

#[test]
fn grades_a_moderate_cardiac_finding_as_recommended_follow_up() {
    let mut r = create_no_abnormality_response();
    r.non_cardiac_cause = false;
    r.ischaemia_or_cad = true;
    r.primary_diagnosis_category = "coronary-artery-disease".to_string();
    r.diagnosis_narrative = "Stable coronary artery disease.".to_string();
    let g = calculate_grade(&r);
    assert_eq!(g.response_classification, "cardiac-condition");
    assert_eq!(g.severity, "moderate");
    assert_eq!(g.follow_up_urgency, "recommended");
    assert_eq!(g.recommendation, "further-investigation");
}

#[test]
fn classifies_a_response_with_no_clinical_summary_as_inconclusive() {
    let mut r = create_no_abnormality_response();
    r.clinical_summary = String::new();
    let g = calculate_grade(&r);
    assert_eq!(g.response_classification, "inconclusive");
    assert_eq!(g.follow_up_urgency, "recommended");
    assert_eq!(g.recommendation, "further-investigation");
}

#[test]
fn computes_partial_completeness_when_sections_are_missing() {
    let mut r = create_no_abnormality_response();
    r.examination_findings = String::new();
    r.management_plan = String::new();
    let g = calculate_grade(&r);
    // 3 of 5 sections present.
    assert_eq!(g.completeness_percent, 60);
    assert!(g.fired_rules.iter().any(|rule| rule.rule_id == "R-COMP-EXAMINATION-01"));
}

#[test]
fn produces_stable_unique_rule_ids() {
    let g = calculate_grade(&create_critical_response());
    let ids: Vec<&str> = g.fired_rules.iter().map(|r| r.rule_id.as_str()).collect();
    let unique: HashSet<&str> = ids.iter().copied().collect();
    assert_eq!(unique.len(), ids.len());
}
