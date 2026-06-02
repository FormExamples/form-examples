use chrono::{Datelike, NaiveDate, Utc};

/// Calculate BMI from weight (kg) and height (cm). Returns None if inputs invalid.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let w = weight_kg?;
    let h = height_cm?;
    if w <= 0.0 || h <= 0.0 {
        return None;
    }
    let height_m = h / 100.0;
    Some((w / (height_m * height_m) * 10.0).round() / 10.0)
}

/// Get a BMI category label.
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

/// UK MEC category long-form label.
pub fn mec_category_label(mec: u8) -> String {
    match mec {
        1 => "MEC 1 - No restriction".to_string(),
        2 => "MEC 2 - Advantages outweigh risks".to_string(),
        3 => "MEC 3 - Risks outweigh advantages".to_string(),
        4 => "MEC 4 - Unacceptable health risk".to_string(),
        _ => "Not classified".to_string(),
    }
}

/// UK MEC category short label.
pub fn mec_category_short(mec: u8) -> String {
    format!("MEC {mec}")
}

/// Risk level display label.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        other => format!("Risk: {other}"),
    }
}

/// Contraceptive method long-form display name.
pub fn method_display_name(method: &str) -> String {
    match method {
        "coc" => "Combined Oral Contraception (COC)".to_string(),
        "pop" => "Progestogen-Only Pill (POP)".to_string(),
        "implant" => "Contraceptive Implant".to_string(),
        "injection" => "Injectable Contraception".to_string(),
        "iud" => "Copper IUD".to_string(),
        "ius" => "Hormonal IUS (Mirena)".to_string(),
        other => other.to_string(),
    }
}

/// Contraceptive method short name.
pub fn method_short_name(method: &str) -> String {
    match method {
        "coc" => "COC".to_string(),
        "pop" => "POP".to_string(),
        "implant" => "Implant".to_string(),
        "injection" => "Injection".to_string(),
        "iud" => "Cu-IUD".to_string(),
        "ius" => "IUS".to_string(),
        other => other.to_string(),
    }
}
