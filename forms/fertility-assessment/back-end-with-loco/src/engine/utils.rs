//! Helper predicates and counters used by the grader.

use chrono::{Datelike, NaiveDate, Utc};

/// Display label for the overall concern level.
pub fn concern_level_label(level: &str) -> String {
    match level {
        "low" => "Low concern".to_string(),
        "moderate" => "Moderate concern".to_string(),
        "high" => "High concern".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the concern-level badge.
pub fn concern_level_class(level: &str) -> String {
    match level {
        "low" => "concern-low".to_string(),
        "moderate" => "concern-moderate".to_string(),
        "high" => "concern-high".to_string(),
        _ => String::new(),
    }
}

/// Calculate age in whole years from a YYYY-MM-DD date-of-birth string.
pub fn age_in_years(dob: &str) -> Option<i32> {
    if dob.is_empty() {
        return None;
    }
    let birth = NaiveDate::parse_from_str(dob, "%Y-%m-%d").ok()?;
    let today = Utc::now().date_naive();
    let mut age = today.year() - birth.year();
    if today.month() < birth.month()
        || (today.month() == birth.month() && today.day() < birth.day())
    {
        age -= 1;
    }
    Some(age)
}

/// Calculate BMI from weight (kg) and height (cm). Returns None if invalid.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let (w, h) = match (weight_kg, height_cm) {
        (Some(w), Some(h)) if w > 0.0 && h > 0.0 => (w, h),
        _ => return None,
    };
    let height_m = h / 100.0;
    Some(((w / (height_m * height_m)) * 10.0).round() / 10.0)
}

/// BMI category label.
pub fn bmi_category(bmi: Option<f64>) -> String {
    match bmi {
        Some(v) if v < 18.5 => "Underweight".to_string(),
        Some(v) if v < 25.0 => "Normal".to_string(),
        Some(v) if v < 30.0 => "Overweight".to_string(),
        Some(v) if v < 35.0 => "Obese Class I".to_string(),
        Some(v) if v < 40.0 => "Obese Class II".to_string(),
        Some(_) => "Obese Class III (Morbid)".to_string(),
        None => String::new(),
    }
}
