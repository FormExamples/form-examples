//! Flag-detection tests (via the full grader, which threads the completeness
//! percent into flag detection).

use neurodiversity_adjustment_review_loco_crate::engine::grader::calculate_grade;

use super::fixtures::{
    create_escalated_review, create_ineffective_review, create_no_next_review_review,
    create_not_working_review, create_working_well_review,
};

#[test]
fn flags_adjustments_not_working() {
    let flags = calculate_grade(&create_not_working_review()).flags;
    assert!(flags
        .iter()
        .any(|f| f.flag_id == "F-ADJUSTMENTS-NOT-WORKING-001"
            && f.category == "adjustments-not-working"
            && f.priority == "high"));
}

#[test]
fn flags_escalation() {
    let flags = calculate_grade(&create_escalated_review()).flags;
    assert!(flags.iter().any(|f| f.category == "escalation"));
}

#[test]
fn flags_no_next_review() {
    let flags = calculate_grade(&create_no_next_review_review()).flags;
    assert!(flags.iter().any(|f| f.flag_id == "F-NO-NEXT-REVIEW-001"));
}

#[test]
fn flags_worker_dissatisfied_and_wellbeing_declined() {
    // The ineffective fixture also has worker_satisfied "no" and wellbeing "worse".
    let flags = calculate_grade(&create_ineffective_review()).flags;
    assert!(flags
        .iter()
        .any(|f| f.flag_id == "F-WORKER-DISSATISFIED-001" && f.priority == "high"));
    assert!(flags.iter().any(|f| f.flag_id == "F-WELLBEING-DECLINED-001"));
}

#[test]
fn flags_partial_satisfaction_as_medium() {
    // The not-working fixture has worker_satisfied "partially".
    let flags = calculate_grade(&create_not_working_review()).flags;
    assert!(flags
        .iter()
        .any(|f| f.flag_id == "F-WORKER-DISSATISFIED-001" && f.priority == "medium"));
}

#[test]
fn flags_an_incomplete_review() {
    let mut r = create_working_well_review();
    r.effectiveness_working_environment = String::new();
    r.effectiveness_equipment_technology = String::new();
    r.worker_feedback = String::new();
    r.worker_satisfied = String::new();
    r.wellbeing_change = String::new();
    let flags = calculate_grade(&r).flags;
    assert!(flags.iter().any(|f| f.category == "incomplete-review"));
}

#[test]
fn sorts_flags_high_medium_low() {
    let flags = calculate_grade(&create_ineffective_review()).flags;
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
fn returns_no_flags_for_an_all_working_well_complete_review() {
    let flags = calculate_grade(&create_working_well_review()).flags;
    assert_eq!(flags.len(), 0);
}
