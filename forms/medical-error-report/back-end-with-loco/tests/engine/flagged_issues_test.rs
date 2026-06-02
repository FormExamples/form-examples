use medical_error_report_loco_crate::engine::flagged_issues::detect_additional_flags;
use medical_error_report_loco_crate::engine::types::*;

#[test]
fn empty_assessment_has_no_flags() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.is_empty());
}

#[test]
fn patient_death_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.patient_outcome.patient_died = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DEATH-001" && f.priority == "high")
    );
}

#[test]
fn critical_who_severity_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.error_classification.who_severity = "critical".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CRITICAL-001" && f.priority == "high")
    );
}

#[test]
fn permanent_disability_emits_flag_with_detail() {
    let mut data = AssessmentData::default();
    data.patient_outcome.permanent_disability = "yes".to_string();
    data.patient_outcome.disability_details = "Loss of vision in left eye.".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-DISABILITY-001")
        .expect("disability flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Loss of vision"));
}

#[test]
fn duty_of_candour_incomplete_emits_flag() {
    let mut data = AssessmentData::default();
    data.patient_involvement.duty_of_candour_applies = "yes".to_string();
    data.patient_involvement.duty_of_candour_completed = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DOC-001" && f.priority == "high")
    );
}

#[test]
fn clearly_preventable_emits_flag() {
    let mut data = AssessmentData::default();
    data.error_classification.preventability = "clearly-preventable".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PREVENT-001" && f.priority == "high")
    );
}

#[test]
fn recurrence_very_likely_emits_flag() {
    let mut data = AssessmentData::default();
    data.error_classification.recurrence_likelihood = "very-likely".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-RECUR-001" && f.priority == "high")
    );
}

#[test]
fn medication_error_emits_medium_flag_with_stage() {
    let mut data = AssessmentData::default();
    data.error_classification.error_type = "medication".to_string();
    data.error_classification.medication_error_stage = "prescribing".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-MED-001")
        .expect("medication flag");
    assert_eq!(flag.priority, "medium");
    assert!(flag.message.contains("prescribing"));
}

#[test]
fn understaffed_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.incident_details.staffing_level = "understaffed".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-STAFF-001" && f.priority == "medium")
    );
}

#[test]
fn rca_pending_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.root_cause_analysis.rca_conducted = "pending".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-RCA-001" && f.priority == "medium")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    // High: patient death, MERP I (two high flags)
    data.patient_outcome.patient_died = "yes".to_string();
    data.error_classification.ncc_merp_category = "I".to_string();
    // Medium: understaffed
    data.incident_details.staffing_level = "understaffed".to_string();
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
