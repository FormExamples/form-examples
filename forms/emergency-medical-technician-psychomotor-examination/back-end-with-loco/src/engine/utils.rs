//! Helper predicates and counters used by the grader.

/// Display label for a tri-state response.
pub fn tri_state_label(status: &str) -> String {
    match status {
        "yes" => "Performed".to_string(),
        "no" => "Not performed".to_string(),
        "na" => "Not applicable".to_string(),
        _ => "—".to_string(),
    }
}

/// Display label for the pass/fail outcome.
pub fn outcome_label(outcome: &str) -> String {
    match outcome {
        "pass" => "Pass".to_string(),
        "fail" => "Fail".to_string(),
        _ => String::new(),
    }
}
