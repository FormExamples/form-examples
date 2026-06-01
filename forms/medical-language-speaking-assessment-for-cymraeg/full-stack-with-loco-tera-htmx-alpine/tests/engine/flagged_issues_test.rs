use medical_language_speaking_assessment_for_cymraeg_tera_crate::engine::cymraeg_grader::grade;
use medical_language_speaking_assessment_for_cymraeg_tera_crate::engine::flagged_issues::detect_additional_flags;
use medical_language_speaking_assessment_for_cymraeg_tera_crate::engine::types::*;

fn high_band_case() -> AssessmentData {
    AssessmentData {
        linguistic_role_play1: LinguisticRating {
            fluency: Some(5),
            grammar: Some(5),
            pronunciation: Some(5),
            clinical_appropriateness: Some(5),
        },
        linguistic_role_play2: LinguisticRating {
            fluency: Some(5),
            grammar: Some(5),
            pronunciation: Some(5),
            clinical_appropriateness: Some(5),
        },
        clinical_indicators: ClinicalIndicators {
            relationship_building: Some(3),
            understanding_patient_perspective: Some(3),
            providing_structure: Some(3),
            information_gathering: Some(3),
            information_giving: Some(3),
            examiner_notes: String::new(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn high_band_no_flags() {
    let data = high_band_case();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
    assert!(flags.is_empty(), "expected no flags, got {flags:?}");
}

#[test]
fn grade_e_emits_high_priority_grade_flag() {
    let data = AssessmentData::default();
    let g = grade(&data);
    assert_eq!(g.grade, "E");
    let flags = detect_additional_flags(&data, &g);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-GRADE-001" && f.priority == "high")
    );
}

#[test]
fn low_pronunciation_emits_high_priority_flag() {
    let mut data = high_band_case();
    data.linguistic_role_play2.pronunciation = Some(1);
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-LING-PRO-001")
        .expect("pronunciation flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn pronunciation_three_emits_medium_flag() {
    let mut data = high_band_case();
    data.linguistic_role_play2.pronunciation = Some(3);
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-LING-PRO-002" && f.priority == "medium")
    );
}

#[test]
fn safety_critical_clinical_zero_emits_high_priority_flag() {
    let mut data = high_band_case();
    data.role_play1.safety_criticality = "high".to_string();
    data.clinical_indicators.relationship_building = Some(0);
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-CLIN-relationshipBuilding-0")
        .expect("relationship flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("clinical-safety failure"));
}

#[test]
fn non_safety_critical_clinical_zero_emits_medium_flag() {
    let mut data = high_band_case();
    data.clinical_indicators.providing_structure = Some(0);
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-CLIN-providingStructure-0")
        .expect("structure flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn role_play_imbalance_emits_low_flag() {
    let mut data = high_band_case();
    data.linguistic_role_play1.fluency = Some(6);
    data.linguistic_role_play2.fluency = Some(3);
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-RP-DIFF-LING-FLU" && f.priority == "low")
    );
}

#[test]
fn examiner_notes_emit_low_flags() {
    let mut data = high_band_case();
    data.role_play1.examiner_notes = "Strong opening.".to_string();
    data.role_play2.examiner_notes = "Some hesitation.".to_string();
    data.clinical_indicators.examiner_notes = "Excellent rapport.".to_string();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
    for id in ["FLAG-NOTES-RP1", "FLAG-NOTES-RP2", "FLAG-NOTES-CLIN"].iter() {
        assert!(
            flags.iter().any(|f| f.id == *id && f.priority == "low"),
            "expected {id}"
        );
    }
}

#[test]
fn flags_sorted_high_medium_low() {
    let mut data = high_band_case();
    // Force grade C (medium grade flag), low pronunciation (high) and notes (low).
    data.linguistic_role_play1 = LinguisticRating {
        fluency: Some(3),
        grammar: Some(3),
        pronunciation: Some(1),
        clinical_appropriateness: Some(3),
    };
    data.linguistic_role_play2 = LinguisticRating {
        fluency: Some(3),
        grammar: Some(3),
        pronunciation: Some(3),
        clinical_appropriateness: Some(3),
    };
    data.clinical_indicators.examiner_notes = "Some notes.".to_string();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g);
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
