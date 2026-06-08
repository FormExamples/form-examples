//! Helper predicates and counters used by the grader.

use super::types::AxisStatus;

/// Order axis statuses from least to most severe.
fn order(status: &str) -> u8 {
    match status {
        "" => 0,
        "normal" => 1,
        "subclinical" => 2,
        "mild" => 3,
        "moderate" => 4,
        "severe" => 5,
        _ => 0,
    }
}

/// Returns the more severe of two axis statuses.
pub fn max_status(a: &str, b: &str) -> AxisStatus {
    if order(a) >= order(b) {
        a.to_string()
    } else {
        b.to_string()
    }
}

/// Friendly label for an axis status.
pub fn axis_status_label(status: &str) -> String {
    match status {
        "normal" => "Normal".to_string(),
        "subclinical" => "Subclinical".to_string(),
        "mild" => "Mild".to_string(),
        "moderate" => "Moderate".to_string(),
        "severe" => "Severe".to_string(),
        _ => "Not assessed".to_string(),
    }
}

/// CSS class hint for an axis status badge.
pub fn axis_status_class(status: &str) -> String {
    match status {
        "normal" => "status-normal".to_string(),
        "subclinical" => "status-subclinical".to_string(),
        "mild" => "status-mild".to_string(),
        "moderate" => "status-moderate".to_string(),
        "severe" => "status-severe".to_string(),
        _ => "status-none".to_string(),
    }
}

/// Calculate BMI from weight (kg) and height (cm). Returns None if invalid.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    match (weight_kg, height_cm) {
        (Some(w), Some(h)) if w > 0.0 && h > 0.0 => {
            let height_m = h / 100.0;
            Some((w / (height_m * height_m) * 10.0).round() / 10.0)
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
