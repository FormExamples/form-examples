//! Helper predicates and counters used by the grader.

use chrono::{Datelike, NaiveDate, Utc};

/// Calculate BMI from weight (kg) and height (cm). Returns None if invalid.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let w = weight_kg?;
    let h = height_cm?;
    if w <= 0.0 || h <= 0.0 {
        return None;
    }
    let height_m = h / 100.0;
    Some(((w / (height_m * height_m)) * 10.0).round() / 10.0)
}

/// Plain-English BMI category for a BMI value.
pub fn bmi_category(bmi: Option<f64>) -> String {
    match bmi {
        None => String::new(),
        Some(b) if b < 18.5 => "Underweight".to_string(),
        Some(b) if b < 25.0 => "Normal".to_string(),
        Some(b) if b < 30.0 => "Overweight".to_string(),
        Some(b) if b < 35.0 => "Obese Class I".to_string(),
        Some(b) if b < 40.0 => "Obese Class II".to_string(),
        Some(_) => "Obese Class III".to_string(),
    }
}

/// Calculate age in years from a YYYY-MM-DD date-of-birth string.
pub fn calculate_age(dob: &str) -> Option<i32> {
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
