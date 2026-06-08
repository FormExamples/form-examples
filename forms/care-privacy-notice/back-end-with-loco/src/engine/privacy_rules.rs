//! Privacy rules module.

use super::types::AssessmentData;

/// A declarative completeness rule. Each rule fires when its corresponding
/// acknowledgement field is missing.
pub struct PrivacyRule {
    /// ID.
    pub id: &'static str,
    /// Message.
    pub message: &'static str,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All Care Privacy Notice completeness rules. Rule IDs are preserved
/// verbatim from the canonical JavaScript engine at
/// `front-end-form-with-html/js/grader.js`.
pub fn all_rules() -> Vec<PrivacyRule> {
    vec![
        PrivacyRule {
            id: "acknowledgment-not-checked",
            message: "Patient has not checked the acknowledgment box.",
            evaluate: |d| !d.acknowledgment.checked,
        },
        PrivacyRule {
            id: "name-blank",
            message: "Patient name is required.",
            evaluate: |d| d.acknowledgment.patient_name.trim().is_empty(),
        },
        PrivacyRule {
            id: "date-blank",
            message: "Date is required.",
            evaluate: |d| d.acknowledgment.date.trim().is_empty(),
        },
    ]
}
