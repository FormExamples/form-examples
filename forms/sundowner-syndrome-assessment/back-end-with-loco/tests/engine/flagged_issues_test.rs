use sundowner_syndrome_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use sundowner_syndrome_assessment_loco_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_assessment_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "empty assessment should not produce flags");
}

#[test]
fn aggressive_behaviour_emits_high_priority_flag() {
    let mut data = baseline_case();
    // Item #7 (hitting) rated 4 = several times a week -> aggressive flag.
    data.behavioural_symptoms.cmai.insert("cmai07".to_string(), 4);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-AGGRESSION-001")
        .expect("aggression flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn npi_aggression_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.behavioural_symptoms.npi.insert(
        "agitationAggression".to_string(),
        NpiDomainScore { frequency: 3, severity: 2 },
    );
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-AGGRESSION-002" && f.priority == "high")
    );
}

#[test]
fn self_harm_emits_high_priority_flag() {
    let mut data = baseline_case();
    // Item #17 intentional falling rated 3 = self-harm flag.
    data.behavioural_symptoms.cmai.insert("cmai17".to_string(), 3);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SELFHARM-001" && f.priority == "high")
    );
}

#[test]
fn fall_risk_emits_high_priority_flag() {
    let mut data = baseline_case();
    // Item #1 pacing/wandering rated 4 = fall flag.
    data.behavioural_symptoms.cmai.insert("cmai01".to_string(), 4);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-FALL-001" && f.priority == "high")
    );
}

#[test]
fn prior_delirium_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.cognitive_status.prior_delirium_history = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DELIRIUM-001" && f.priority == "high")
    );
}

#[test]
fn severe_carer_strain_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.carer_impact.carer_strain_level = "severe".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CARER-001" && f.priority == "high")
    );
}

#[test]
fn moderate_carer_strain_emits_medium_priority_flag() {
    let mut data = baseline_case();
    data.carer_impact.carer_strain_level = "moderate".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-CARER-002")
        .expect("carer-002");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn nighttime_wandering_emits_medium_priority_flag() {
    let mut data = baseline_case();
    data.sleep_wake_cycle.nighttime_wandering = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SLEEP-001" && f.priority == "medium")
    );
}

#[test]
fn anticholinergic_burden_emits_medium_priority_flag() {
    let mut data = baseline_case();
    data.medication_review.anticholinergic_burden = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MED-001" && f.priority == "medium")
    );
}

#[test]
fn sedative_plus_antipsychotic_emits_med_002() {
    let mut data = baseline_case();
    data.medication_review.sedative_use = "yes".to_string();
    data.medication_review.antipsychotic_use = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MED-002"));
    assert!(!flags.iter().any(|f| f.id == "FLAG-MED-003"));
}

#[test]
fn antipsychotic_alone_emits_med_003() {
    let mut data = baseline_case();
    data.medication_review.antipsychotic_use = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MED-003"));
    assert!(!flags.iter().any(|f| f.id == "FLAG-MED-002"));
}

#[test]
fn no_daylight_emits_low_priority_flag() {
    let mut data = baseline_case();
    data.environmental_assessment.adequate_daylight = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ENV-001" && f.priority == "low")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // One high, one medium, one low.
    data.cognitive_status.prior_delirium_history = "yes".to_string();
    data.medication_review.anticholinergic_burden = "yes".to_string();
    data.environmental_assessment.cluttered = "yes".to_string();
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

#[test]
fn short_sleep_emits_sleep_flag() {
    let mut data = baseline_case();
    data.sleep_wake_cycle.average_hours_of_sleep = Some(4.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-SLEEP-001"));
}
