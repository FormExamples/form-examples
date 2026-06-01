use seasonal_affective_disorder_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use seasonal_affective_disorder_assessment_tera_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn baseline_emits_no_flags() {
    let flags = detect_additional_flags(&baseline(), "no-sad", 0, "no-sad");
    assert!(flags.is_empty(), "baseline should be flag-free: {flags:?}");
}

#[test]
fn suicidal_ideation_emits_high_flag() {
    let mut data = baseline();
    data.risk_assessment.suicidal_ideation = "yes".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-RISK-001")
        .expect("FLAG-RISK-001");
    assert_eq!(flag.priority, "high");
}

#[test]
fn suicidal_intent_emits_high_flag() {
    let mut data = baseline();
    data.risk_assessment.suicidal_intent = "yes".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-002" && f.priority == "high"));
}

#[test]
fn suicidal_plan_text_emits_high_flag() {
    let mut data = baseline();
    data.risk_assessment.suicidal_plan = "Considered overdose this week.".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-003" && f.priority == "high"));
}

#[test]
fn self_harm_yes_emits_high_flag() {
    let mut data = baseline();
    data.risk_assessment.self_harm = "yes".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-004" && f.priority == "high"));
}

#[test]
fn previous_attempt_emits_high_flag() {
    let mut data = baseline();
    data.risk_assessment.previous_attempt = "yes".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-005" && f.priority == "high"));
}

#[test]
fn phq9_q9_positive_emits_high_flag() {
    let mut data = baseline();
    data.current_mood.phq9.q9 = Some(2);
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-PHQ9-Q9")
        .expect("FLAG-PHQ9-Q9");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("2/3"));
}

#[test]
fn phq9_severe_total_emits_high_flag() {
    let data = baseline();
    let flags = detect_additional_flags(&data, "no-sad", 22, "critical");
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-PHQ9-SEVERE")
        .expect("FLAG-PHQ9-SEVERE");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("22/27"));
}

#[test]
fn seasonal_impact_with_sad_likely_and_work_impaired() {
    let mut data = baseline();
    data.social_occupational.work_impaired = "yes".to_string();
    let flags = detect_additional_flags(&data, "sad-likely", 5, "moderate");
    assert!(flags.iter().any(|f| f.id == "FLAG-SEASONAL-IMPACT" && f.priority == "high"));
}

#[test]
fn no_current_treatment_at_moderate_emits_medium_flag() {
    let data = baseline();
    let flags = detect_additional_flags(&data, "sad-likely", 10, "moderate");
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-CARE-001")
        .expect("FLAG-CARE-001");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn current_treatment_yes_suppresses_care_001() {
    let mut data = baseline();
    data.previous_treatments.current_treatment = "yes".to_string();
    let flags = detect_additional_flags(&data, "sad-likely", 10, "moderate");
    assert!(!flags.iter().any(|f| f.id == "FLAG-CARE-001"));
}

#[test]
fn light_therapy_access_no_emits_medium_flag() {
    let mut data = baseline();
    data.light_exposure.light_therapy_access = "no".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "no-sad");
    assert!(flags.iter().any(|f| f.id == "FLAG-CARE-002" && f.priority == "medium"));
}

#[test]
fn low_outdoor_minutes_emits_low_flag() {
    let mut data = baseline();
    data.light_exposure.daily_outdoor_minutes = Some(15);
    let flags = detect_additional_flags(&data, "no-sad", 0, "no-sad");
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-LIFE-001")
        .expect("FLAG-LIFE-001");
    assert_eq!(flag.priority, "low");
    assert!(flag.message.contains("15 min/day"));
}

#[test]
fn high_latitude_emits_low_flag() {
    let mut data = baseline();
    data.demographics.latitude = "54.5N".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "no-sad");
    assert!(flags.iter().any(|f| f.id == "FLAG-LIFE-005" && f.priority == "low"));
}

#[test]
fn carbohydrate_craving_emits_low_flag() {
    let mut data = baseline();
    data.appetite_weight.carbohydrate_craving = "yes".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "no-sad");
    assert!(flags.iter().any(|f| f.id == "FLAG-LIFE-004" && f.priority == "low"));
}

#[test]
fn safety_plan_missing_with_risk_emits_medium_flag() {
    let mut data = baseline();
    data.risk_assessment.suicidal_ideation = "yes".to_string();
    data.risk_assessment.safety_plan_in_place = "no".to_string();
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
    assert!(flags.iter().any(|f| f.id == "FLAG-CARE-005" && f.priority == "medium"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    data.risk_assessment.suicidal_ideation = "yes".to_string(); // high
    data.light_exposure.light_therapy_access = "no".to_string(); // medium
    data.appetite_weight.carbohydrate_craving = "yes".to_string(); // low
    let flags = detect_additional_flags(&data, "no-sad", 0, "critical");
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
