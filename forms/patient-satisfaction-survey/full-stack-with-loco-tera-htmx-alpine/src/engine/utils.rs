/// Normalize an array of Likert scores (1-5) to a 0-100 scale.
/// Ignores `None` values. Returns `None` if no valid scores.
pub fn normalize_likert_scores(scores: &[Option<i32>]) -> Option<f64> {
    let valid: Vec<i32> = scores
        .iter()
        .filter_map(|s| s.filter(|v| (1..=5).contains(v)))
        .collect();
    if valid.is_empty() {
        return None;
    }
    let sum: i32 = valid.iter().sum();
    let max_possible = (valid.len() as f64) * 5.0;
    let normalized = (sum as f64 / max_possible) * 100.0;
    Some((normalized * 10.0).round() / 10.0)
}

/// Map a normalized 0-100 score to a satisfaction category.
pub fn categorize_score(score: f64) -> String {
    if score >= 85.0 {
        "excellent".to_string()
    } else if score >= 70.0 {
        "good".to_string()
    } else if score >= 50.0 {
        "satisfactory".to_string()
    } else if score >= 25.0 {
        "poor".to_string()
    } else {
        "very-poor".to_string()
    }
}

/// Human-readable label for a satisfaction category.
pub fn satisfaction_category_label(category: &str) -> String {
    match category {
        "excellent" => "Excellent".to_string(),
        "good" => "Good".to_string(),
        "satisfactory" => "Satisfactory".to_string(),
        "poor" => "Poor".to_string(),
        "very-poor" => "Very Poor".to_string(),
        _ => String::new(),
    }
}

/// CSS-class hint for the satisfaction-category badge.
pub fn satisfaction_category_class(category: &str) -> String {
    match category {
        "excellent" => "cat-excellent".to_string(),
        "good" => "cat-good".to_string(),
        "satisfactory" => "cat-satisfactory".to_string(),
        "poor" => "cat-poor".to_string(),
        "very-poor" => "cat-very-poor".to_string(),
        _ => String::new(),
    }
}

/// Severity label for a fired rule (1-4).
pub fn severity_label(severity: u32) -> String {
    match severity {
        1 => "Minor".to_string(),
        2 => "Moderate".to_string(),
        3 => "Significant".to_string(),
        4 => "Critical".to_string(),
        other => format!("Level {other}"),
    }
}
