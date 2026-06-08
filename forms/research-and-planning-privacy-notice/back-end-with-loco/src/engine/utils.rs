//! Helper predicates and counters used by the grader.

use super::types::{AssessmentData, ValidationStatus};

/// Mirrors the TypeScript `completenessPercent` helper.
pub fn completeness_percent(completed: u32, total: u32) -> u32 {
    if total == 0 {
        return 100;
    }
    ((completed as f64 / total as f64) * 100.0).round() as u32
}

/// Mirrors the TypeScript `validationStatus` helper: 100 % → Complete.
pub fn validation_status(completeness: u32) -> ValidationStatus {
    if completeness == 100 {
        "Complete".to_string()
    } else {
        "Incomplete".to_string()
    }
}

/// Display label for the completeness percentage (e.g. "87% Complete").
pub fn completeness_label(completeness: u32) -> String {
    format!("{completeness}% Complete")
}

/// Effective acknowledgement-status badge derived from the form state.
///
/// - `acknowledged` — every required field filled AND `agreed` is true.
/// - `declined`     — recipient typed name AND date but un-checked the box.
/// - `incomplete`   — anything else.
pub fn acknowledgement_status(status: &ValidationStatus, data: &AssessmentData) -> String {
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

/// Friendly label for an acknowledgement status badge.
pub fn acknowledgement_status_label(s: &str) -> String {
    match s {
        "acknowledged" => "Acknowledged".to_string(),
        "declined" => "Declined".to_string(),
        "incomplete" => "Incomplete".to_string(),
        _ => String::new(),
    }
}
