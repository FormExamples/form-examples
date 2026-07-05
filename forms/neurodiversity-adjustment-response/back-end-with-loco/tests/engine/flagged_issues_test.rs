//! Flag-detection tests (via the full grader, which threads the legal-risk band
//! and completeness percent into flag detection).

use neurodiversity_adjustment_response_loco_crate::engine::grader::calculate_grade;

use super::fixtures::{
    create_agreed_no_review_response, create_declined_no_rationale_response,
    create_escalated_response, create_fully_agreed_response,
};

#[test]
fn flags_discrimination_risk_on_an_unjustified_decline() {
    let flags = calculate_grade(&create_declined_no_rationale_response()).flags;
    assert!(flags.iter().any(|f| f.flag_id == "F-DISCRIMINATION-RISK-001"));
    assert!(flags
        .iter()
        .any(|f| f.category == "discrimination-risk" && f.priority == "high"));
    // A declined decision with no rationale also raises the missing-rationale flag.
    assert!(flags.iter().any(|f| f.flag_id == "F-MISSING-RATIONALE-001"));
}

#[test]
fn flags_grievance_escalation() {
    let flags = calculate_grade(&create_escalated_response()).flags;
    assert!(flags.iter().any(|f| f.category == "grievance-escalation"));
}

#[test]
fn flags_no_review_scheduled_when_adjustments_agreed() {
    let flags = calculate_grade(&create_agreed_no_review_response()).flags;
    assert!(flags.iter().any(|f| f.flag_id == "F-NO-REVIEW-001"));
}

#[test]
fn flags_undue_delay_after_twenty_days() {
    let mut r = create_fully_agreed_response();
    r.assessed_date = "2026-06-01".to_string();
    r.responded_date = "2026-07-05".to_string(); // 34 days
    let flags = calculate_grade(&r).flags;
    assert!(flags.iter().any(|f| f.category == "undue-delay"));
}

#[test]
fn flags_an_incomplete_response() {
    let mut r = create_fully_agreed_response();
    r.overall_decision = String::new();
    r.decision_rationale = String::new();
    r.agreed_adjustments_detail = String::new();
    r.point_of_contact = String::new();
    r.responsibilities_detail = String::new();
    r.responded_date = String::new();
    r.effective_date = String::new();
    r.review_scheduled = false;
    r.review_date = String::new();
    let flags = calculate_grade(&r).flags;
    assert!(flags.iter().any(|f| f.category == "incomplete-response"));
}

#[test]
fn sorts_flags_high_medium_low() {
    let flags = calculate_grade(&create_declined_no_rationale_response()).flags;
    fn order(p: &str) -> u8 {
        match p {
            "high" => 0,
            "medium" => 1,
            _ => 2,
        }
    }
    let priorities: Vec<u8> = flags.iter().map(|f| order(&f.priority)).collect();
    let mut sorted = priorities.clone();
    sorted.sort_unstable();
    assert_eq!(priorities, sorted);
}

#[test]
fn returns_no_flags_for_a_fully_agreed_complete_response() {
    let flags = calculate_grade(&create_fully_agreed_response()).flags;
    assert_eq!(flags.len(), 0);
}
