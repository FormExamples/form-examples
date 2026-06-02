use integumentary_assessment_loco_crate::engine::integumentary_grader::grade;
use integumentary_assessment_loco_crate::engine::rules::all_rules;
use integumentary_assessment_loco_crate::engine::types::*;

/// Build an assessment with every Braden subscale at its maximum (low risk).
fn fully_scored_low_risk_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            sex: "female".to_string(),
            weight: Some(72.0),
            height: Some(165.0),
            bmi: Some(26.4),
        },
        braden_scale: BradenScale {
            sensory_perception: Some(4),
            moisture: Some(4),
            activity: Some(4),
            mobility: Some(4),
            nutrition: Some(4),
            friction_shear: Some(3),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_defaults_to_no_risk() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.braden_score, 23);
    assert_eq!(result.risk_level, "no-risk");
    assert_eq!(result.answered_count, 0);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn fully_scored_case_is_no_risk() {
    let data = fully_scored_low_risk_case();
    let result = grade(&data);
    assert_eq!(result.braden_score, 23);
    assert_eq!(result.risk_level, "no-risk");
    assert_eq!(result.answered_count, 6);
    assert_eq!(result.fired_rules.len(), 6);
}

#[test]
fn very_high_risk_case() {
    let mut data = fully_scored_low_risk_case();
    data.braden_scale = BradenScale {
        sensory_perception: Some(1),
        moisture: Some(1),
        activity: Some(1),
        mobility: Some(1),
        nutrition: Some(1),
        friction_shear: Some(1),
    };
    let result = grade(&data);
    assert_eq!(result.braden_score, 6);
    assert_eq!(result.risk_level, "very-high-risk");
}

#[test]
fn boundary_score_9_is_very_high_risk() {
    let mut data = fully_scored_low_risk_case();
    data.braden_scale = BradenScale {
        sensory_perception: Some(2),
        moisture: Some(2),
        activity: Some(2),
        mobility: Some(1),
        nutrition: Some(1),
        friction_shear: Some(1),
    };
    let result = grade(&data);
    assert_eq!(result.braden_score, 9);
    assert_eq!(result.risk_level, "very-high-risk");
}

#[test]
fn boundary_score_10_is_high_risk() {
    let mut data = fully_scored_low_risk_case();
    data.braden_scale = BradenScale {
        sensory_perception: Some(2),
        moisture: Some(2),
        activity: Some(2),
        mobility: Some(2),
        nutrition: Some(1),
        friction_shear: Some(1),
    };
    let result = grade(&data);
    assert_eq!(result.braden_score, 10);
    assert_eq!(result.risk_level, "high-risk");
}

#[test]
fn boundary_score_13_is_moderate_risk() {
    let mut data = fully_scored_low_risk_case();
    data.braden_scale = BradenScale {
        sensory_perception: Some(2),
        moisture: Some(3),
        activity: Some(2),
        mobility: Some(2),
        nutrition: Some(2),
        friction_shear: Some(2),
    };
    let result = grade(&data);
    assert_eq!(result.braden_score, 13);
    assert_eq!(result.risk_level, "moderate-risk");
}

#[test]
fn boundary_score_15_is_mild_risk() {
    let mut data = fully_scored_low_risk_case();
    data.braden_scale = BradenScale {
        sensory_perception: Some(3),
        moisture: Some(3),
        activity: Some(2),
        mobility: Some(2),
        nutrition: Some(3),
        friction_shear: Some(2),
    };
    let result = grade(&data);
    assert_eq!(result.braden_score, 15);
    assert_eq!(result.risk_level, "mild-risk");
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn all_six_braden_rule_ids_present() {
    let rules = all_rules();
    let ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    for expected in &[
        "BRADEN-001",
        "BRADEN-002",
        "BRADEN-003",
        "BRADEN-004",
        "BRADEN-005",
        "BRADEN-006",
    ] {
        assert!(ids.contains(expected), "missing rule {expected}");
    }
}
