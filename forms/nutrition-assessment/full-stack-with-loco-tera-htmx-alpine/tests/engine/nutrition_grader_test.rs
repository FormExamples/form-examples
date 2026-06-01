use nutrition_assessment_tera_crate::engine::must_rules::all_rules;
use nutrition_assessment_tera_crate::engine::nutrition_grader::{calculate_must, grade};
use nutrition_assessment_tera_crate::engine::types::*;

/// Build an assessment with every MUST step answered "0".
fn well_nourished_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            sex: "female".to_string(),
            ..Demographics::default()
        },
        anthropometric_measurements: AnthropometricMeasurements {
            weight_kg: Some(70.0),
            height_cm: Some(170.0),
            bmi: Some(24.2),
            usual_weight_kg: Some(70.0),
            weight_loss_kg: Some(0.0),
            weight_loss_percent: Some(0.0),
            ..AnthropometricMeasurements::default()
        },
        nutritional_screening: NutritionalScreening {
            bmi_category: ">=20".to_string(),
            weight_loss_category: "<5".to_string(),
            acute_disease: "none".to_string(),
            ..NutritionalScreening::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_has_zero_score_and_no_rules() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.must_score, 0);
    assert_eq!(result.answered_count, 0);
    assert!(result.fired_rules.is_empty());
    // Empty/low MUST score -> low risk -> low severity.
    assert_eq!(result.must_risk, "low");
    assert_eq!(result.severity, "low");
}

#[test]
fn fully_low_risk_case_scores_zero() {
    let data = well_nourished_case();
    let result = grade(&data);
    assert_eq!(result.must_score, 0);
    assert_eq!(result.answered_count, 3);
    assert_eq!(result.must_risk, "low");
    assert_eq!(result.severity, "low");
}

#[test]
fn medium_risk_at_score_one() {
    let mut data = well_nourished_case();
    data.nutritional_screening.weight_loss_category = "5-10".to_string();
    let (score, risk, severity, _, _) = calculate_must(&data);
    assert_eq!(score, 1);
    assert_eq!(risk, "medium");
    assert_eq!(severity, "moderate");
}

#[test]
fn high_risk_at_score_two_or_more() {
    let mut data = well_nourished_case();
    data.nutritional_screening.bmi_category = "<18.5".to_string();
    let result = grade(&data);
    assert_eq!(result.must_score, 2);
    assert_eq!(result.must_risk, "high");
    assert_eq!(result.severity, "high");
}

#[test]
fn high_risk_escalates_to_critical_when_bmi_below_16() {
    let mut data = well_nourished_case();
    data.nutritional_screening.bmi_category = "<18.5".to_string();
    data.anthropometric_measurements.bmi = Some(15.5);
    let result = grade(&data);
    assert_eq!(result.must_risk, "high");
    assert_eq!(result.severity, "critical");
}

#[test]
fn high_risk_escalates_when_weight_loss_above_15_percent() {
    let mut data = well_nourished_case();
    data.nutritional_screening.weight_loss_category = ">10".to_string();
    data.anthropometric_measurements.weight_loss_percent = Some(18.0);
    let result = grade(&data);
    assert_eq!(result.must_risk, "high");
    assert_eq!(result.severity, "critical");
}

#[test]
fn high_risk_escalates_when_acutely_ill() {
    let mut data = well_nourished_case();
    data.nutritional_screening.acute_disease = "acutely-ill-no-intake-5d".to_string();
    let result = grade(&data);
    assert_eq!(result.must_score, 2);
    assert_eq!(result.severity, "critical");
}

#[test]
fn high_risk_escalates_when_swallowing_difficulty_and_choking() {
    let mut data = well_nourished_case();
    data.nutritional_screening.bmi_category = "<18.5".to_string();
    data.swallowing_oral_health.swallowing_difficulty = "yes".to_string();
    data.swallowing_oral_health.choking_episodes = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.severity, "critical");
}

#[test]
fn high_risk_escalates_when_receiving_parenteral_nutrition() {
    let mut data = well_nourished_case();
    data.nutritional_screening.bmi_category = "<18.5".to_string();
    data.current_nutritional_support.parenteral_nutrition = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.severity, "critical");
}

#[test]
fn unanswered_must_step_is_excluded() {
    let mut data = well_nourished_case();
    data.nutritional_screening.weight_loss_category = String::new();
    let result = grade(&data);
    assert_eq!(result.answered_count, 2);
    assert!(result.fired_rules.iter().all(|r| r.id != "MUST-002"));
}

#[test]
fn rule_ids_are_unique_and_canonical() {
    let rules = all_rules();
    let ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    assert_eq!(ids, vec!["MUST-001", "MUST-002", "MUST-003"]);
}
