use chrono::{Datelike, NaiveDate, Utc};

/// Display label for the eligibility decision.
pub fn eligibility_label(eligibility: &str) -> String {
    match eligibility {
        "suitable" => "Suitable".to_string(),
        "conditionally-suitable" => "Conditionally Suitable".to_string(),
        "unsuitable" => "Unsuitable".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the eligibility badge.
pub fn eligibility_class(eligibility: &str) -> String {
    match eligibility {
        "suitable" => "eligibility-suitable".to_string(),
        "conditionally-suitable" => "eligibility-conditional".to_string(),
        "unsuitable" => "eligibility-unsuitable".to_string(),
        _ => String::new(),
    }
}

/// Display label for the risk level.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the risk badge.
pub fn risk_level_class(risk: &str) -> String {
    match risk {
        "low" => "risk-low".to_string(),
        "moderate" => "risk-moderate".to_string(),
        "high" => "risk-high".to_string(),
        "critical" => "risk-critical".to_string(),
        _ => String::new(),
    }
}

/// Donor type human-readable label.
pub fn donor_type_label(donor_type: &str) -> String {
    match donor_type {
        "living" => "Living donor".to_string(),
        "deceased" => "Deceased donor".to_string(),
        _ => "Not specified".to_string(),
    }
}

/// Calculate age (years) from a YYYY-MM-DD date-of-birth string.
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
