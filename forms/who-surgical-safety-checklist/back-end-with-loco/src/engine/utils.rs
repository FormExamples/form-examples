//! Helper predicates and counters used by the grader.

use chrono::{Datelike, NaiveDate, Utc};

use super::types::AssessmentData;

/// Display label for the overall checklist status.
pub fn checklist_status_label(status: &str) -> String {
    match status {
        "not-started" => "Not Started".to_string(),
        "sign-in-complete" => "Sign In Complete".to_string(),
        "time-out-complete" => "Time Out Complete".to_string(),
        "sign-out-complete" => "Sign Out Complete".to_string(),
        "complete" => "Complete".to_string(),
        "complete-with-concerns" => "Complete (with concerns)".to_string(),
        "abandoned" => "Abandoned".to_string(),
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

/// Has the Sign In phase been signed off by a coordinator?
pub fn sign_in_signed_off(data: &AssessmentData) -> bool {
    !data.sign_in.coordinator_name.trim().is_empty()
        && !data.sign_in.completed_at.trim().is_empty()
}

/// Has the Time Out phase been signed off by a coordinator?
pub fn time_out_signed_off(data: &AssessmentData) -> bool {
    !data.time_out.coordinator_name.trim().is_empty()
        && !data.time_out.completed_at.trim().is_empty()
}

/// Has the Sign Out phase been signed off by a coordinator?
pub fn sign_out_signed_off(data: &AssessmentData) -> bool {
    !data.sign_out.coordinator_name.trim().is_empty()
        && !data.sign_out.completed_at.trim().is_empty()
}

/// Has the case been abandoned (sign-out coordinator missing but reason given)?
pub fn case_abandoned(data: &AssessmentData) -> bool {
    !data.case_details.abandoned_reason.trim().is_empty()
}

/// Paediatric blood-loss threshold: > 500 ml for adults, > 7 ml/kg for children.
/// Returns the threshold in millilitres, or 500 if no paediatric weight available.
pub fn blood_loss_threshold_ml(data: &AssessmentData) -> i32 {
    if data.case_details.is_paediatric == "yes" {
        if let Some(kg) = data.case_details.patient_weight_as_kg {
            let calc = (kg * 7.0).round() as i32;
            if calc > 0 {
                return calc;
            }
        }
    }
    500
}
