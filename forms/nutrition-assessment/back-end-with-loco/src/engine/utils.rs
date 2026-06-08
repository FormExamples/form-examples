//! Helper predicates and counters used by the grader.

use super::types::AssessmentData;

/// Calculate BMI from weight (kg) and height (cm). Returns None if either
/// value is missing or non-positive. Rounded to 1 decimal place.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let w = weight_kg?;
    let h = height_cm?;
    if w <= 0.0 || h <= 0.0 {
        return None;
    }
    let height_m = h / 100.0;
    Some(((w / (height_m * height_m)) * 10.0).round() / 10.0)
}

/// Human-readable BMI category label.
pub fn bmi_category(bmi: Option<f64>) -> String {
    match bmi {
        None => String::new(),
        Some(b) if b < 18.5 => "Underweight".to_string(),
        Some(b) if b < 25.0 => "Normal".to_string(),
        Some(b) if b < 30.0 => "Overweight".to_string(),
        Some(b) if b < 35.0 => "Obese Class I".to_string(),
        Some(b) if b < 40.0 => "Obese Class II".to_string(),
        Some(_) => "Obese Class III (Morbid)".to_string(),
    }
}

/// Calculate unplanned weight loss as a percentage of usual weight. Returns
/// None if either value is missing or usual weight is non-positive. Rounded
/// to 1 decimal place.
pub fn calculate_weight_loss_percent(
    weight_loss_kg: Option<f64>,
    usual_weight_kg: Option<f64>,
) -> Option<f64> {
    let l = weight_loss_kg?;
    let u = usual_weight_kg?;
    if u <= 0.0 {
        return None;
    }
    Some(((l / u) * 1000.0).round() / 10.0)
}

/// Suggest a MUST BMI category from a numeric BMI.
pub fn suggest_bmi_category(bmi: Option<f64>) -> String {
    match bmi {
        None => String::new(),
        Some(b) if b > 20.0 => ">=20".to_string(),
        Some(b) if b >= 18.5 => "18.5-20".to_string(),
        Some(_) => "<18.5".to_string(),
    }
}

/// Suggest a MUST weight-loss category from a percentage.
pub fn suggest_weight_loss_category(pct: Option<f64>) -> String {
    match pct {
        None => String::new(),
        Some(p) if p < 5.0 => "<5".to_string(),
        Some(p) if p <= 10.0 => "5-10".to_string(),
        Some(_) => ">10".to_string(),
    }
}

/// Recompute the derived fields (BMI, weight-loss %) on the data in place
/// and auto-prefill the MUST screening categorical answers when an objective
/// value is available and the categorical answer is empty.
pub fn recompute_derived(data: &mut AssessmentData) {
    let a = &mut data.anthropometric_measurements;
    a.bmi = calculate_bmi(a.weight_kg, a.height_cm);
    a.weight_loss_percent = calculate_weight_loss_percent(a.weight_loss_kg, a.usual_weight_kg);

    let bmi = a.bmi;
    let pct = a.weight_loss_percent;
    let screen = &mut data.nutritional_screening;
    if bmi.is_some() && screen.bmi_category.is_empty() {
        screen.bmi_category = suggest_bmi_category(bmi);
    }
    if pct.is_some() && screen.weight_loss_category.is_empty() {
        screen.weight_loss_category = suggest_weight_loss_category(pct);
    }
}
