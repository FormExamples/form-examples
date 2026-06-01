use care_privacy_notice_tera_crate::engine::privacy_grader::{grade, run_rules};
use care_privacy_notice_tera_crate::engine::privacy_rules::all_rules;
use care_privacy_notice_tera_crate::engine::types::*;

/// Build a fully completed acknowledgement.
fn fully_completed() -> AssessmentData {
    AssessmentData {
        config: PracticeConfig {
            practice_name: "Riverside GP Practice".to_string(),
            practice_address: "1 High Street, Riverside, RV1 1AA".to_string(),
            dpo_name: "Dr Sarah Lee".to_string(),
            dpo_contact_details: "dpo@riverside-gp.nhs.uk".to_string(),
            research_organisations: String::new(),
            data_sharing_partners: String::new(),
        },
        acknowledgment: Acknowledgment {
            checked: true,
            patient_name: "Jane Doe".to_string(),
            date: "2026-06-01".to_string(),
        },
        submitted_at: Some("2026-06-01T10:00:00Z".to_string()),
    }
}

#[test]
fn empty_acknowledgement_is_incomplete() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.overall_status, "incomplete");
    assert_eq!(result.fired_rules.len(), 3);
}

#[test]
fn fully_completed_is_complete() {
    let data = fully_completed();
    let result = grade(&data);
    assert_eq!(result.overall_status, "complete");
    assert!(result.fired_rules.is_empty());
}

#[test]
fn unchecked_acknowledgement_fires_rule() {
    let mut data = fully_completed();
    data.acknowledgment.checked = false;
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "acknowledgment-not-checked"));
}

#[test]
fn blank_name_fires_rule() {
    let mut data = fully_completed();
    data.acknowledgment.patient_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "name-blank"));
}

#[test]
fn blank_date_fires_rule() {
    let mut data = fully_completed();
    data.acknowledgment.date = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "date-blank"));
}

#[test]
fn whitespace_name_is_treated_as_blank() {
    let mut data = fully_completed();
    data.acknowledgment.patient_name = "   ".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "name-blank"));
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
