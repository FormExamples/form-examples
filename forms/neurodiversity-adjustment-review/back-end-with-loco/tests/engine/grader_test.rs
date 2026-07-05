//! Four-axis grading-engine tests.

use std::collections::HashSet;

use neurodiversity_adjustment_review_loco_crate::engine::grader::calculate_grade;

use super::fixtures::{
    create_escalated_review, create_ineffective_review, create_no_next_review_review,
    create_not_working_review, create_working_well_review,
};

#[test]
fn grades_an_all_working_well_complete_review() {
    let g = calculate_grade(&create_working_well_review());
    assert_eq!(g.effectiveness_band, "effective");
    assert_eq!(g.wellbeing_risk_band, "ok");
    assert_eq!(g.completeness_percent, 100);
    assert_eq!(g.recommendation, "maintain");
    assert_eq!(g.flags.len(), 0);
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-EFFECT-EFFECTIVE"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-WELL-OK"));
}

#[test]
fn a_not_working_adjustment_is_partial_caution_and_adjust_now() {
    let g = calculate_grade(&create_not_working_review());
    // Two adjustments still working well, one not working → partially-effective.
    assert_eq!(g.effectiveness_band, "partially-effective");
    assert_eq!(g.wellbeing_risk_band, "caution");
    assert_eq!(g.next_step_urgency, "adjust-now");
    assert_eq!(g.recommendation, "adjust-adjustments");
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-EFFECT-PARTIAL"));
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-NEXT-CHANGES"));
    assert!(g
        .flags
        .iter()
        .any(|f| f.flag_id == "F-ADJUSTMENTS-NOT-WORKING-001"));
}

#[test]
fn an_ineffective_review_seeks_occupational_health() {
    let g = calculate_grade(&create_ineffective_review());
    assert_eq!(g.effectiveness_band, "ineffective");
    assert_eq!(g.wellbeing_risk_band, "high-risk");
    assert_eq!(g.next_step_urgency, "adjust-now");
    assert_eq!(g.recommendation, "seek-occupational-health");
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-EFFECT-INEFFECTIVE"));
    assert!(g
        .flags
        .iter()
        .any(|f| f.flag_id == "F-ADJUSTMENTS-NOT-WORKING-001"));
}

#[test]
fn an_escalation_escalates_the_next_step() {
    let g = calculate_grade(&create_escalated_review());
    assert_eq!(g.wellbeing_risk_band, "high-risk");
    assert_eq!(g.next_step_urgency, "escalate");
    assert_eq!(g.target_timeframe, "Escalate now");
    assert_eq!(g.recommendation, "escalate-to-hr");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-NEXT-ESCALATED"));
    assert!(g.flags.iter().any(|f| f.flag_id == "F-ESCALATION-001"));
}

#[test]
fn a_missing_next_review_is_flagged_and_scheduled() {
    let g = calculate_grade(&create_no_next_review_review());
    assert_eq!(g.next_step_urgency, "none");
    assert_eq!(g.recommendation, "schedule-next-review");
    assert!(g.flags.iter().any(|f| f.flag_id == "F-NO-NEXT-REVIEW-001"));
}

#[test]
fn computes_partial_completeness_when_sections_are_missing() {
    let mut r = create_working_well_review();
    r.worker_feedback = String::new();
    let g = calculate_grade(&r);
    // Missing worker feedback (weight 3) of 17 → 14/17 = 82%.
    assert_eq!(g.completeness_percent, 82);
    assert!(g
        .fired_rules
        .iter()
        .any(|rule| rule.rule_id == "R-COMPLETE-WORKER-FEEDBACK"));
}

#[test]
fn produces_stable_unique_rule_ids() {
    let g = calculate_grade(&create_not_working_review());
    let ids: Vec<&str> = g.fired_rules.iter().map(|r| r.rule_id.as_str()).collect();
    let unique: HashSet<&str> = ids.iter().copied().collect();
    assert_eq!(unique.len(), ids.len());
}
