use learning_disability_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use learning_disability_assessment_tera_crate::engine::types::*;

fn clean_baseline() -> AssessmentData {
    // A baseline where the reasonable-adjustments flag has been set so the
    // automatic FLAG-ADJ-001 doesn't fire — leaving the result truly clean.
    AssessmentData {
        reasonable_adjustments: ReasonableAdjustments {
            flag_on_record: "yes".to_string(),
            ..ReasonableAdjustments::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn clean_baseline_has_no_flags() {
    let flags = detect_additional_flags(&clean_baseline());
    assert!(flags.is_empty(), "expected no flags; got {flags:?}");
}

#[test]
fn frequent_seizures_emits_urgent_flag() {
    let mut data = clean_baseline();
    data.medical_review.has_epilepsy = "yes".to_string();
    data.medical_review.seizures_per_month = Some(6);
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-EPI-001")
        .expect("urgent epilepsy flag");
    assert_eq!(f.priority, "urgent");
    assert!(f.message.contains("6"));
}

#[test]
fn active_epilepsy_without_frequent_seizures_emits_high_flag() {
    let mut data = clean_baseline();
    data.medical_review.has_epilepsy = "yes".to_string();
    data.medical_review.seizures_per_month = Some(1);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-EPI-002" && f.priority == "high"));
}

#[test]
fn psychotropic_without_stomp_review_emits_high_flag() {
    let mut data = clean_baseline();
    data.medical_review.takes_psychotropic = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-STOMP-001" && f.priority == "high"));
}

#[test]
fn psychotropic_with_stomp_review_emits_low_flag() {
    let mut data = clean_baseline();
    data.medical_review.takes_psychotropic = "yes".to_string();
    data.medical_review.stomp_review_done = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-STOMP-002" && f.priority == "low"));
}

#[test]
fn dysphagia_emits_high_flag() {
    let mut data = clean_baseline();
    data.medical_review.has_dysphagia = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-DYS-001" && f.priority == "high"));
}

#[test]
fn low_bmi_emits_medium_flag() {
    let mut data = clean_baseline();
    data.physical_examination.bmi = Some(17.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BMI-001" && f.priority == "medium"));
}

#[test]
fn high_bmi_emits_medium_flag() {
    let mut data = clean_baseline();
    data.physical_examination.bmi = Some(33.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BMI-002" && f.priority == "medium"));
}

#[test]
fn hypertension_emits_medium_flag() {
    let mut data = clean_baseline();
    data.physical_examination.blood_pressure_systolic = Some(155);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BP-001" && f.priority == "medium"));
}

#[test]
fn missed_vision_check_emits_screening_flag() {
    let mut data = clean_baseline();
    data.physical_examination.vision_checked = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-SCREEN-001"));
}

#[test]
fn self_injurious_behaviour_emits_high_flag() {
    let mut data = clean_baseline();
    data.behavioural_concerns.self_injurious = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BEH-001" && f.priority == "high"));
    // Also FLAG-BEH-005 because no behaviour support plan.
    assert!(flags.iter().any(|f| f.id == "FLAG-BEH-005" && f.priority == "high"));
}

#[test]
fn capacity_concerns_emit_high_flags() {
    let mut data = clean_baseline();
    data.mental_capacity_consent.can_consent_to_health_check = "no".to_string();
    data.mental_capacity_consent.can_consent_to_medication = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-CAP-001" && f.priority == "high"));
    assert!(flags.iter().any(|f| f.id == "FLAG-CAP-002" && f.priority == "high"));
}

#[test]
fn non_verbal_emits_communication_flag() {
    let mut data = clean_baseline();
    data.communication_needs.verbal_ability = "non-verbal".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-COMM-001" && f.priority == "medium"));
}

#[test]
fn interpreter_required_includes_language() {
    let mut data = clean_baseline();
    data.communication_needs.needs_interpreter = "yes".to_string();
    data.communication_needs.interpreter_language = "British Sign Language".to_string();
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-COMM-002")
        .expect("interpreter flag");
    assert!(f.message.contains("British Sign Language"));
}

#[test]
fn missing_record_flag_emits_adjustment_flag() {
    let mut data = clean_baseline();
    data.reasonable_adjustments.flag_on_record = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ADJ-001" && f.priority == "medium"));
}

#[test]
fn flags_are_sorted_urgent_first() {
    let mut data = clean_baseline();
    data.medical_review.has_epilepsy = "yes".to_string();
    data.medical_review.seizures_per_month = Some(10); // urgent
    data.behavioural_concerns.self_injurious = "yes".to_string(); // high
    data.physical_examination.bmi = Some(31.0); // medium
    data.medical_review.takes_psychotropic = "yes".to_string();
    data.medical_review.stomp_review_done = "yes".to_string(); // low
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
    assert_eq!(priorities.first().copied(), Some("urgent"));
}
