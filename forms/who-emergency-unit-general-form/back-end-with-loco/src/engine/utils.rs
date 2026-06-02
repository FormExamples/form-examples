//! Engine utility helpers shared across grader / validator / flagged issues.

use super::types::AssessmentData;

/// Display label for the encounter status.
pub fn encounter_status_label(status: &str) -> String {
    match status {
        "not-started" => "Not Started".to_string(),
        "in-progress" => "In Progress".to_string(),
        "complete" => "Complete".to_string(),
        "complete-with-concerns" => "Complete (with concerns)".to_string(),
        "abandoned" => "Abandoned".to_string(),
        _ => format!("Status: {status}"),
    }
}

/// True if the encounter has been abandoned (left without being seen) and
/// the disposition has not been completed normally.
pub fn case_abandoned(data: &AssessmentData) -> bool {
    data.disposition.left_without_being_seen
}
