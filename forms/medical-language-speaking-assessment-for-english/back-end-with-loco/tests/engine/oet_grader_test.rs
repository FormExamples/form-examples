use medical_language_speaking_assessment_for_english_loco_crate::engine::oet_grader::grade;
use medical_language_speaking_assessment_for_english_loco_crate::engine::rules::criterion_registry;
use medical_language_speaking_assessment_for_english_loco_crate::engine::types::*;

/// Build a fully-rated assessment with perfect (max-band) scores.
fn perfect_case() -> AssessmentData {
    AssessmentData {
        candidate: CandidateDetails {
            candidate_id: "C-001".to_string(),
            candidate_name: "Anika Sharma".to_string(),
            examiner_name: "Dr Examiner".to_string(),
            test_centre: "London".to_string(),
            test_date: "2026-06-01".to_string(),
            profession: "medicine".to_string(),
            first_language: "Hindi".to_string(),
            country_of_training: "India".to_string(),
            years_of_experience: "5".to_string(),
        },
        role_play1: RolePlayContext {
            scenario_title: "Headache follow-up".to_string(),
            scenario_summary: "Patient interview about persistent headaches.".to_string(),
            patient_role: "Adult patient".to_string(),
            setting: "GP clinic".to_string(),
            safety_criticality: "standard".to_string(),
            examiner_notes: String::new(),
        },
        role_play2: RolePlayContext {
            scenario_title: "Discharge plan".to_string(),
            scenario_summary: "Explain medication and follow-up.".to_string(),
            patient_role: "Adult patient".to_string(),
            setting: "Outpatient".to_string(),
            safety_criticality: "standard".to_string(),
            examiner_notes: String::new(),
        },
        linguistic_role_play1: LinguisticRating {
            intelligibility: Some(6.0),
            fluency: Some(6.0),
            appropriateness_of_language: Some(6.0),
            resources_of_grammar_and_expression: Some(6.0),
        },
        linguistic_role_play2: LinguisticRating {
            intelligibility: Some(6.0),
            fluency: Some(6.0),
            appropriateness_of_language: Some(6.0),
            resources_of_grammar_and_expression: Some(6.0),
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
fn empty_assessment_grades_as_e() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.grade, "E");
    assert_eq!(result.scaled_score, 0);
    assert_eq!(result.linguistic_total, 0.0);
    assert_eq!(result.clinical_total, 0.0);
    assert_eq!(result.raw_total, 0.0);
}

#[test]
fn perfect_assessment_grades_as_a() {
    let data = perfect_case();
    let result = grade(&data);
    assert_eq!(result.grade, "A");
    assert_eq!(result.scaled_score, 500);
    assert_eq!(result.linguistic_total, 24.0);
    assert_eq!(result.clinical_total, 15.0);
    assert_eq!(result.raw_total, 39.0);
}

#[test]
fn criterion_ids_are_unique_and_complete() {
    let registry = criterion_registry();
    assert_eq!(registry.len(), 9, "9 criteria: 4 linguistic + 5 clinical");
    let mut ids: Vec<&str> = registry.iter().map(|c| c.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "criterion IDs must be unique");
}

#[test]
fn linguistic_mean_or_single_uses_single_value() {
    // Only role-play 1 rated; the engine should treat it as the mean.
    let mut data = perfect_case();
    data.linguistic_role_play2 = LinguisticRating::default();
    data.clinical_indicators = ClinicalIndicators::default();
    let result = grade(&data);
    assert_eq!(result.linguistic_total, 24.0);
    // Without clinical ratings the clinical total stays at 0.
    assert_eq!(result.clinical_total, 0.0);
}

#[test]
fn per_criterion_table_has_nine_entries() {
    let data = perfect_case();
    let result = grade(&data);
    assert_eq!(result.per_criterion_scores.len(), 9);
}

#[test]
fn scaled_score_band_boundaries() {
    // Half of perfect (linguistic only) ≈ 308 -> grade C+
    let mut data = perfect_case();
    data.clinical_indicators = ClinicalIndicators::default();
    let result = grade(&data);
    // 24/39 * 500 = 307.69 -> 308
    assert_eq!(result.scaled_score, 308);
    assert_eq!(result.grade, "C+");
}

#[test]
fn fired_rules_only_for_rated_criteria() {
    let mut data = perfect_case();
    // Drop one criterion across both role-plays so it is unrated.
    data.linguistic_role_play1.fluency = None;
    data.linguistic_role_play2.fluency = None;
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "LING-INT"));
    assert!(!result.fired_rules.iter().any(|r| r.id == "LING-FLU"));
}
