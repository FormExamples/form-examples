use vaccinations_checklist_tera_crate::engine::flagged_issues::detect_additional_flags;
use vaccinations_checklist_tera_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline());
    assert!(flags.is_empty(), "baseline should produce no flags: {flags:?}");
}

#[test]
fn anaphylaxis_history_emits_high_priority_flag() {
    let mut data = baseline();
    data.vaccination_history.adverse_reaction_severity = "anaphylaxis".to_string();
    data.vaccination_history.adverse_reaction_vaccine = "MMR".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-ANAPH-001").expect("anaphylaxis flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("MMR"));
}

#[test]
fn immunocompromised_emits_high_priority_flag() {
    let mut data = baseline();
    data.vaccination_history.immunocompromised = "yes".to_string();
    data.vaccination_history.immunocompromised_details = "Lymphoma".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-IMMUNO-001" && f.priority == "high"));
}

#[test]
fn pregnancy_emits_high_priority_flag() {
    let mut data = baseline();
    data.vaccination_history.pregnant_or_planning = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-PREG-001" && f.priority == "high"));
}

#[test]
fn active_exposure_incident_emits_high_priority_flag() {
    let mut data = baseline();
    data.schedule_compliance.active_exposure_incident = "yes".to_string();
    data.schedule_compliance.active_exposure_details = "Needle-stick injury".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-EXPOSURE-001").expect("exposure flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Needle-stick injury"));
}

#[test]
fn egg_allergy_anaphylaxis_emits_high_priority_flag() {
    let mut data = baseline();
    data.contraindications_allergies.egg_allergy = "yes".to_string();
    data.contraindications_allergies.egg_allergy_severity = "anaphylaxis".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-EGG-001" && f.priority == "high"));
}

#[test]
fn tb_igra_positive_emits_high_priority_flag() {
    let mut data = baseline();
    data.serology_immunity_testing.tb_igra_result = "positive".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-TB-001" && f.priority == "high"));
}

#[test]
fn measles_negative_emits_medium_priority_flag() {
    let mut data = baseline();
    data.serology_immunity_testing.measles_ig_g = "negative".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-MEASLES-001").expect("measles flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn oh_clearance_no_emits_medium_priority_flag() {
    let mut data = baseline();
    data.schedule_compliance.occupational_health_clearance = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-OH-001" && f.priority == "medium"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    data.vaccination_history.pregnant_or_planning = "yes".to_string();
    data.serology_immunity_testing.measles_ig_g = "negative".to_string();
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
