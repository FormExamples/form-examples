//! Helper predicates and counters used by the grader.

/// Display label for the overall acknowledgement status.
pub fn overall_status_label(status: &str) -> String {
    match status {
        "complete" => "Complete".to_string(),
        "incomplete" => "Incomplete".to_string(),
        _ => format!("Status: {status}"),
    }
}
