use research_and_planning_privacy_notice_tera_crate::engine::form_validator::{grade, run_rules};
use research_and_planning_privacy_notice_tera_crate::engine::types::*;
use research_and_planning_privacy_notice_tera_crate::engine::validation_rules::all_rules;

/// Build a fully-acknowledged record (all required fields filled, agreed = true).
fn fully_acknowledged() -> AssessmentData {
    AssessmentData {
        recipient_details: RecipientDetails {
            organisation_name: "Riverside Medical Practice".to_string(),
            recipient_name: "Mrs Jane Smith".to_string(),
            recipient_nhs_number: "943 476 5919".to_string(),
            recipient_dob: "1972-04-11".to_string(),
        },
        acknowledgement_signature: AcknowledgementSignature {
            agreed: true,
            type1_opt_out: "opt-in".to_string(),
            national_data_opt_out: "opt-in".to_string(),
            recipient_typed_full_name: "Jane Smith".to_string(),
            recipient_typed_date: "2026-06-01".to_string(),
        },
    }
}

#[test]
fn empty_record_is_incomplete_with_all_rules_fired() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.status, "Incomplete");
    assert_eq!(result.completeness_percent, 0);
    assert_eq!(result.fired_rules.len(), all_rules().len());
}

#[test]
fn fully_acknowledged_record_is_complete() {
    let data = fully_acknowledged();
    let result = grade(&data);
    assert_eq!(result.status, "Complete");
    assert_eq!(result.completeness_percent, 100);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn missing_organisation_fires_req_rd_001() {
    let mut data = fully_acknowledged();
    data.recipient_details.organisation_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-RD-001"));
}

#[test]
fn missing_recipient_name_fires_req_rd_002() {
    let mut data = fully_acknowledged();
    data.recipient_details.recipient_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-RD-002"));
}

#[test]
fn unchecked_agreement_fires_req_ak_001() {
    let mut data = fully_acknowledged();
    data.acknowledgement_signature.agreed = false;
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-001"));
}

#[test]
fn missing_type1_opt_out_fires_req_ak_002() {
    let mut data = fully_acknowledged();
    data.acknowledgement_signature.type1_opt_out = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-002"));
}

#[test]
fn missing_national_opt_out_fires_req_ak_003() {
    let mut data = fully_acknowledged();
    data.acknowledgement_signature.national_data_opt_out = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-003"));
}

#[test]
fn missing_full_name_fires_req_ak_004() {
    let mut data = fully_acknowledged();
    data.acknowledgement_signature.recipient_typed_full_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-004"));
}

#[test]
fn missing_date_fires_req_ak_005() {
    let mut data = fully_acknowledged();
    data.acknowledgement_signature.recipient_typed_date = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REQ-AK-005"));
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
