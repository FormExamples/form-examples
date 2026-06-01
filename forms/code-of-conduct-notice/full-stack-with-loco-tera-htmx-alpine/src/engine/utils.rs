use super::types::{AssessmentData, ValidationStatus};

/// Completeness percentage = round((completed / total) * 100). When `total`
/// is zero the form is considered fully complete (100%).
pub fn completeness_percent(completed: u32, total: u32) -> u32 {
    if total == 0 {
        return 100;
    }
    ((completed as f64 / total as f64) * 100.0).round() as u32
}

/// Overall validation status from the completeness percentage.
pub fn validation_status(completeness: u32) -> ValidationStatus {
    if completeness == 100 {
        "Complete".to_string()
    } else {
        "Incomplete".to_string()
    }
}

/// Human-readable completeness label, e.g. "67% Complete".
pub fn completeness_label(completeness: u32) -> String {
    format!("{completeness}% Complete")
}

/// Effective acknowledgement status used for badge display.
///
/// - `acknowledged` — overall status is Complete and `agreed` is `true`
/// - `declined`     — `agreed` is `false` but both name and date are present
/// - `incomplete`   — anything else
pub fn acknowledgement_status(status: &str, data: &AssessmentData) -> String {
    if status == "Complete" && data.acknowledgement_signature.agreed {
        return "acknowledged".to_string();
    }
    let ack = &data.acknowledgement_signature;
    if !ack.agreed
        && !ack.recipient_typed_full_name.trim().is_empty()
        && !ack.recipient_typed_date.trim().is_empty()
    {
        return "declined".to_string();
    }
    "incomplete".to_string()
}

/// Friendly label for an acknowledgement-status string.
pub fn acknowledgement_status_label(s: &str) -> String {
    match s {
        "acknowledged" => "Acknowledged".to_string(),
        "declined" => "Declined".to_string(),
        "incomplete" => "Incomplete".to_string(),
        _ => String::new(),
    }
}
