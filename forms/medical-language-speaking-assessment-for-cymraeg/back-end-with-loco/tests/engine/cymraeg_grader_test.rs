use medical_language_speaking_assessment_for_cymraeg_loco_crate::engine::cymraeg_grader::grade;
use medical_language_speaking_assessment_for_cymraeg_loco_crate::engine::cymraeg_rules::all_criteria;
use medical_language_speaking_assessment_for_cymraeg_loco_crate::engine::types::*;

/// Build a fully-rated assessment with perfect scores.
fn perfect_case() -> AssessmentData {
    AssessmentData {
        candidate: CandidateDetails {
            candidate_id: "C-001".to_string(),
            candidate_name: "Cerys Davies".to_string(),
            examiner_name: "Dr Hywel Jones".to_string(),
            test_centre: "Bangor".to_string(),
            test_date: "2026-06-01".to_string(),
            profession: "medicine".to_string(),
            first_language: "Cymraeg".to_string(),
            country_of_training: "United Kingdom".to_string(),
            years_of_experience: "5".to_string(),
        },
        role_play1: RolePlayContext {
            scenario_title: "Cwyn am gefn".to_string(),
            scenario_summary: "Back pain consultation in Welsh.".to_string(),
            patient_role: "Adult patient".to_string(),
            setting: "meddygfa".to_string(),
            safety_criticality: "standard".to_string(),
            examiner_notes: String::new(),
        },
        role_play2: RolePlayContext {
            scenario_title: "Esboniad am ddiabetes".to_string(),
            scenario_summary: "Explanation of new diabetes diagnosis.".to_string(),
            patient_role: "Adult patient".to_string(),
            setting: "ysbyty".to_string(),
            safety_criticality: "standard".to_string(),
            examiner_notes: String::new(),
        },
        linguistic_role_play1: LinguisticRating {
            fluency: Some(6),
            grammar: Some(6),
            pronunciation: Some(6),
            clinical_appropriateness: Some(6),
        },
        linguistic_role_play2: LinguisticRating {
            fluency: Some(6),
            grammar: Some(6),
            pronunciation: Some(6),
            clinical_appropriateness: Some(6),
        },
        clinical_indicators: ClinicalIndicators {
            relationship_building: Some(3),
            understanding_patient_perspective: Some(3),
            providing_structure: Some(3),
            information_gathering: Some(3),
            information_giving: Some(3),
            examiner_notes: String::new(),
        },
    }
}

#[test]
fn empty_case_grades_as_e() {
    // Anchor: a fully unrated submission grades as E, per the JS reference.
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.grade, "E");
    assert_eq!(result.scaled_score, 0);
    assert_eq!(result.linguistic_total, 0.0);
    assert_eq!(result.clinical_total, 0.0);
    assert_eq!(result.raw_total, 0.0);
}

#[test]
fn perfect_case_grades_as_a() {
    let data = perfect_case();
    let result = grade(&data);
    // 4 linguistic criteria * mean(6,6)=6 -> 24; 5 clinical * 3 -> 15; raw 39.
    assert_eq!(result.linguistic_total, 24.0);
    assert_eq!(result.clinical_total, 15.0);
    assert_eq!(result.raw_total, 39.0);
    assert_eq!(result.scaled_score, 500);
    assert_eq!(result.grade, "A");
}

#[test]
fn criterion_ids_are_unique_and_known() {
    let crit = all_criteria();
    let mut ids: Vec<&str> = crit.iter().map(|c| c.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "criterion IDs must be unique");

    // The JS reference defines exactly nine criteria.
    assert_eq!(crit.len(), 9);
    let expected = [
        "LING-FLU", "LING-GRM", "LING-PRO", "LING-APP", "CLIN-REL", "CLIN-UPP", "CLIN-STR",
        "CLIN-IGT", "CLIN-IGV",
    ];
    for id in expected.iter() {
        assert!(crit.iter().any(|c| c.id == *id), "missing criterion {id}");
    }
}

#[test]
fn single_role_play_rating_is_treated_as_the_mean() {
    // Only role-play 1 is rated; the JS reference uses the single value as
    // the criterion mean rather than halving it.
    let mut data = perfect_case();
    data.linguistic_role_play2 = LinguisticRating::default();
    let result = grade(&data);
    // 4 linguistic criteria * 6 = 24; 5 clinical * 3 = 15; raw 39.
    assert_eq!(result.linguistic_total, 24.0);
    assert_eq!(result.scaled_score, 500);
    assert_eq!(result.grade, "A");
}

#[test]
fn mid_range_scores_yield_band_b() {
    // 4 linguistic mean of 5 -> 20; 5 clinical of 2 -> 10; raw 30; scaled 385 -> B.
    let mut data = perfect_case();
    data.linguistic_role_play1 = LinguisticRating {
        fluency: Some(5),
        grammar: Some(5),
        pronunciation: Some(5),
        clinical_appropriateness: Some(5),
    };
    data.linguistic_role_play2 = LinguisticRating {
        fluency: Some(5),
        grammar: Some(5),
        pronunciation: Some(5),
        clinical_appropriateness: Some(5),
    };
    data.clinical_indicators = ClinicalIndicators {
        relationship_building: Some(2),
        understanding_patient_perspective: Some(2),
        providing_structure: Some(2),
        information_gathering: Some(2),
        information_giving: Some(2),
        examiner_notes: String::new(),
    };
    let result = grade(&data);
    assert_eq!(result.linguistic_total, 20.0);
    assert_eq!(result.clinical_total, 10.0);
    assert_eq!(result.raw_total, 30.0);
    assert_eq!(result.scaled_score, 385);
    assert_eq!(result.grade, "B");
}

#[test]
fn very_weak_scores_yield_band_e() {
    let mut data = perfect_case();
    data.linguistic_role_play1 = LinguisticRating {
        fluency: Some(0),
        grammar: Some(0),
        pronunciation: Some(0),
        clinical_appropriateness: Some(0),
    };
    data.linguistic_role_play2 = LinguisticRating {
        fluency: Some(1),
        grammar: Some(1),
        pronunciation: Some(1),
        clinical_appropriateness: Some(1),
    };
    data.clinical_indicators = ClinicalIndicators {
        relationship_building: Some(0),
        understanding_patient_perspective: Some(0),
        providing_structure: Some(0),
        information_gathering: Some(0),
        information_giving: Some(0),
        examiner_notes: String::new(),
    };
    let result = grade(&data);
    assert_eq!(result.grade, "E");
}
