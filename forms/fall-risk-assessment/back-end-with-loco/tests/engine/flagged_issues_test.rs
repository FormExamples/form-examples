use fall_risk_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use fall_risk_assessment_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData {
        mfs: MorseFallScale {
            history_of_falling: Some(0),
            secondary_diagnosis: Some(0),
            ambulatory_aid: Some(0),
            iv_or_heparin_lock: Some(0),
            gait_transferring: Some(0),
            mental_status: Some(0),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn recent_injurious_fall_emits_high_priority_flag() {
    let mut data = baseline();
    data.fall_history.has_fallen_in_past_year = "yes".to_string();
    data.fall_history.most_recent_fall_injurious = "yes".to_string();
    data.fall_history.most_recent_fall_injury_details =
        "Wrist fracture (Colles).".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-FALL-001")
        .expect("fall flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Wrist fracture"));
}

#[test]
fn anticoagulation_emits_high_priority_flag() {
    let mut data = baseline();
    data.medication_review.anticoagulants = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MED-001" && f.priority == "high")
    );
}

#[test]
fn severe_orthostatic_hypotension_emits_flag() {
    let mut data = baseline();
    data.mobility_gait.orthostatic_hypotension_severe = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MOB-001" && f.priority == "high")
    );
}

#[test]
fn dementia_emits_high_priority_flag() {
    let mut data = baseline();
    data.cognitive.dementia_diagnosis = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-COG-001" && f.priority == "high")
    );
}

#[test]
fn hip_protectors_absent_high_risk_emits_flag() {
    let mut data = baseline();
    // Push MFS into the high band.
    data.mfs.history_of_falling = Some(25);
    data.mfs.ambulatory_aid = Some(30);
    data.environmental.hip_protectors_used = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ENV-001"));
}

#[test]
fn hip_protectors_absent_low_risk_does_not_emit_flag() {
    let mut data = baseline();
    // MFS stays at 0 = low.
    data.environmental.hip_protectors_used = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(!flags.iter().any(|f| f.id == "FLAG-ENV-001"));
}

#[test]
fn polypharmacy_via_four_medications_emits_flag() {
    let mut data = baseline();
    data.medication_review.medications = vec![
        Medication { name: "Drug A".to_string(), dose: String::new(), frequency: String::new() },
        Medication { name: "Drug B".to_string(), dose: String::new(), frequency: String::new() },
        Medication { name: "Drug C".to_string(), dose: String::new(), frequency: String::new() },
        Medication { name: "Drug D".to_string(), dose: String::new(), frequency: String::new() },
    ];
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-MED-002")
        .expect("polypharmacy flag");
    assert_eq!(flag.priority, "medium");
    assert!(flag.message.contains("4 medications"));
}

#[test]
fn uncorrected_vision_impairment_emits_flag() {
    let mut data = baseline();
    data.vision_sensory.vision_impairment = "yes".to_string();
    data.vision_sensory.vision_corrected = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-VIS-001" && f.priority == "medium")
    );
}

#[test]
fn environmental_hazards_combine_into_one_flag() {
    let mut data = baseline();
    data.environmental.loos_throw_rugs = "yes".to_string();
    data.environmental.poor_lighting = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-ENV-002")
        .expect("env hazards flag");
    assert!(flag.message.contains("loose throw rugs"));
    assert!(flag.message.contains("poor lighting"));
}

#[test]
fn intervention_declined_emits_low_priority_flag() {
    let mut data = baseline();
    data.previous_interventions.intervention_declined = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-INT-001" && f.priority == "low")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    // High: anticoagulation.
    data.medication_review.anticoagulants = "yes".to_string();
    // Medium: uncorrected vision impairment.
    data.vision_sensory.vision_impairment = "yes".to_string();
    data.vision_sensory.vision_corrected = "no".to_string();
    // Low: intervention declined.
    data.previous_interventions.intervention_declined = "yes".to_string();
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
