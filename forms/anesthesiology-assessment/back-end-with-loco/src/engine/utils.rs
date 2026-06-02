use chrono::{Datelike, NaiveDate, Utc};

/// Compute BMI from weight (kg) and height (cm). Returns None if inputs invalid.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let w = weight_kg?;
    let h = height_cm?;
    if w <= 0.0 || h <= 0.0 {
        return None;
    }
    let m = h / 100.0;
    Some(((w / (m * m)) * 10.0).round() / 10.0)
}

/// BMI category label.
pub fn bmi_category(bmi: Option<f64>) -> String {
    let Some(bmi) = bmi else {
        return String::new();
    };
    if bmi < 18.5 {
        "Underweight".to_string()
    } else if bmi < 25.0 {
        "Normal".to_string()
    } else if bmi < 30.0 {
        "Overweight".to_string()
    } else if bmi < 35.0 {
        "Obese Class I".to_string()
    } else if bmi < 40.0 {
        "Obese Class II".to_string()
    } else {
        "Obese Class III (Morbid)".to_string()
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

/// Friendly label for an overall perioperative risk level.
pub fn risk_level_label(level: &str) -> String {
    match level {
        "low" => "Low Risk".to_string(),
        "medium" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for a risk level badge.
pub fn risk_level_class(level: &str) -> String {
    match level {
        "low" => "risk-low".to_string(),
        "medium" => "risk-medium".to_string(),
        "high" => "risk-high".to_string(),
        "critical" => "risk-critical".to_string(),
        _ => String::new(),
    }
}

fn order(level: &str) -> u8 {
    match level {
        "low" => 0,
        "medium" => 1,
        "high" => 2,
        "critical" => 3,
        _ => 0,
    }
}

/// Return the worse (higher-severity) of two risk levels.
pub fn worst_risk(a: &str, b: &str) -> String {
    if order(a) >= order(b) {
        a.to_string()
    } else {
        b.to_string()
    }
}
