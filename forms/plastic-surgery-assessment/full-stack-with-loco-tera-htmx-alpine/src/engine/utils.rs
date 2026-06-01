use chrono::{Datelike, NaiveDate, Utc};

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

/// Get BMI category label.
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

/// ASA Physical Status Classification label.
pub fn asa_class_label(asa_class: Option<i32>) -> String {
    match asa_class {
        Some(1) => "ASA I - Normal healthy patient".to_string(),
        Some(2) => "ASA II - Mild systemic disease".to_string(),
        Some(3) => "ASA III - Severe systemic disease".to_string(),
        Some(4) => "ASA IV - Severe systemic disease, constant threat to life".to_string(),
        Some(5) => "ASA V - Moribund patient".to_string(),
        _ => "Not classified".to_string(),
    }
}

/// Wound Classification label.
pub fn wound_class_label(wound_class: Option<i32>) -> String {
    match wound_class {
        Some(1) => "Class I - Clean".to_string(),
        Some(2) => "Class II - Clean-Contaminated".to_string(),
        Some(3) => "Class III - Contaminated".to_string(),
        Some(4) => "Class IV - Dirty/Infected".to_string(),
        _ => "Not classified".to_string(),
    }
}

/// Surgical Complexity Score label.
pub fn complexity_label(score: Option<i32>) -> String {
    match score {
        Some(1) => "Complexity 1 - Minor".to_string(),
        Some(2) => "Complexity 2 - Intermediate".to_string(),
        Some(3) => "Complexity 3 - Major".to_string(),
        Some(4) => "Complexity 4 - Major Plus / Emergency".to_string(),
        _ => "Not classified".to_string(),
    }
}

/// Overall risk level label.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// Risk-level CSS class hint.
pub fn risk_level_class(risk: &str) -> String {
    match risk {
        "low" => "risk-low".to_string(),
        "moderate" => "risk-moderate".to_string(),
        "high" => "risk-high".to_string(),
        "critical" => "risk-critical".to_string(),
        _ => String::new(),
    }
}
