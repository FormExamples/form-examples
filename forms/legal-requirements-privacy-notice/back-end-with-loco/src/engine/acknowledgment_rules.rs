//! Acknowledgment rules module.

use super::types::AssessmentData;

/// A declarative acknowledgment rule. Each rule fires when its corresponding
/// item is unanswered (or fails the required-field check).
pub struct AcknowledgmentRule {
    /// ID.
    pub id: &'static str,
    /// Category.
    pub category: &'static str,
    /// Description.
    pub description: &'static str,
    /// Severity.
    pub severity: &'static str,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All Legal Requirements Privacy Notice acknowledgment rules. A rule fires
/// when the corresponding item is **unanswered** — i.e. the patient has not
/// yet provided the required confirmation.
///
/// The front-end JS submit-button validity check is:
///   `confirmed.checked && fullName.value.trim() !== '' && acknowledgedDate.value !== ''`.
/// These rules mirror those three checks verbatim.
///
/// Severity:
/// - `required` — every acknowledgment item is required for submission per the
///   front-end form validation.
pub fn all_rules() -> Vec<AcknowledgmentRule> {
    vec![
        AcknowledgmentRule {
            id: "ACK-01",
            category: "Confirmation",
            description: "Patient has confirmed they have read and understood the privacy notice",
            severity: "required",
            evaluate: |d| !d.acknowledgment.confirmed,
        },
        AcknowledgmentRule {
            id: "ACK-02",
            category: "Identity",
            description: "Patient has provided their full name",
            severity: "required",
            evaluate: |d| d.acknowledgment.full_name.trim().is_empty(),
        },
        AcknowledgmentRule {
            id: "ACK-03",
            category: "Date",
            description: "Patient has provided the acknowledged date",
            severity: "required",
            evaluate: |d| d.acknowledgment.acknowledged_date.trim().is_empty(),
        },
    ]
}
