/// Display label for the overall counter-referral form status.
pub fn form_status_label(status: &str) -> String {
    match status {
        "not-started" => "Not Started".to_string(),
        "in-progress" => "In Progress".to_string(),
        "complete" => "Complete".to_string(),
        "complete-with-concerns" => "Complete (with concerns)".to_string(),
        _ => format!("Status: {status}"),
    }
}
