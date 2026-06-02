use first_responder_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use first_responder_assessment_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    let mut d = AssessmentData::default();
    d.clinical_skills.basic_life_support = "competent".to_string();
    d.clinical_skills.patient_assessment = "competent".to_string();
    d.equipment_vehicle.defibrillator_competency = "competent".to_string();
    d.physical_fitness.patient_carry_ability = "yes".to_string();
    d.occupational_health.vision_test = "pass".to_string();
    d.occupational_health.substance_misuse_screen = "negative".to_string();
    d.occupational_health.immunisation_status = "up-to-date".to_string();
    d.occupational_health.musculoskeletal_issues = "no".to_string();
    d.psychological_readiness.ptsd_screening = "no".to_string();
    d.psychological_readiness.burnout_risk = "low".to_string();
    d.communication_skills.safeguarding_awareness = "competent".to_string();
    d.cpd_training.mandatory_training_complete = "yes".to_string();
    d
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline());
    assert!(flags.is_empty(), "baseline should have no flags: {flags:?}");
}

#[test]
fn substance_misuse_positive_emits_high_flag() {
    let mut d = baseline();
    d.occupational_health.substance_misuse_screen = "positive".to_string();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-SUBSTANCE-001" && f.priority == "high"));
}

#[test]
fn vision_fail_emits_high_flag() {
    let mut d = baseline();
    d.occupational_health.vision_test = "fail".to_string();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-VISION-001" && f.priority == "high"));
}

#[test]
fn burnout_high_emits_medium_flag() {
    let mut d = baseline();
    d.psychological_readiness.burnout_risk = "high".to_string();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-BURNOUT-001" && f.priority == "medium"));
}

#[test]
fn mandatory_training_no_emits_medium_flag() {
    let mut d = baseline();
    d.cpd_training.mandatory_training_complete = "no".to_string();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-TRAINING-001" && f.priority == "medium"));
}

#[test]
fn cpd_shortfall_emits_low_flag() {
    let mut d = baseline();
    d.cpd_training.cpd_hours_last_year = Some(20.0);
    d.cpd_training.cpd_hours_required = Some(30.0);
    let flags = detect_additional_flags(&d);
    let flag = flags.iter().find(|f| f.id == "FLAG-CPD-001").expect("cpd flag");
    assert_eq!(flag.priority, "low");
    assert!(flag.message.contains("20"));
    assert!(flag.message.contains("30"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut d = baseline();
    d.occupational_health.substance_misuse_screen = "positive".to_string(); // high
    d.psychological_readiness.burnout_risk = "high".to_string(); // medium
    d.cpd_training.cpd_hours_last_year = Some(10.0);
    d.cpd_training.cpd_hours_required = Some(30.0); // low
    let flags = detect_additional_flags(&d);
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
