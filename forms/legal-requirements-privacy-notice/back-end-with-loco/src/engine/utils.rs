use super::types::AssessmentData;

/// Display label for the overall acknowledgment status.
pub fn acknowledgment_status_label(status: &str) -> String {
    match status {
        "not-started" => "Not Started".to_string(),
        "in-progress" => "In Progress".to_string(),
        "complete" => "Complete".to_string(),
        "incomplete" => "Incomplete".to_string(),
        _ => format!("Status: {status}"),
    }
}

/// Has the patient provided their full name?
pub fn full_name_provided(data: &AssessmentData) -> bool {
    !data.acknowledgment.full_name.trim().is_empty()
}

/// Has the patient provided the acknowledged date?
pub fn acknowledged_date_provided(data: &AssessmentData) -> bool {
    !data.acknowledgment.acknowledged_date.trim().is_empty()
}

/// Has the patient checked the confirmation box?
pub fn confirmation_checked(data: &AssessmentData) -> bool {
    data.acknowledgment.confirmed
}

/// True when every required acknowledgment item has been answered.
pub fn is_fully_acknowledged(data: &AssessmentData) -> bool {
    confirmation_checked(data) && full_name_provided(data) && acknowledged_date_provided(data)
}
