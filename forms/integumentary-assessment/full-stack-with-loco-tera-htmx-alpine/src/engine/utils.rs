use super::types::AssessmentData;

/// Risk-level cutoffs for the Braden Scale total score (6-23, lower = higher risk).
///
///   <=  9  -> very-high-risk
///   10-12  -> high-risk
///   13-14  -> moderate-risk
///   15-18  -> mild-risk
///   19-23  -> no-risk
pub fn classify_braden_score(score: i32) -> String {
    if score <= 9 {
        "very-high-risk".to_string()
    } else if score <= 12 {
        "high-risk".to_string()
    } else if score <= 14 {
        "moderate-risk".to_string()
    } else if score <= 18 {
        "mild-risk".to_string()
    } else {
        "no-risk".to_string()
    }
}

/// Friendly label for a risk-level slug.
pub fn risk_level_label(level: &str) -> String {
    match level {
        "very-high-risk" => "Very High Risk".to_string(),
        "high-risk" => "High Risk".to_string(),
        "moderate-risk" => "Moderate Risk".to_string(),
        "mild-risk" => "Mild Risk".to_string(),
        "no-risk" => "No Risk".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the risk-level badge.
pub fn risk_level_class(level: &str) -> String {
    match level {
        "very-high-risk" => "risk-very-high".to_string(),
        "high-risk" => "risk-high".to_string(),
        "moderate-risk" => "risk-moderate".to_string(),
        "mild-risk" => "risk-mild".to_string(),
        "no-risk" => "risk-no".to_string(),
        _ => String::new(),
    }
}

/// Calculate BMI from weight (kg) and height (cm). Returns None if invalid.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    match (weight_kg, height_cm) {
        (Some(w), Some(h)) if w > 0.0 && h > 0.0 => {
            let h_m = h / 100.0;
            Some((w / (h_m * h_m) * 10.0).round() / 10.0)
        }
        _ => None,
    }
}

/// BMI category label.
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

/// Compute wound area (cm²) from length × width.
pub fn calculate_wound_area(length: Option<f64>, width: Option<f64>) -> Option<f64> {
    match (length, width) {
        (Some(l), Some(w)) if l > 0.0 && w > 0.0 => Some((l * w * 10.0).round() / 10.0),
        _ => None,
    }
}

/// True when at least one Braden subscale has been answered.
pub fn any_braden_answered(data: &AssessmentData) -> bool {
    data.braden_scale.sensory_perception.is_some()
        || data.braden_scale.moisture.is_some()
        || data.braden_scale.activity.is_some()
        || data.braden_scale.mobility.is_some()
        || data.braden_scale.nutrition.is_some()
        || data.braden_scale.friction_shear.is_some()
}
