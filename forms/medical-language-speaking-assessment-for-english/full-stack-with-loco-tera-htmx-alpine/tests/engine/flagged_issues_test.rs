use medical_language_speaking_assessment_for_english_tera_crate::engine::oet_grader::grade;
use medical_language_speaking_assessment_for_english_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        candidate: CandidateDetails::default(),
        role_play1: RolePlayContext {
            safety_criticality: "standard".to_string(),
            ..RolePlayContext::default()
        },
        role_play2: RolePlayContext {
            safety_criticality: "standard".to_string(),
            ..RolePlayContext::default()
        },
        linguistic_role_play1: LinguisticRating {
            intelligibility: Some(5.0),
            fluency: Some(5.0),
            appropriateness_of_language: Some(5.0),
            resources_of_grammar_and_expression: Some(5.0),
        },
        linguistic_role_play2: LinguisticRating {
            intelligibility: Some(5.0),
            fluency: Some(5.0),
            appropriateness_of_language: Some(5.0),
            resources_of_grammar_and_expression: Some(5.0),
        },
        clinical_indicators: ClinicalIndicators {
            relationship_building: Some(3.0),
            understanding_patient_perspective: Some(3.0),
            providing_structure: Some(3.0),
            information_gathering: Some(3.0),
            information_giving: Some(3.0),
            examiner_notes: String::new(),
        },
    }
}

#[test]
fn baseline_has_no_high_priority_flags() {
    let result = grade(&baseline_case());
    let high = result
        .additional_flags
        .iter()
        .filter(|f| f.priority == "high")
        .count();
    assert_eq!(high, 0, "no high-priority flags expected, got: {:?}", result.additional_flags);
}

#[test]
fn low_intelligibility_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.linguistic_role_play1.intelligibility = Some(2.0);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-LING-INT-001" && f.priority == "high")
    );
}

#[test]
fn grade_e_emits_high_priority_grade_flag() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.grade, "E");
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-GRADE-001" && f.priority == "high")
    );
}

#[test]
fn zero_clinical_indicator_in_safety_critical_scenario_is_high_priority() {
    let mut data = baseline_case();
    data.role_play1.safety_criticality = "high".to_string();
    data.clinical_indicators.relationship_building = Some(0.0);
    let result = grade(&data);
    let flag = result
        .additional_flags
        .iter()
        .find(|f| f.id == "FLAG-CLIN-relationshipBuilding-0")
        .expect("clinical indicator 0 flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn role_play_imbalance_emits_low_priority_flag() {
    let mut data = baseline_case();
    data.linguistic_role_play1.fluency = Some(6.0);
    data.linguistic_role_play2.fluency = Some(3.0);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-RP-DIFF-LING-FLU" && f.priority == "low")
    );
}

#[test]
fn examiner_notes_on_role_play_1_emit_low_priority_flag() {
    let mut data = baseline_case();
    data.role_play1.examiner_notes = "Strong empathy throughout.".to_string();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-NOTES-RP1" && f.priority == "low")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // High: low intelligibility
    data.linguistic_role_play1.intelligibility = Some(2.0);
    // Medium: low fluency
    data.linguistic_role_play2.fluency = Some(3.0);
    // Low: examiner notes
    data.role_play1.examiner_notes = "Noted.".to_string();
    let result = grade(&data);
    let priorities: Vec<&str> = result
        .additional_flags
        .iter()
        .map(|f| f.priority.as_str())
        .collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
