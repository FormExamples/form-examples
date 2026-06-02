use obstetrics_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use obstetrics_assessment_loco_crate::engine::types::*;

#[test]
fn baseline_assessment_has_no_flags() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.is_empty(), "baseline produced flags: {flags:?}");
}

#[test]
fn self_harm_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.mental_health_assessment.self_harm_ideation = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MH-001" && f.priority == "urgent"));
}

#[test]
fn domestic_abuse_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.lifestyle_social_factors.domestic_abuse = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-SAFEGUARD-001" && f.priority == "urgent"));
}

#[test]
fn reduced_fetal_movements_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.fetal_assessment.reduced_fetal_movements = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-FETAL-001" && f.priority == "urgent"));
}

#[test]
fn bmi_35_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.maternal_demographics.bmi = Some(36.5);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BMI-001" && f.priority == "high"));
}

#[test]
fn bmi_30_emits_medium_priority_flag() {
    let mut data = AssessmentData::default();
    data.maternal_demographics.bmi = Some(31.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BMI-002" && f.priority == "medium"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    // urgent + high + medium
    data.mental_health_assessment.self_harm_ideation = "yes".to_string();
    data.medical_history.cardiac_disease = "yes".to_string();
    data.lifestyle_social_factors.smoking_status = "current".to_string();
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });
    assert_eq!(priorities, sorted);
}
