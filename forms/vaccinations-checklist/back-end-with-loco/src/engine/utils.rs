//! Helper predicates and counters used by the grader.

/// Display label for ComplianceStatus.
pub fn compliance_status_label(status: &str) -> String {
    match status {
        "fully-immunised" => "Fully Immunised".to_string(),
        "partially-immunised" => "Partially Immunised".to_string(),
        "non-compliant" => "Non-Compliant".to_string(),
        "contraindicated" => "Contraindicated".to_string(),
        _ => String::new(),
    }
}

/// CSS modifier for the compliance badge.
pub fn compliance_status_class(status: &str) -> &'static str {
    match status {
        "fully-immunised" => "compliant",
        "partially-immunised" => "partial",
        "non-compliant" => "non-compliant",
        "contraindicated" => "contraindicated",
        _ => "",
    }
}

/// Display label for RiskLevel.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// Friendly label for a rule grade.
pub fn grade_label(grade: u32) -> String {
    match grade {
        1 => "Low".to_string(),
        2 => "Moderate".to_string(),
        3 => "Significant".to_string(),
        4 => "Critical".to_string(),
        n => format!("Grade {n}"),
    }
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
