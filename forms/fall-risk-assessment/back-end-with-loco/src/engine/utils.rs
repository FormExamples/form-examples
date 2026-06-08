//! Helper predicates and counters used by the grader.

// Utility helpers shared by views and templates.

/// Friendly label for a [`Severity`](super::types::Severity) value.
pub fn severity_label(s: &str) -> String {
    match s {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the severity badge.
pub fn severity_class(s: &str) -> String {
    match s {
        "low" => "severity-low".to_string(),
        "moderate" => "severity-moderate".to_string(),
        "high" => "severity-high".to_string(),
        "critical" => "severity-critical".to_string(),
        _ => String::new(),
    }
}
