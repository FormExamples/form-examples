use care_privacy_notice_tera_crate::engine::flagged_issues::detect_additional_flags;
use care_privacy_notice_tera_crate::engine::types::*;

fn complete_config() -> AssessmentData {
    AssessmentData {
        config: PracticeConfig {
            practice_name: "Riverside GP Practice".to_string(),
            practice_address: "1 High Street, Riverside, RV1 1AA".to_string(),
            dpo_name: "Dr Sarah Lee".to_string(),
            dpo_contact_details: "dpo@riverside-gp.nhs.uk".to_string(),
            research_organisations: String::new(),
            data_sharing_partners: String::new(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn complete_config_has_no_flags() {
    let flags = detect_additional_flags(&complete_config());
    assert!(flags.is_empty(), "no flags expected: {flags:?}");
}

#[test]
fn missing_practice_name_emits_flag() {
    let mut data = complete_config();
    data.config.practice_name = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-PRACTICE-NAME-001"));
}

#[test]
fn missing_dpo_emits_flag() {
    let mut data = complete_config();
    data.config.dpo_name = String::new();
    let flags = detect_additional_flags(&data);
    let f = flags.iter().find(|f| f.id == "FLAG-DPO-001").expect("dpo flag");
    assert_eq!(f.priority, "medium");
}

#[test]
fn missing_address_emits_low_flag() {
    let mut data = complete_config();
    data.config.practice_address = String::new();
    let flags = detect_additional_flags(&data);
    let f = flags.iter().find(|f| f.id == "FLAG-ADDRESS-001").expect("address flag");
    assert_eq!(f.priority, "low");
}

#[test]
fn flags_sorted_by_priority() {
    let mut data = complete_config();
    data.config.practice_address = String::new();
    data.config.practice_name = String::new();
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
