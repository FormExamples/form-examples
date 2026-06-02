use code_of_conduct_notice_loco_crate::engine::flagged_issues::detect_additional_flags;
use code_of_conduct_notice_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData {
        recipient_details: RecipientDetails {
            organisation_name: "Riverside Medical Practice".to_string(),
            recipient_name: "Dr Jane Smith".to_string(),
            recipient_role: "General Practitioner".to_string(),
            recipient_employee_id: String::new(),
        },
        acknowledgement_signature: AcknowledgementSignature {
            agreed: true,
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
fn no_acknowledgement_emits_high_priority_flag() {
    let mut data = baseline();
    data.acknowledgement_signature.agreed = false;
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-NOACK-001" && f.priority == "high"));
}

#[test]
fn short_typed_name_emits_medium_flag() {
    let mut data = baseline();
    data.acknowledgement_signature.recipient_typed_full_name = "Jo".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-NAME-001" && f.priority == "medium"));
}

#[test]
fn missing_recipient_details_emits_high_priority_flag() {
    let mut data = baseline();
    data.recipient_details.organisation_name = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-CONFIG-001")
        .expect("config flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("organisation name"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    data.acknowledgement_signature.agreed = false; // high
    data.recipient_details.recipient_name = String::new(); // high
    data.acknowledgement_signature.recipient_typed_full_name = "Jo".to_string(); // medium
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
