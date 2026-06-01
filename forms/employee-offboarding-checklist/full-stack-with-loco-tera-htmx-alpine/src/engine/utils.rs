/// Display label for the offboarding outcome.
pub fn outcome_label(outcome: &str) -> String {
    match outcome {
        "complete" => "Complete".to_string(),
        "partial" => "Partial".to_string(),
        "incomplete" => "Incomplete".to_string(),
        _ => format!("Outcome: {outcome}"),
    }
}

/// Display label for a flag priority.
pub fn priority_label(priority: &str) -> String {
    match priority {
        "high" => "HIGH".to_string(),
        "medium" => "MEDIUM".to_string(),
        "low" => "LOW".to_string(),
        _ => priority.to_string(),
    }
}
