//! Helper predicates and counters used by the grader.

use super::types::AssessmentData;

/// Display label for a section identifier (mirrors `sectionLabel` in types.js).
pub fn section_label(section: &str) -> String {
    match section {
        "requestingProvider" => "Requesting Provider".to_string(),
        "receivingProvider" => "Receiving Provider".to_string(),
        "patientDemographics" => "Patient Demographics".to_string(),
        "situation" => "Situation".to_string(),
        "background" => "Background".to_string(),
        "assessment" => "Assessment".to_string(),
        "recommendation" => "Recommendation".to_string(),
        "transferLogistics" => "Transfer Logistics".to_string(),
        "signoffAcknowledgement" => "Sign-off & Acknowledgement".to_string(),
        other => other.to_string(),
    }
}

/// Display label for a flag priority.
pub fn priority_label(priority: &str) -> String {
    match priority {
        "urgent" => "Urgent".to_string(),
        "high" => "High".to_string(),
        "medium" => "Medium".to_string(),
        "low" => "Low".to_string(),
        _ => String::new(),
    }
}

/// Display label for a completeness level.
pub fn completeness_label(level: &str) -> String {
    match level {
        "complete" => "Complete".to_string(),
        "partial" => "Partial".to_string(),
        "incomplete" => "Incomplete".to_string(),
        _ => String::new(),
    }
}

/// True if a string is non-empty after trimming.
pub fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// True if a Yes/No/Unknown field has been answered.
pub fn is_yes_no_unknown_answered(value: &str) -> bool {
    matches!(value, "yes" | "no" | "unknown")
}

/// True if any field on the receiving-provider acknowledgement has been touched.
pub fn acknowledgement_started(data: &AssessmentData) -> bool {
    let a = &data.signoff_acknowledgement;
    has_text(&a.receiving_provider_name)
        || has_text(&a.receiving_provider_signature)
        || has_text(&a.receiving_provider_signature_date)
        || a.acknowledgement_received
        || has_text(&a.acknowledgement_notes)
}
