use super::types::CompetencyLevel;

/// Map a competency level string to a number (1..=4). 0 = not assessed.
pub fn competency_to_number(level: &str) -> i32 {
    match level {
        "not-competent" => 1,
        "developing" => 2,
        "competent" => 3,
        "expert" => 4,
        _ => 0,
    }
}

/// Display label for a competency level.
pub fn competency_label(level: &str) -> &'static str {
    match level {
        "not-competent" => "Not Competent",
        "developing" => "Developing",
        "competent" => "Competent",
        "expert" => "Expert",
        _ => "Not assessed",
    }
}

/// Display label for the overall fitness decision.
pub fn fitness_decision_label(decision: &str) -> &'static str {
    match decision {
        "fit-for-duty" => "Fit for Duty",
        "fit-with-restrictions" => "Fit with Restrictions",
        "temporarily-unfit" => "Temporarily Unfit",
        "permanently-unfit" => "Permanently Unfit",
        _ => "Not determined",
    }
}

/// Display label for an overall risk level.
pub fn risk_level_label(risk: &str) -> &'static str {
    match risk {
        "low" => "Low Risk",
        "moderate" => "Moderate Risk",
        "high" => "High Risk",
        "critical" => "Critical Risk",
        _ => "",
    }
}

/// Display label for a fired-rule grade.
pub fn grade_label(grade: u32) -> String {
    match grade {
        1 => "Grade 1 - Minor".to_string(),
        2 => "Grade 2 - Moderate".to_string(),
        3 => "Grade 3 - Significant".to_string(),
        4 => "Grade 4 - Critical".to_string(),
        _ => format!("Grade {grade}"),
    }
}

/// Aggregate a list of competency levels into a single worst-level value.
/// Empty inputs (or all unanswered) yield "".
pub fn aggregate_competency(levels: &[&str]) -> CompetencyLevel {
    let nums: Vec<i32> = levels
        .iter()
        .filter(|l| !l.is_empty())
        .map(|l| competency_to_number(l))
        .collect();
    if nums.is_empty() {
        return String::new();
    }
    let min_val = nums.iter().copied().min().unwrap_or(0);
    match min_val {
        1 => "not-competent".to_string(),
        2 => "developing".to_string(),
        3 => "competent".to_string(),
        4 => "expert".to_string(),
        _ => String::new(),
    }
}

/// Calculate BMI from weight (kg) and height (cm). Returns None on bad input.
pub fn calculate_bmi(weight_kg: Option<f64>, height_cm: Option<f64>) -> Option<f64> {
    match (weight_kg, height_cm) {
        (Some(w), Some(h)) if w > 0.0 && h > 0.0 => {
            let m = h / 100.0;
            Some(((w / (m * m)) * 10.0).round() / 10.0)
        }
        _ => None,
    }
}

/// BMI category label.
pub fn bmi_category(bmi: Option<f64>) -> &'static str {
    match bmi {
        None => "",
        Some(b) if b < 18.5 => "Underweight",
        Some(b) if b < 25.0 => "Normal",
        Some(b) if b < 30.0 => "Overweight",
        Some(b) if b < 35.0 => "Obese Class I",
        Some(b) if b < 40.0 => "Obese Class II",
        _ => "Obese Class III (Morbid)",
    }
}
