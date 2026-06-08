//! Helper predicates and counters used by the grader.

/// Classify a single standardised score (mean 100, SD 15) into a severity band.
/// - 85+   -> "none"      (average or above)
/// - 70-84 -> "mild"      (below average)
/// - 55-69 -> "moderate"  (well below average)
/// - <55   -> "severe"    (significantly below average)
pub fn score_severity(score: Option<i32>) -> String {
    match score {
        None => "none".to_string(),
        Some(s) if s >= 85 => "none".to_string(),
        Some(s) if s >= 70 => "mild".to_string(),
        Some(s) if s >= 55 => "moderate".to_string(),
        Some(_) => "severe".to_string(),
    }
}

/// Friendly band label for a standardised score.
pub fn score_band_label(score: Option<i32>) -> String {
    match score {
        None => String::new(),
        Some(s) if s >= 116 => "Above average".to_string(),
        Some(s) if s >= 85 => "Average".to_string(),
        Some(s) if s >= 70 => "Below average".to_string(),
        Some(s) if s >= 55 => "Well below average".to_string(),
        Some(_) => "Significantly below average".to_string(),
    }
}

/// Friendly label for an overall Severity band.
pub fn severity_label(severity: &str) -> String {
    match severity {
        "none" => "No dyslexia".to_string(),
        "mild" => "Mild dyslexia".to_string(),
        "moderate" => "Moderate dyslexia".to_string(),
        "severe" => "Severe dyslexia".to_string(),
        _ => String::new(),
    }
}

/// Severity ranking used to pick the most-severe of two bands.
pub fn severity_rank(severity: &str) -> u8 {
    match severity {
        "none" => 0,
        "mild" => 1,
        "moderate" => 2,
        "severe" => 3,
        _ => 0,
    }
}

/// Pick the most-severe of two severities.
pub fn max_severity(a: &str, b: &str) -> String {
    if severity_rank(a) >= severity_rank(b) {
        a.to_string()
    } else {
        b.to_string()
    }
}
