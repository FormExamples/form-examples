use nutrition_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use nutrition_assessment_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        anthropometric_measurements: AnthropometricMeasurements {
            bmi: Some(22.5),
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
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn severe_underweight_emits_urgent_flag() {
    let mut data = baseline_case();
    data.anthropometric_measurements.bmi = Some(15.2);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-BMI-001" && f.priority == "urgent")
    );
}

#[test]
fn underweight_emits_high_flag() {
    let mut data = baseline_case();
    data.anthropometric_measurements.bmi = Some(17.5);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-BMI-002" && f.priority == "high")
    );
}

#[test]
fn obese_class3_emits_medium_flag() {
    let mut data = baseline_case();
    data.anthropometric_measurements.bmi = Some(42.0);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-BMI-003" && f.priority == "medium")
    );
}

#[test]
fn severe_weight_loss_emits_urgent_flag() {
    let mut data = baseline_case();
    data.anthropometric_measurements.weight_loss_percent = Some(20.0);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-WL-001" && f.priority == "urgent")
    );
}

#[test]
fn acutely_ill_emits_urgent_flag() {
    let mut data = baseline_case();
    data.nutritional_screening.acute_disease = "acutely-ill-no-intake-5d".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ACUTE-001" && f.priority == "urgent")
    );
}

#[test]
fn choking_episodes_emit_urgent_flag() {
    let mut data = baseline_case();
    data.swallowing_oral_health.choking_episodes = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SWAL-001" && f.priority == "urgent")
    );
}

#[test]
fn swallowing_difficulty_emits_high_flag() {
    let mut data = baseline_case();
    data.swallowing_oral_health.swallowing_difficulty = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SWAL-002" && f.priority == "high")
    );
}

#[test]
fn anaphylaxis_history_emits_urgent_flag() {
    let mut data = baseline_case();
    data.food_allergies_intolerances.food_allergies.push(FoodAllergy {
        allergen: "peanuts".to_string(),
        reaction: "anaphylaxis".to_string(),
        severity: "anaphylaxis".to_string(),
    });
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ALLERGY-ANAPH-0" && f.priority == "urgent")
    );
}

#[test]
fn parenteral_nutrition_emits_high_flag() {
    let mut data = baseline_case();
    data.current_nutritional_support.parenteral_nutrition = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SUPP-001" && f.priority == "high")
    );
}

#[test]
fn vomiting_emits_high_flag() {
    let mut data = baseline_case();
    data.gastrointestinal_function.vomiting = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-GI-001" && f.priority == "high")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // Build one urgent, one high, one medium, one low.
    data.swallowing_oral_health.choking_episodes = "yes".to_string(); // urgent
    data.current_nutritional_support.parenteral_nutrition = "yes".to_string(); // high
    data.gastrointestinal_function.nausea = "yes".to_string(); // medium
    data.gastrointestinal_function.constipation = "yes".to_string(); // low

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
