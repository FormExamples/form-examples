//! Four-axis grading-engine tests.

use std::collections::HashSet;

use neurodiversity_adjustment_request_loco_crate::engine::grader::calculate_grade;

use super::fixtures::{
    create_absence_risk_request, create_covered_request, create_minimal_request,
};

#[test]
fn grades_a_covered_complete_request() {
    let g = calculate_grade(&create_covered_request());
    assert_eq!(g.eligibility_band, "likely-covered");
    assert_eq!(g.impact_band, "ok");
    assert_eq!(g.completeness_percent, 100);
    assert_eq!(g.priority_tier, "routine");
    assert_eq!(g.recommendation, "progress-to-meeting");
    assert_eq!(g.flags.len(), 1);
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-ELIG-SUBSTANTIAL-LONG-TERM"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-IMPACT-OK"));
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-PRIORITY-REQUESTED"));
}

#[test]
fn absence_risk_is_high_impact_and_urgent() {
    let g = calculate_grade(&create_absence_risk_request());
    assert_eq!(g.impact_band, "high-risk");
    assert_eq!(g.priority_tier, "urgent");
    assert_eq!(
        g.target_timeframe,
        "Within 5 working days (act without unreasonable delay)"
    );
    assert_eq!(g.recommendation, "seek-occupational-health");
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-IMPACT-ABSENCE-RISK"));
    assert!(g
        .fired_rules
        .iter()
        .any(|r| r.rule_id == "R-PRIORITY-ABSENCE-RISK"));
}

#[test]
fn minimal_request_is_unclear_and_incomplete() {
    let g = calculate_grade(&create_minimal_request());
    assert_eq!(g.eligibility_band, "unclear");
    assert_eq!(g.completeness_percent, 0);
    assert_eq!(g.recommendation, "request-more-detail");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-ELIG-UNCLEAR"));
}

#[test]
fn computes_partial_completeness_when_a_section_is_missing() {
    let mut r = create_covered_request();
    r.disclosure_consent = false; // weight 2 of 18 removed -> 16/18 = 89%
    let g = calculate_grade(&r);
    assert_eq!(g.completeness_percent, 89);
    assert!(g
        .fired_rules
        .iter()
        .any(|rule| rule.rule_id == "R-COMPLETE-CONSENT"));
}

#[test]
fn produces_stable_unique_rule_ids() {
    let g = calculate_grade(&create_covered_request());
    let ids: Vec<&str> = g.fired_rules.iter().map(|r| r.rule_id.as_str()).collect();
    let unique: HashSet<&str> = ids.iter().copied().collect();
    assert_eq!(unique.len(), ids.len());
}
