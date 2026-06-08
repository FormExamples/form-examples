//! Helper predicates and counters used by the grader.

/// EHP-30 total: average of the available domain scores. Returns
/// `None` if fewer than 3 domains have been answered.
pub fn calculate_ehp30_total(
    pain_domain: Option<i32>,
    control_domain: Option<i32>,
    emotional_domain: Option<i32>,
    social_domain: Option<i32>,
    self_image_domain: Option<i32>,
) -> Option<i32> {
    let scores: Vec<i32> = [
        pain_domain,
        control_domain,
        emotional_domain,
        social_domain,
        self_image_domain,
    ]
    .into_iter()
    .flatten()
    .collect();
    if scores.len() < 3 {
        return None;
    }
    let sum: i32 = scores.iter().sum();
    Some(((sum as f64) / (scores.len() as f64)).round() as i32)
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

/// ASRM Stage long label.
pub fn asrm_stage_label(stage: Option<i32>) -> String {
    match stage {
        Some(1) => "Stage I — Minimal (1-5 points)".to_string(),
        Some(2) => "Stage II — Mild (6-15 points)".to_string(),
        Some(3) => "Stage III — Moderate (16-40 points)".to_string(),
        Some(4) => "Stage IV — Severe (>40 points)".to_string(),
        _ => "Not staged".to_string(),
    }
}

/// EHP-30 score label.
pub fn ehp30_label(score: Option<i32>) -> String {
    match score {
        None => "Not assessed".to_string(),
        Some(n) if n <= 25 => "Minimal impact".to_string(),
        Some(n) if n <= 50 => "Moderate impact".to_string(),
        Some(n) if n <= 75 => "Significant impact".to_string(),
        Some(_) => "Severe impact".to_string(),
    }
}

/// Severity label.
pub fn severity_label(severity: &str) -> String {
    match severity {
        "mild" => "Mild".to_string(),
        "moderate" => "Moderate".to_string(),
        "severe" => "Severe".to_string(),
        "critical" => "Critical".to_string(),
        _ => String::new(),
    }
}
