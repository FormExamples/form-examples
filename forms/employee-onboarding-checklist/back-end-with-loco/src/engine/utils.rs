//! Helper predicates and counters used by the grader.

use chrono::NaiveDate;

/// Derive completion status from percentage.
pub fn derive_completion_status(percentage: f64) -> String {
    if percentage <= 0.0 {
        "not-started".to_string()
    } else if percentage < 50.0 {
        "in-progress".to_string()
    } else if percentage < 90.0 {
        "mostly-complete".to_string()
    } else {
        "complete".to_string()
    }
}

/// Completion status label.
pub fn completion_status_label(status: &str) -> String {
    match status {
        "not-started" => "Not Started".to_string(),
        "in-progress" => "In Progress".to_string(),
        "mostly-complete" => "Mostly Complete".to_string(),
        "complete" => "Complete".to_string(),
        _ => format!("Status: {status}"),
    }
}

/// Completion status CSS class.
pub fn completion_status_class(status: &str) -> String {
    match status {
        "not-started" => "status-not-started".to_string(),
        "in-progress" => "status-in-progress".to_string(),
        "mostly-complete" => "status-mostly-complete".to_string(),
        "complete" => "status-complete".to_string(),
        _ => String::new(),
    }
}

/// Risk level label.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// Risk level CSS class.
pub fn risk_level_class(risk: &str) -> String {
    match risk {
        "low" => "risk-low".to_string(),
        "moderate" => "risk-moderate".to_string(),
        "high" => "risk-high".to_string(),
        "critical" => "risk-critical".to_string(),
        _ => String::new(),
    }
}

/// Grade label for fired rules.
pub fn grade_label(grade: i32) -> String {
    match grade {
        1 => "Minor".to_string(),
        2 => "Moderate".to_string(),
        3 => "Significant".to_string(),
        4 => "Critical".to_string(),
        _ => format!("Grade {grade}"),
    }
}

/// Check if a date string (YYYY-MM-DD) is in the past.
pub fn is_date_past(date_str: &str) -> bool {
    if date_str.is_empty() {
        return false;
    }
    match NaiveDate::parse_from_str(date_str, "%Y-%m-%d") {
        Ok(d) => d < chrono::Utc::now().date_naive(),
        Err(_) => false,
    }
}

/// Check if a date string (YYYY-MM-DD) is within `months` months from today.
pub fn is_date_within_months(date_str: &str, months: i32) -> bool {
    if date_str.is_empty() {
        return false;
    }
    let parsed = match NaiveDate::parse_from_str(date_str, "%Y-%m-%d") {
        Ok(d) => d,
        Err(_) => return false,
    };
    let today = chrono::Utc::now().date_naive();
    // Add `months` months by adding months*30 days as a simple approximation
    // matching JS `setMonth(getMonth() + 3)` semantics close enough.
    let threshold = today + chrono::Duration::days((months as i64) * 30);
    parsed < threshold
}
