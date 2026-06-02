use endocrinology_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use endocrinology_assessment_loco_crate::engine::types::*;

#[test]
fn empty_case_has_no_flags() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.is_empty());
}

#[test]
fn thyrotoxicosis_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.thyroid_axis.tsh = Some(0.05);
    data.thyroid_axis.ft4 = Some(30.0);
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-THY-001")
        .expect("thyrotoxicosis flag");
    assert_eq!(f.priority, "urgent");
}

#[test]
fn adrenal_insufficiency_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.adrenal_axis.morning_cortisol = Some(50.0);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ADR-001" && f.priority == "urgent")
    );
}

#[test]
fn severe_hypercalcaemia_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.bone_calcium.calcium_corrected = Some(3.5);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-BON-001" && f.priority == "urgent")
    );
}

#[test]
fn visual_disturbance_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.pituitary_function.visual_disturbance = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PIT-001" && f.priority == "urgent")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    // One urgent (visual), one high (steroid), one medium (autoantibodies), one low (family history).
    data.pituitary_function.visual_disturbance = "yes".to_string();
    data.medications_lifestyle.steroid_use = "yes".to_string();
    data.thyroid_axis.antibodies_positive = "yes".to_string();
    data.medications_lifestyle.family_history_endocrine = "Mother with type 1 diabetes.".to_string();
    let flags = detect_additional_flags(&data);
    let order = |p: &str| match p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    };
    let priorities: Vec<u8> = flags.iter().map(|f| order(&f.priority)).collect();
    let mut sorted = priorities.clone();
    sorted.sort();
    assert_eq!(priorities, sorted, "flags must be sorted urgent>high>medium>low");
}

#[test]
fn family_history_emits_low_flag_with_content() {
    let mut data = AssessmentData::default();
    data.medications_lifestyle.family_history_endocrine = "Father with Hashimoto.".to_string();
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-FAM-001")
        .expect("family history flag");
    assert_eq!(f.priority, "low");
    assert!(f.message.contains("Hashimoto"));
}
