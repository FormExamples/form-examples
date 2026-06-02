use legal_requirements_privacy_notice_loco_crate::engine::acknowledgment_grader::{grade, run_rules};
use legal_requirements_privacy_notice_loco_crate::engine::acknowledgment_rules::all_rules;
use legal_requirements_privacy_notice_loco_crate::engine::types::*;

/// Build a fully completed acknowledgment with every required item provided.
fn fully_completed_case() -> AssessmentData {
    AssessmentData {
        patient: Patient {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            nhs_number: "943 476 5919".to_string(),
        },
        acknowledgment: Acknowledgment {
            confirmed: true,
            full_name: "Jane Doe".to_string(),
            acknowledged_date: "2026-06-01".to_string(),
        },
    }
}

#[test]
fn empty_case_is_not_started() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.acknowledgment_status, "not-started");
    assert_eq!(result.overall_percent, 0);
    assert_eq!(result.progress.answered, 0);
}

#[test]
fn fully_completed_case_is_complete() {
    let data = fully_completed_case();
    let result = grade(&data);
    assert_eq!(result.acknowledgment_status, "complete");
    assert_eq!(result.overall_percent, 100);
    assert_eq!(result.progress.answered, 3);
    assert_eq!(result.progress.total, 3);
}

#[test]
fn missing_confirmation_fires_rule() {
    let mut data = fully_completed_case();
    data.acknowledgment.confirmed = false;
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "ACK-01"));
}

#[test]
fn missing_full_name_fires_rule() {
    let mut data = fully_completed_case();
    data.acknowledgment.full_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "ACK-02"));
}

#[test]
fn missing_date_fires_rule() {
    let mut data = fully_completed_case();
    data.acknowledgment.acknowledged_date = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "ACK-03"));
}

#[test]
fn partial_completion_is_in_progress() {
    let mut data = fully_completed_case();
    data.acknowledgment.confirmed = false;
    let result = grade(&data);
    assert_eq!(result.acknowledgment_status, "in-progress");
    assert_eq!(result.progress.answered, 2);
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn full_name_whitespace_only_is_not_counted() {
    let mut data = fully_completed_case();
    data.acknowledgment.full_name = "   ".to_string();
    let result = grade(&data);
    // 1 (confirmed) + 0 (whitespace name) + 1 (date) = 2
    assert_eq!(result.progress.answered, 2);
    assert_eq!(result.acknowledgment_status, "in-progress");
}
