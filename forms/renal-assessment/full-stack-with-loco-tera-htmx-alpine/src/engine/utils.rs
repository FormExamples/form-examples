use chrono::{Datelike, NaiveDate, Utc};

use super::types::{AlbuminuriaCategory, AssessmentData, GfrCategory, RiskLevel};

/// Calculate age in completed years from a YYYY-MM-DD date-of-birth string.
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
    if age < 0 { None } else { Some(age) }
}

/// Calculate BMI from weight (kg) and height (cm). Rounds to one decimal.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    let w = weight_kg?;
    let h = height_cm?;
    if w <= 0.0 || h <= 0.0 {
        return None;
    }
    let height_m = h / 100.0;
    Some(((w / (height_m * height_m)) * 10.0).round() / 10.0)
}

/// Friendly BMI category label.
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

/// Estimate eGFR via the CKD-EPI 2021 race-free equation. Inputs:
/// - `serum_creatinine` in mg/dL
/// - `age` in years
/// - `sex` 'male' | 'female' | 'other' (other treated as female)
///
/// Returns mL/min/1.73 m^2 rounded to one decimal, or `None` if inputs invalid.
pub fn estimate_egfr_ckd_epi_2021(
    serum_creatinine: Option<f64>,
    age: Option<i32>,
    sex: &str,
) -> Option<f64> {
    let scr = serum_creatinine?;
    if scr <= 0.0 {
        return None;
    }
    let age = age?;
    if age <= 0 {
        return None;
    }
    let is_female = sex == "female" || sex == "other";
    let k = if is_female { 0.7 } else { 0.9 };
    let alpha = if is_female { -0.241 } else { -0.302 };
    let sex_factor = if is_female { 1.012 } else { 1.0 };
    let scr_k = scr / k;
    let min_term = scr_k.min(1.0).powf(alpha);
    let max_term = scr_k.max(1.0).powf(-1.200);
    let age_term = 0.9938_f64.powi(age);
    let egfr = 142.0 * min_term * max_term * age_term * sex_factor;
    Some((egfr * 10.0).round() / 10.0)
}

/// Map an eGFR to a KDIGO GFR category (or empty string).
pub fn classify_gfr_category(egfr: Option<f64>) -> GfrCategory {
    match egfr {
        None => String::new(),
        Some(v) if v >= 90.0 => "G1".to_string(),
        Some(v) if v >= 60.0 => "G2".to_string(),
        Some(v) if v >= 45.0 => "G3a".to_string(),
        Some(v) if v >= 30.0 => "G3b".to_string(),
        Some(v) if v >= 15.0 => "G4".to_string(),
        Some(_) => "G5".to_string(),
    }
}

/// Map a urine ACR (mg/mmol) to a KDIGO albuminuria category (or empty string).
pub fn classify_albuminuria_category(acr: Option<f64>) -> AlbuminuriaCategory {
    match acr {
        None => String::new(),
        Some(v) if v < 3.0 => "A1".to_string(),
        Some(v) if v <= 30.0 => "A2".to_string(),
        Some(_) => "A3".to_string(),
    }
}

/// Friendly label for a GFR category.
pub fn gfr_category_label(g: &str) -> String {
    match g {
        "G1" => "G1: Normal or high (>=90)".to_string(),
        "G2" => "G2: Mildly decreased (60-89)".to_string(),
        "G3a" => "G3a: Mild to moderately decreased (45-59)".to_string(),
        "G3b" => "G3b: Moderately to severely decreased (30-44)".to_string(),
        "G4" => "G4: Severely decreased (15-29)".to_string(),
        "G5" => "G5: Kidney failure (<15)".to_string(),
        _ => String::new(),
    }
}

/// Friendly label for an albuminuria category.
pub fn albuminuria_category_label(a: &str) -> String {
    match a {
        "A1" => "A1: Normal to mildly increased (<3 mg/mmol)".to_string(),
        "A2" => "A2: Moderately increased (3-30 mg/mmol)".to_string(),
        "A3" => "A3: Severely increased (>30 mg/mmol)".to_string(),
        _ => String::new(),
    }
}

/// Resolve the eGFR used for staging: prefer an explicitly entered eGFR;
/// otherwise estimate from creatinine + age + sex via CKD-EPI 2021.
pub fn resolve_egfr(d: &AssessmentData) -> Option<f64> {
    if let Some(v) = d.blood_tests.egfr {
        if v > 0.0 {
            return Some(v);
        }
    }
    let age = d
        .demographics
        .age
        .or_else(|| calculate_age(&d.demographics.date_of_birth));
    estimate_egfr_ckd_epi_2021(d.blood_tests.serum_creatinine, age, &d.demographics.sex)
}

/// Resolve the GFR category used for staging: prefer the clinician-entered
/// value if present; otherwise derive from the resolved eGFR.
pub fn resolve_gfr_category(d: &AssessmentData) -> GfrCategory {
    if !d.clinical_impression.gfr_category.is_empty() {
        return d.clinical_impression.gfr_category.clone();
    }
    classify_gfr_category(resolve_egfr(d))
}

/// Resolve the albuminuria category used for staging.
pub fn resolve_albuminuria_category(d: &AssessmentData) -> AlbuminuriaCategory {
    if !d.clinical_impression.albuminuria_category.is_empty() {
        return d.clinical_impression.albuminuria_category.clone();
    }
    classify_albuminuria_category(d.urine_tests.acr)
}

/// KDIGO heatmap: composite risk by (GFR, Albuminuria) category. Returns
/// 'unknown' when either input is missing.
pub fn kdigo_composite_risk(g: &str, a: &str) -> RiskLevel {
    if g.is_empty() || a.is_empty() {
        return "unknown".to_string();
    }
    match (g, a) {
        ("G1", "A1") | ("G2", "A1") => "low",
        ("G1", "A2") | ("G2", "A2") | ("G3a", "A1") => "moderate",
        ("G1", "A3") | ("G2", "A3") | ("G3a", "A2") | ("G3b", "A1") => "high",
        ("G3a", "A3")
        | ("G3b", "A2")
        | ("G3b", "A3")
        | ("G4", "A1")
        | ("G4", "A2")
        | ("G4", "A3")
        | ("G5", "A1")
        | ("G5", "A2")
        | ("G5", "A3") => "very-high",
        _ => "unknown",
    }
    .to_string()
}

/// Friendly label for the composite risk level.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low risk".to_string(),
        "moderate" => "Moderately increased risk".to_string(),
        "high" => "High risk".to_string(),
        "very-high" => "Very high risk".to_string(),
        _ => "Insufficient data".to_string(),
    }
}

/// CSS class for the composite risk level.
pub fn risk_level_class(risk: &str) -> String {
    match risk {
        "low" => "risk-low".to_string(),
        "moderate" => "risk-moderate".to_string(),
        "high" => "risk-high".to_string(),
        "very-high" => "risk-very-high".to_string(),
        _ => "risk-unknown".to_string(),
    }
}
