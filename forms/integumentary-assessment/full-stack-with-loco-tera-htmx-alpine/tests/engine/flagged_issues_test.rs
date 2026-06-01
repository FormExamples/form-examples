use integumentary_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use integumentary_assessment_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        braden_scale: BradenScale {
            sensory_perception: Some(4),
            moisture: Some(4),
            activity: Some(4),
            mobility: Some(4),
            nutrition: Some(4),
            friction_shear: Some(3),
        },
        skin_inspection: SkinInspection {
            colour: "normal".to_string(),
            moisture: "normal".to_string(),
            integrity: "intact".to_string(),
            turgor: "normal".to_string(),
            temperature: "warm".to_string(),
            lesion_types: vec![],
            lesions: vec![],
            additional_notes: String::new(),
        },
        nail_examination: NailExamination {
            nail_capillary_refill: "brisk".to_string(),
            ..NailExamination::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(
        flags.is_empty(),
        "baseline should not produce flags: {flags:?}"
    );
}

#[test]
fn stage_iv_pressure_injury_emits_urgent_flag() {
    let mut data = baseline_case();
    data.wound_assessment.wound_present = "yes".to_string();
    data.wound_assessment.wound_stage = "stage-iv".to_string();
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-WOUND-001")
        .expect("FLAG-WOUND-001");
    assert_eq!(f.priority, "urgent");
}

#[test]
fn unstageable_wound_emits_urgent_flag() {
    let mut data = baseline_case();
    data.wound_assessment.wound_present = "yes".to_string();
    data.wound_assessment.wound_stage = "unstageable".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-WOUND-001" && f.priority == "urgent")
    );
}

#[test]
fn stage_iii_emits_high_flag() {
    let mut data = baseline_case();
    data.wound_assessment.wound_present = "yes".to_string();
    data.wound_assessment.wound_stage = "stage-iii".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-WOUND-002" && f.priority == "high")
    );
}

#[test]
fn necrotic_tissue_emits_high_flag() {
    let mut data = baseline_case();
    data.wound_assessment.wound_present = "yes".to_string();
    data.wound_assessment.tissue_type = "necrotic".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-WOUND-004" && f.priority == "high")
    );
}

#[test]
fn wound_infection_signs_emit_urgent_flag() {
    let mut data = baseline_case();
    data.wound_assessment.wound_present = "yes".to_string();
    data.wound_assessment.infection_signs = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-WOUND-005" && f.priority == "urgent")
    );
}

#[test]
fn large_wound_area_emits_high_flag() {
    let mut data = baseline_case();
    data.wound_assessment.wound_present = "yes".to_string();
    data.wound_assessment.wound_length = Some(6.0);
    data.wound_assessment.wound_width = Some(5.0);
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-WOUND-008")
        .expect("FLAG-WOUND-008");
    assert_eq!(f.priority, "high");
    assert!(f.message.contains("30"));
}

#[test]
fn low_braden_sensory_emits_high_flag() {
    let mut data = baseline_case();
    data.braden_scale.sensory_perception = Some(1);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-BRADEN-001" && f.priority == "high")
    );
}

#[test]
fn skin_breakdown_emits_high_flag() {
    let mut data = baseline_case();
    data.skin_inspection.integrity = "breakdown".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SKIN-001" && f.priority == "high")
    );
}

#[test]
fn cyanosis_emits_urgent_flag() {
    let mut data = baseline_case();
    data.skin_inspection.colour = "cyanotic".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SKIN-004" && f.priority == "urgent")
    );
}

#[test]
fn suspicious_pigmented_lesion_emits_high_flag() {
    let mut data = baseline_case();
    data.skin_inspection.lesion_types = vec!["suspicious-pigmented".to_string()];
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SKIN-006" && f.priority == "high")
    );
}

#[test]
fn photos_without_consent_emits_urgent_flag() {
    let mut data = baseline_case();
    data.photography_documentation.photos_taken = "yes".to_string();
    data.photography_documentation.consent_obtained = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DOC-001" && f.priority == "urgent")
    );
}

#[test]
fn referral_without_details_emits_medium_flag() {
    let mut data = baseline_case();
    data.clinical_impression_care_plan.referral_required = "yes".to_string();
    data.clinical_impression_care_plan.referral_details = String::new();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PLAN-001" && f.priority == "medium")
    );
}

#[test]
fn severe_pain_emits_high_flag() {
    let mut data = baseline_case();
    data.presenting_skin_concern.pain_score = Some(8);
    let flags = detect_additional_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-CONCERN-003")
        .expect("FLAG-CONCERN-003");
    assert_eq!(f.priority, "high");
    assert!(f.message.contains("8/10"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // Urgent: cyanosis. High: stage-iii. Medium: ulcer. Low: koilonychia.
    data.skin_inspection.colour = "cyanotic".to_string();
    data.wound_assessment.wound_present = "yes".to_string();
    data.wound_assessment.wound_stage = "stage-iii".to_string();
    data.skin_inspection.lesion_types = vec!["ulcer".to_string()];
    data.nail_examination.nail_findings = vec!["koilonychia".to_string()];

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
