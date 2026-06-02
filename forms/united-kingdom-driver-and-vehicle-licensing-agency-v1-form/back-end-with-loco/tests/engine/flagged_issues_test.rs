use united_kingdom_driver_and_vehicle_licensing_agency_v1_form_loco_crate::engine::flagged_issues::detect_flagged_issues;
use united_kingdom_driver_and_vehicle_licensing_agency_v1_form_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData {
        eyesight_standards: EyesightStandards {
            meets_standard: "yes-with-correction".to_string(),
        },
        vision_in_both_eyes: VisionInBothEyes {
            has_vision_in_both_eyes: "yes".to_string(),
            ..VisionInBothEyes::default()
        },
        field_of_vision: FieldOfVision {
            has_problem: "no".to_string(),
            ..FieldOfVision::default()
        },
        glaucoma: Glaucoma {
            has_condition: "no".to_string(),
            ..Glaucoma::default()
        },
        retinitis_pigmentosa: RetinitisPigmentosa {
            has_condition: "no".to_string(),
            ..RetinitisPigmentosa::default()
        },
        laser_treatment: LaserTreatment {
            has_had_treatment: "no".to_string(),
            ..LaserTreatment::default()
        },
        blepharospasm: Blepharospasm {
            has_condition: "no".to_string(),
            ..Blepharospasm::default()
        },
        night_blindness: NightBlindness {
            has_condition: "no".to_string(),
            ..NightBlindness::default()
        },
        double_vision: DoubleVision {
            has_condition: "no".to_string(),
            ..DoubleVision::default()
        },
        other_vision_conditions: OtherVisionConditions {
            has_other: "no".to_string(),
            ..OtherVisionConditions::default()
        },
        recent_contact: RecentContact {
            had_contact: "yes".to_string(),
            date_of_contact: "2026-05-01".to_string(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_flagged_issues(&baseline());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn eyesight_failure_is_urgent() {
    let mut d = baseline();
    d.eyesight_standards.meets_standard = "no".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-EYE-001").expect("eye flag");
    assert_eq!(flag.priority, "urgent");
}

#[test]
fn monocular_not_adapted_is_high() {
    let mut d = baseline();
    d.vision_in_both_eyes.has_vision_in_both_eyes = "no".to_string();
    d.vision_in_both_eyes.adaptation = "not-adapted".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-MONO-001").expect("mono flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn monocular_adapted_self_is_medium() {
    let mut d = baseline();
    d.vision_in_both_eyes.has_vision_in_both_eyes = "no".to_string();
    d.vision_in_both_eyes.adaptation = "adapted-self".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-MONO-002").expect("mono flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn monocular_adapted_advised_is_low() {
    let mut d = baseline();
    d.vision_in_both_eyes.has_vision_in_both_eyes = "no".to_string();
    d.vision_in_both_eyes.adaptation = "adapted-advised".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-MONO-003").expect("mono flag");
    assert_eq!(flag.priority, "low");
}

#[test]
fn visual_field_non_ocular_cause_is_high() {
    let mut d = baseline();
    d.field_of_vision.has_problem = "yes".to_string();
    d.field_of_vision.caused_solely_by_eye_condition = "no".to_string();
    d.field_of_vision.cause = "stroke".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-VF-001").expect("vf flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("stroke"));
}

#[test]
fn glaucoma_both_eyes_is_high() {
    let mut d = baseline();
    d.glaucoma.has_condition = "yes".to_string();
    d.glaucoma.which_eyes = "both".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-GLA-001").expect("gla flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn glaucoma_one_eye_is_medium() {
    let mut d = baseline();
    d.glaucoma.has_condition = "yes".to_string();
    d.glaucoma.which_eyes = "left".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-GLA-001").expect("gla flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn retinitis_pigmentosa_is_high() {
    let mut d = baseline();
    d.retinitis_pigmentosa.has_condition = "yes".to_string();
    d.retinitis_pigmentosa.which_eyes = "both".to_string();
    let flags = detect_flagged_issues(&d);
    assert!(flags.iter().any(|f| f.id == "V1-FLAG-RP-001" && f.priority == "high"));
}

#[test]
fn blepharospasm_uncontrolled_is_high() {
    let mut d = baseline();
    d.blepharospasm.has_condition = "yes".to_string();
    d.blepharospasm.adequately_controlled = "no".to_string();
    let flags = detect_flagged_issues(&d);
    assert!(flags.iter().any(|f| f.id == "V1-FLAG-BLEPH-001" && f.priority == "high"));
}

#[test]
fn night_blindness_is_medium() {
    let mut d = baseline();
    d.night_blindness.has_condition = "yes".to_string();
    d.night_blindness.which_eyes = "both".to_string();
    let flags = detect_flagged_issues(&d);
    assert!(flags.iter().any(|f| f.id == "V1-FLAG-NB-001" && f.priority == "medium"));
}

#[test]
fn double_vision_uncontrolled_under_six_months_is_urgent() {
    let mut d = baseline();
    d.double_vision.has_condition = "yes".to_string();
    d.double_vision.controlled = "no".to_string();
    d.double_vision.same_for_six_months_or_more = "no".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-DV-002").expect("dv flag");
    assert_eq!(flag.priority, "urgent");
}

#[test]
fn double_vision_uncontrolled_stable_is_high() {
    let mut d = baseline();
    d.double_vision.has_condition = "yes".to_string();
    d.double_vision.controlled = "no".to_string();
    d.double_vision.same_for_six_months_or_more = "yes".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-DV-001").expect("dv flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn double_vision_controlled_is_medium() {
    let mut d = baseline();
    d.double_vision.has_condition = "yes".to_string();
    d.double_vision.controlled = "yes".to_string();
    let flags = detect_flagged_issues(&d);
    let flag = flags.iter().find(|f| f.id == "V1-FLAG-DV-003").expect("dv flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn other_vision_condition_is_medium() {
    let mut d = baseline();
    d.other_vision_conditions.has_other = "yes".to_string();
    let flags = detect_flagged_issues(&d);
    assert!(flags.iter().any(|f| f.id == "V1-FLAG-OTH-001" && f.priority == "medium"));
}

#[test]
fn no_recent_contact_is_low() {
    let mut d = baseline();
    d.recent_contact.had_contact = "no".to_string();
    d.recent_contact.date_of_contact = String::new();
    let flags = detect_flagged_issues(&d);
    assert!(flags.iter().any(|f| f.id == "V1-FLAG-CONTACT-001" && f.priority == "low"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut d = baseline();
    d.eyesight_standards.meets_standard = "no".to_string(); // urgent
    d.glaucoma.has_condition = "yes".to_string();
    d.glaucoma.which_eyes = "both".to_string(); // high
    d.other_vision_conditions.has_other = "yes".to_string(); // medium
    d.recent_contact.had_contact = "no".to_string();
    d.recent_contact.date_of_contact = String::new(); // low
    let flags = detect_flagged_issues(&d);
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
