//! Flag-detection tests, ported from `grader.test.ts`.

use cardiology_response_loco_crate::engine::flagged_issues::detect_flags;

use super::fixtures::{
    create_critical_response, create_hfref_response, create_no_abnormality_response,
};

#[test]
fn flags_a_critical_result_not_yet_communicated() {
    let flags = detect_flags(&create_critical_response());
    assert!(flags.iter().any(|f| f.flag_id == "F-CRITICAL-FINDING-001"));
    assert!(flags.iter().any(|f| f.flag_id == "F-CRITICAL-FINDING-002"));
}

#[test]
fn flags_severe_valve_disease() {
    let flags = detect_flags(&create_critical_response());
    assert!(flags.iter().any(|f| f.category == "severe-valve-disease"));
}

#[test]
fn flags_reduced_ejection_fraction_for_an_hfref_response() {
    let flags = detect_flags(&create_hfref_response());
    assert!(flags.iter().any(|f| f.category == "reduced-ejection-fraction"));
}

#[test]
fn flags_a_missing_diagnosis() {
    let mut r = create_no_abnormality_response();
    r.primary_diagnosis_category = String::new();
    r.diagnosis_narrative = String::new();
    let flags = detect_flags(&r);
    assert!(flags.iter().any(|f| f.category == "missing-diagnosis"));
}

#[test]
fn flags_an_incomplete_response() {
    let mut r = create_no_abnormality_response();
    r.management_plan = String::new();
    r.recommended_follow_up = String::new();
    let flags = detect_flags(&r);
    assert!(flags.iter().any(|f| f.category == "incomplete-response"));
}

#[test]
fn sorts_flags_high_medium_low() {
    let flags = detect_flags(&create_critical_response());
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
fn returns_no_flags_for_a_reassuring_complete_response() {
    let flags = detect_flags(&create_no_abnormality_response());
    assert_eq!(flags.len(), 0);
}
