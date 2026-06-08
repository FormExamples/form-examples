//! Helper predicates and counters used by the grader.

use super::types::{AlcoholUseAudit, DrugUseDast};

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

/// Calculate AUDIT total score (0-40) by summing all 10 questions.
pub fn calculate_audit_score(q: &AlcoholUseAudit) -> i32 {
    q.audit_q1_frequency
        + q.audit_q2_typical_quantity
        + q.audit_q3_binge_frequency
        + q.audit_q4_impaired_control
        + q.audit_q5_failed_expectations
        + q.audit_q6_morning_drinking
        + q.audit_q7_guilt
        + q.audit_q8_blackout
        + q.audit_q9_injury
        + q.audit_q10_concern
}

/// Derive AUDIT risk category from total score.
pub fn audit_risk_category(score: i32) -> String {
    if score <= 7 {
        "low-risk".to_string()
    } else if score <= 15 {
        "hazardous".to_string()
    } else if score <= 19 {
        "harmful".to_string()
    } else {
        "dependence-likely".to_string()
    }
}

/// AUDIT risk category label.
pub fn audit_risk_label(category: &str) -> String {
    match category {
        "low-risk" => "Low Risk (0-7)".to_string(),
        "hazardous" => "Hazardous (8-15)".to_string(),
        "harmful" => "Harmful (16-19)".to_string(),
        "dependence-likely" => "Dependence Likely (20-40)".to_string(),
        _ => "Not scored".to_string(),
    }
}

/// Calculate DAST-10 total score (Q3 is inversely scored — "no" adds a point).
pub fn calculate_dast_score(q: &DrugUseDast) -> i32 {
    let mut s = 0;
    if q.dast_q1_non_medical_use == "yes" {
        s += 1;
    }
    if q.dast_q2_poly_drug == "yes" {
        s += 1;
    }
    if q.dast_q3_able_to_stop == "no" {
        s += 1;
    }
    if q.dast_q4_blackouts == "yes" {
        s += 1;
    }
    if q.dast_q5_guilt == "yes" {
        s += 1;
    }
    if q.dast_q6_complaints == "yes" {
        s += 1;
    }
    if q.dast_q7_neglect == "yes" {
        s += 1;
    }
    if q.dast_q8_illegal_activities == "yes" {
        s += 1;
    }
    if q.dast_q9_withdrawal == "yes" {
        s += 1;
    }
    if q.dast_q10_medical_problems == "yes" {
        s += 1;
    }
    s
}

/// Derive DAST-10 risk category from total score.
pub fn dast_risk_category(score: i32) -> String {
    if score == 0 {
        "no-problems".to_string()
    } else if score <= 2 {
        "low".to_string()
    } else if score <= 5 {
        "moderate".to_string()
    } else if score <= 8 {
        "substantial".to_string()
    } else {
        "severe".to_string()
    }
}

/// DAST risk category label.
pub fn dast_risk_label(category: &str) -> String {
    match category {
        "no-problems" => "No Problems (0)".to_string(),
        "low" => "Low Level (1-2)".to_string(),
        "moderate" => "Moderate Level (3-5)".to_string(),
        "substantial" => "Substantial Level (6-8)".to_string(),
        "severe" => "Severe Level (9-10)".to_string(),
        _ => "Not scored".to_string(),
    }
}

/// Overall risk level label.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => "Not scored".to_string(),
    }
}

/// Substance grade label.
pub fn substance_grade_label(grade: u32) -> String {
    match grade {
        1 => "Grade I — Minimal".to_string(),
        2 => "Grade II — Mild".to_string(),
        3 => "Grade III — Moderate".to_string(),
        4 => "Grade IV — Severe".to_string(),
        _ => format!("Grade {grade}"),
    }
}
