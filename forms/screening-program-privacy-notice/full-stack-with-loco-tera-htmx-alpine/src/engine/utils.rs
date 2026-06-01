use chrono::{Datelike, NaiveDate, Utc};

use super::types::AssessmentData;

/// Display label for the overall acknowledgment status.
pub fn acknowledgment_status_label(status: &str) -> String {
    match status {
        "not-started" => "Not Started".to_string(),
        "in-progress" => "In Progress".to_string(),
        "complete" => "Complete".to_string(),
        "complete-with-concerns" => "Complete (with concerns)".to_string(),
        _ => format!("Status: {status}"),
    }
}

/// Calculate age in years from a YYYY-MM-DD date-of-birth string.
pub fn calculate_age(dob: &str) -> Option<i32> {
    if dob.is_empty() {
        return None;
    }
    let birth = NaiveDate::parse_from_str(dob, "%Y-%m-%d").ok()?;
    let today = Utc::now().date_naive();
    let mut age = today.year() - birth.year();
    if today.month() < birth.month()
        || (today.month() == birth.month() && today.day() < birth.day())
    {
        age -= 1;
    }
    Some(age)
}

/// Has the patient ticked the confirmation checkbox?
pub fn is_confirmed(data: &AssessmentData) -> bool {
    data.acknowledgment.confirmed
}

/// Has the patient supplied their full name?
pub fn has_full_name(data: &AssessmentData) -> bool {
    !data.acknowledgment.full_name.trim().is_empty()
}

/// Has the patient supplied an acknowledged date?
pub fn has_acknowledged_date(data: &AssessmentData) -> bool {
    !data.acknowledgment.acknowledged_date.trim().is_empty()
}

/// Mirror of the front-end `checkFormValidity()` predicate.
pub fn form_is_valid(data: &AssessmentData) -> bool {
    is_confirmed(data) && has_full_name(data) && has_acknowledged_date(data)
}
