use sports_medicine_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use sports_medicine_assessment_loco_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            sex: "male".to_string(),
            bmi: Some(22.0),
            ..Demographics::default()
        },
        sport_position_details: SportPositionDetails {
            contact_level: "moderate".to_string(),
            previous_clearance_issue: "no".to_string(),
            ..SportPositionDetails::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn chest_pain_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.cardiovascular_screening.chest_pain_with_exertion = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-CV-001" && f.priority == "high"));
}

#[test]
fn family_scd_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.family_history.sudden_cardiac_death_under_50 = "yes".to_string();
    data.family_history.sudden_cardiac_death_relation = "father".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-CV-003")
        .expect("scd flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("father"));
}

#[test]
fn impetigo_in_contact_sport_emits_skin_flag() {
    let mut data = baseline_case();
    data.vision_skin.impetigo_or_mrsa = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-SKIN-001" && f.priority == "high"));
}

#[test]
fn impetigo_in_low_contact_sport_emits_no_flag() {
    let mut data = baseline_case();
    data.sport_position_details.contact_level = "low".to_string();
    data.vision_skin.impetigo_or_mrsa = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(!flags.iter().any(|f| f.id == "FLAG-SKIN-001"));
}

#[test]
fn monocular_high_contact_no_eyewear_emits_high_flag() {
    let mut data = baseline_case();
    data.sport_position_details.contact_level = "high".to_string();
    data.vision_skin.monocular_athlete = "yes".to_string();
    data.vision_skin.protective_eyewear_available = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-VIS-001" && f.priority == "high"));
}

#[test]
fn three_concussions_emits_neuro_flag() {
    let mut data = baseline_case();
    data.neurological_concussion_baseline.total_concussions = Some(4);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-NEURO-002").expect("neuro flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("4"));
}

#[test]
fn hypertension_diagnosis_emits_medium_flag() {
    let mut data = baseline_case();
    data.cardiovascular_screening.high_blood_pressure_diagnosis = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-CV-005").expect("hypertension flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn high_training_load_emits_low_flag() {
    let mut data = baseline_case();
    data.sport_position_details.hours_per_week = Some(22.0);
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-LOAD-001").expect("training load flag");
    assert_eq!(flag.priority, "low");
}

#[test]
fn allergies_known_without_details_emits_low_flag() {
    let mut data = baseline_case();
    data.medical_history.allergies_known = "yes".to_string();
    data.medical_history.allergy_details = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ALG-001" && f.priority == "low"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    data.cardiovascular_screening.chest_pain_with_exertion = "yes".to_string(); // high
    data.cardiovascular_screening.high_blood_pressure_diagnosis = "yes".to_string(); // medium
    data.sport_position_details.hours_per_week = Some(25.0); // low
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
