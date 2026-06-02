use research_and_planning_privacy_notice_loco_crate::engine::flagged_issues::detect_additional_flags;
use research_and_planning_privacy_notice_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
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
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn unchecked_agreement_raises_noack_flag() {
    let mut data = baseline();
    data.acknowledgement_signature.agreed = false;
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-NOACK-001" && f.priority == "high"));
}

#[test]
fn type1_opt_out_raises_high_priority_flag() {
    let mut data = baseline();
    data.acknowledgement_signature.type1_opt_out = "opt-out".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-TYPE1-OPTOUT-001" && f.priority == "high"));
}

#[test]
fn national_opt_out_raises_high_priority_flag() {
    let mut data = baseline();
    data.acknowledgement_signature.national_data_opt_out = "opt-out".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-NATIONAL-OPTOUT-001" && f.priority == "high"));
}

#[test]
fn short_name_raises_medium_flag() {
    let mut data = baseline();
    data.acknowledgement_signature.recipient_typed_full_name = "Jo".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-NAME-001").expect("name flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn empty_name_does_not_raise_name_flag() {
    let mut data = baseline();
    data.acknowledgement_signature.recipient_typed_full_name = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().all(|f| f.id != "FLAG-NAME-001"));
}

#[test]
fn missing_recipient_metadata_raises_config_flag() {
    let mut data = baseline();
    data.recipient_details.organisation_name = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-CONFIG-001").expect("config flag");
    assert!(flag.message.contains("organisation name"));
}

#[test]
fn flags_are_sorted_by_priority() {
    // Force one high + one medium.
    let mut data = baseline();
    data.acknowledgement_signature.type1_opt_out = "opt-out".to_string();
    data.acknowledgement_signature.recipient_typed_full_name = "Jo".to_string();
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
