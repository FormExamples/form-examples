use substance_abuse_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use substance_abuse_assessment_tera_crate::engine::types::*;

fn empty_case() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_case_has_no_flags() {
    let flags = detect_additional_flags(&empty_case());
    assert!(flags.is_empty(), "empty case should not produce flags: {flags:?}");
}

#[test]
fn active_withdrawal_emits_high_priority_flag() {
    let mut data = empty_case();
    data.withdrawal_assessment.currently_in_withdrawal = "yes".to_string();
    data.withdrawal_assessment.withdrawal_substance = "alcohol".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-WD-001").expect("FLAG-WD-001");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("alcohol"));
}

#[test]
fn seizure_history_emits_high_priority_flag() {
    let mut data = empty_case();
    data.withdrawal_assessment.seizure_history = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-WD-002" && f.priority == "high"));
}

#[test]
fn delirium_tremens_emits_high_priority_flag() {
    let mut data = empty_case();
    data.withdrawal_assessment.delirium_tremens_history = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-WD-003" && f.priority == "high"));
}

#[test]
fn overdose_count_appears_in_message() {
    let mut data = empty_case();
    data.physical_health_impact.overdose_history = "yes".to_string();
    data.physical_health_impact.overdose_count = Some(3);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-OD-001").expect("FLAG-OD-001");
    assert!(flag.message.contains("3"));
    assert_eq!(flag.priority, "high");
}

#[test]
fn needle_sharing_emits_bbv_flag() {
    let mut data = empty_case();
    data.substance_use_history.needle_sharing = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BBV-001" && f.priority == "high"));
}

#[test]
fn iv_drug_use_emits_medium_flag() {
    let mut data = empty_case();
    data.substance_use_history.iv_drug_use = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-IV-001").expect("FLAG-IV-001");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn liver_cirrhosis_emits_medium_flag() {
    let mut data = empty_case();
    data.physical_health_impact.liver_disease = "yes".to_string();
    data.physical_health_impact.liver_disease_type = "cirrhosis".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-LIVER-001" && f.priority == "medium")
    );
}

#[test]
fn flags_are_sorted_high_then_medium() {
    let mut data = empty_case();
    // One high (suicidal ideation), one medium (homeless), one medium (iv).
    data.mental_health_comorbidities.suicidal_ideation_current = "yes".to_string();
    data.social_legal_impact.housing_status = "homeless".to_string();
    data.substance_use_history.iv_drug_use = "yes".to_string();
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
