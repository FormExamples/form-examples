use screening_program_privacy_notice_loco_crate::engine::flagged_issues::detect_additional_flags;
use screening_program_privacy_notice_loco_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        patient: Patient::default(),
        acknowledgment: Acknowledgment {
            confirmed: true,
            full_name: "Jane Doe".to_string(),
            acknowledged_date: "2026-06-01".to_string(),
        },
        practice_config: PracticeConfig {
            practice_name: "Example Practice".to_string(),
            data_controller_address: "1 Example Street".to_string(),
            data_protection_officer: "Dr A. Smith, dpo@example.nhs.uk".to_string(),
            research_organisations: "CPRD".to_string(),
            planning_organisations: "NHS England".to_string(),
            audit_body: "HQIP".to_string(),
            subject_access_request_link: "https://example.nhs.uk/sar".to_string(),
            gdpr_basis: "consent".to_string(),
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
    assert!(flags.iter().any(|f| f.id == "FLAG-CONFIRM-001" && f.priority == "high"));
}

#[test]
fn missing_name_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.acknowledgment.full_name = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-NAME-001" && f.priority == "high"));
}

#[test]
fn missing_date_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.acknowledgment.acknowledged_date = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-DATE-001" && f.priority == "high"));
}

#[test]
fn unset_gdpr_basis_emits_medium_flag() {
    let mut data = baseline_case();
    data.practice_config.gdpr_basis = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-GDPR-001").expect("gdpr flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn placeholder_dpo_emits_medium_flag() {
    let mut data = baseline_case();
    data.practice_config.data_protection_officer = "[Insert DPO name and contact details]".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-DPO-001").expect("dpo flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn placeholder_practice_name_emits_medium_flag() {
    let mut data = baseline_case();
    data.practice_config.practice_name = "[Insert name of practice]".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-PRACTICE-001").expect("practice flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    data.acknowledgment.confirmed = false; // high
    data.practice_config.gdpr_basis = String::new(); // medium
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
