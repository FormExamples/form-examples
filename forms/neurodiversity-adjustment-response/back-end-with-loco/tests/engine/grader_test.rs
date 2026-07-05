//! Four-axis grading-engine tests.

use std::collections::HashSet;

use neurodiversity_adjustment_response_loco_crate::engine::grader::calculate_grade;

use super::fixtures::{
    create_agreed_no_review_response, create_declined_no_rationale_response,
    create_escalated_response, create_fully_agreed_response,
};

#[test]
fn grades_a_fully_agreed_complete_response() {
    let g = calculate_grade(&create_fully_agreed_response());
    assert_eq!(g.outcome_classification, "fully-agreed");
    assert_eq!(g.legal_risk_band, "ok");
    assert_eq!(g.completeness_percent, 100);
    assert_eq!(g.follow_up_urgency, "review-scheduled");
    assert_eq!(g.recommendation, "implement");
    assert_eq!(g.flags.len(), 0);
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-OUTCOME-AGREED"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-LEGAL-OK"));
}

#[test]
fn declined_with_no_rationale_is_high_legal_risk() {
    let g = calculate_grade(&create_declined_no_rationale_response());
    assert_eq!(g.outcome_classification, "declined");
    assert_eq!(g.legal_risk_band, "high-risk");
    assert_eq!(g.follow_up_urgency, "urgent-review");
    assert_eq!(g.recommendation, "reconsider-decision");
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-LEGAL-DECLINE-NO-RATIONALE"));
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-FOLLOWUP-LEGAL-RISK"));
    // The discrimination-risk flag is raised.
    assert!(g.flags.iter().any(|f| f.flag_id == "F-DISCRIMINATION-RISK-001"));
}

#[test]
fn escalation_needs_escalation_follow_up() {
    let g = calculate_grade(&create_escalated_response());
    assert_eq!(g.follow_up_urgency, "escalation-needed");
    assert_eq!(g.target_timeframe, "Escalate now");
    assert_eq!(g.recommendation, "escalate-to-hr");
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-FOLLOWUP-ESCALATED"));
    assert!(g.flags.iter().any(|f| f.flag_id == "F-GRIEVANCE-001"));
}

#[test]
fn agreed_without_a_review_is_urgent_and_flagged() {
    let g = calculate_grade(&create_agreed_no_review_response());
    assert_eq!(g.outcome_classification, "fully-agreed");
    assert_eq!(g.follow_up_urgency, "urgent-review");
    assert_eq!(g.recommendation, "schedule-review");
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-FOLLOWUP-NO-REVIEW"));
    assert!(g.flags.iter().any(|f| f.flag_id == "F-NO-REVIEW-001"));
}

#[test]
fn computes_partial_completeness_when_sections_are_missing() {
    let mut r = create_fully_agreed_response();
    r.decision_rationale = String::new();
    r.point_of_contact = String::new();
    r.effective_date = String::new();
    let g = calculate_grade(&r);
    // Missing rationale (3) + contact (1) + effective date (1) = 5 of 16.
    assert_eq!(g.completeness_percent, 69);
    assert!(g
        .fired_rules
        .iter()
        .any(|rule| rule.rule_id == "R-COMPLETE-RATIONALE"));
}

#[test]
fn produces_stable_unique_rule_ids() {
    let g = calculate_grade(&create_declined_no_rationale_response());
    let ids: Vec<&str> = g.fired_rules.iter().map(|r| r.rule_id.as_str()).collect();
    let unique: HashSet<&str> = ids.iter().copied().collect();
    assert_eq!(unique.len(), ids.len());
}
