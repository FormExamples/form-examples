use legal_requirements_privacy_notice_tera_crate::engine::flagged_issues::detect_additional_flags;
use legal_requirements_privacy_notice_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
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
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn missing_confirmation_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.acknowledgment.confirmed = false;
    let flags = detect_additional_flags(&data);
    assert!(
        flags.iter().any(|f| f.id == "FLAG-ACK-NOT-CONFIRMED" && f.priority == "high")
    );
}

#[test]
fn missing_full_name_emits_medium_flag() {
    let mut data = baseline_case();
    data.acknowledgment.full_name = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-ACK-MISSING-NAME")
        .expect("missing-name flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn missing_date_emits_medium_flag() {
    let mut data = baseline_case();
    data.acknowledgment.acknowledged_date = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-ACK-MISSING-DATE")
        .expect("missing-date flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    data.acknowledgment.confirmed = false;
    data.acknowledgment.full_name = String::new();
    data.acknowledgment.acknowledged_date = String::new();
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
