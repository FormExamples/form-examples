//! Helper predicates and counters used by the grader.

use chrono::{Datelike, NaiveDate, Utc};

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

/// HLA match level human-readable label.
pub fn hla_match_label(level: &str) -> String {
    match level {
        "10-of-10" => "10/10 (Full Match)".to_string(),
        "9-of-10" => "9/10 (Single Antigen Mismatch)".to_string(),
        "8-of-10" => "8/10 (Two Antigen Mismatch)".to_string(),
        "7-of-10" => "7/10 (Three Antigen Mismatch)".to_string(),
        "haploidentical" => "Haploidentical".to_string(),
        _ => "Not classified".to_string(),
    }
}

/// Eligibility human-readable label.
pub fn eligibility_label(eligibility: &str) -> String {
    match eligibility {
        "suitable" => "Suitable".to_string(),
        "conditionally-suitable" => "Conditionally Suitable".to_string(),
        "unsuitable" => "Unsuitable".to_string(),
        _ => String::new(),
    }
}

/// Risk level human-readable label.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// Collection method human-readable label.
pub fn collection_method_label(method: &str) -> String {
    match method {
        "pbsc" => "Peripheral Blood Stem Cells (PBSC)".to_string(),
        "bone-marrow" => "Bone Marrow Harvest".to_string(),
        "either" => "Either method".to_string(),
        _ => "Not determined".to_string(),
    }
}

/// Calculate BMI from weight (kg) and height (cm).
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let w = weight_kg?;
    let h = height_cm?;
    if w <= 0.0 || h <= 0.0 {
        return None;
    }
    let height_m = h / 100.0;
    Some(((w / (height_m * height_m)) * 10.0).round() / 10.0)
}
