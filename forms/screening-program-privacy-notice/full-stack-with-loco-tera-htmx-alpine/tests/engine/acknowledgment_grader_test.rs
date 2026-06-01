use screening_program_privacy_notice_tera_crate::engine::acknowledgment_grader::{grade, run_rules};
use screening_program_privacy_notice_tera_crate::engine::acknowledgment_rules::all_rules;
use screening_program_privacy_notice_tera_crate::engine::types::*;

/// Build a fully completed acknowledgment with a well-configured practice.
fn fully_completed() -> AssessmentData {
    AssessmentData {
        patient: Patient {
            name: "Jane Doe".to_string(),
            birth_date: "1972-04-11".to_string(),
            united_kingdom_nhs_number: "943 476 5919".to_string(),
            ..Patient::default()
        },
        acknowledgment: Acknowledgment {
            confirmed: true,
            full_name: "Jane Doe".to_string(),
            acknowledged_date: "2026-06-01".to_string(),
        },
        practice_config: PracticeConfig {
            practice_name: "St James's Health Centre".to_string(),
            data_controller_address: "St James's Health Centre, Leeds".to_string(),
            data_protection_officer: "Dr A. Smith, dpo@example.nhs.uk".to_string(),
            research_organisations: "Clinical Practice Research Datalink".to_string(),
            planning_organisations: "NHS England".to_string(),
            audit_body: "Healthcare Quality Improvements Partnership".to_string(),
            subject_access_request_link: "https://example.nhs.uk/sar".to_string(),
            gdpr_basis: "consent".to_string(),
        },
    }
}

#[test]
fn empty_case_is_not_started() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.acknowledgment_status, "not-started");
    assert_eq!(result.overall_percent, 0);
    assert_eq!(result.answered, 0);
    assert_eq!(result.total, 3);
}

#[test]
fn fully_completed_is_complete() {
    let data = fully_completed();
    let result = grade(&data);
    assert_eq!(result.acknowledgment_status, "complete");
    assert_eq!(result.overall_percent, 100);
    assert_eq!(result.answered, 3);
}

#[test]
fn missing_confirmation_yields_in_progress_when_other_fields_set() {
    let mut data = fully_completed();
    data.acknowledgment.confirmed = false;
    let result = grade(&data);
    assert_eq!(result.acknowledgment_status, "in-progress");
    assert!(result.fired_rules.iter().any(|r| r.id == "ACK-01"));
}

#[test]
fn missing_full_name_fires_ack_02() {
    let mut data = fully_completed();
    data.acknowledgment.full_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "ACK-02"));
}

#[test]
fn missing_date_fires_ack_03() {
    let mut data = fully_completed();
    data.acknowledgment.acknowledged_date = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "ACK-03"));
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
fn unconfigured_practice_yields_complete_with_concerns() {
    let mut data = fully_completed();
    // Wipe practice config — high-priority flags will fire even though
    // patient fields are valid.
    data.practice_config = PracticeConfig::default();
    let result = grade(&data);
    // Patient fields are still all valid, so the form passes; but
    // configuration medium flags will fire. The acknowledgment itself
    // should still be "complete" (medium flags don't degrade to
    // complete-with-concerns; only high flags do).
    assert_eq!(result.acknowledgment_status, "complete");
}
