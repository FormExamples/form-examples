use code_of_conduct_notice_tera_crate::engine::form_validator::{grade, run_rules};
use code_of_conduct_notice_tera_crate::engine::types::*;
use code_of_conduct_notice_tera_crate::engine::validation_rules::validation_rules;

/// Build a fully-completed acknowledgement.
fn fully_completed() -> AssessmentData {
    AssessmentData {
        recipient_details: RecipientDetails {
            organisation_name: "Riverside Medical Practice".to_string(),
            recipient_name: "Dr Jane Smith".to_string(),
            recipient_role: "General Practitioner".to_string(),
            recipient_employee_id: "4827".to_string(),
        },
        acknowledgement_signature: AcknowledgementSignature {
            agreed: true,
            recipient_typed_full_name: "Jane Smith".to_string(),
            recipient_typed_date: "2026-06-01".to_string(),
        },
    }
}

#[test]
fn empty_assessment_is_incomplete() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.status, "Incomplete");
    assert_eq!(result.completeness_percent, 0);
    assert_eq!(result.fired_rules.len(), validation_rules().len());
}

#[test]
fn fully_completed_is_complete() {
    let data = fully_completed();
    let result = grade(&data);
    assert_eq!(result.status, "Complete");
    assert_eq!(result.completeness_percent, 100);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn unticked_checkbox_fires_req_ak_001() {
    let mut data = fully_completed();
    data.acknowledgement_signature.agreed = false;
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-001"));
}

#[test]
fn missing_organisation_fires_req_rd_001() {
    let mut data = fully_completed();
    data.recipient_details.organisation_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-RD-001"));
}

#[test]
fn missing_typed_name_fires_req_ak_002() {
    let mut data = fully_completed();
    data.acknowledgement_signature.recipient_typed_full_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-002"));
}

#[test]
fn missing_typed_date_fires_req_ak_003() {
    let mut data = fully_completed();
    data.acknowledgement_signature.recipient_typed_date = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-003"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = validation_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn employee_id_is_optional() {
    let mut data = fully_completed();
    data.recipient_details.recipient_employee_id = String::new();
    let result = grade(&data);
    assert_eq!(result.status, "Complete");
    assert!(result.fired_rules.is_empty());
}
