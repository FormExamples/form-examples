//! Acknowledgment rules module.

use super::types::AssessmentData;

/// A declarative acknowledgment rule. Each rule fires when its corresponding
/// item is unanswered (or fails the front-end completion requirement).
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

/// All Screening Program Privacy Notice rules. A rule fires when the item is
/// **unanswered** — i.e. the patient has not yet provided that information.
///
/// Severity:
/// - `critical` — confirmation tick (ACK-01). Without this, no acknowledgment
///   can be deemed complete per UK GDPR Article 9(2)(a).
/// - `required` — every other required field (signature, date).
pub fn all_rules() -> Vec<AcknowledgmentRule> {
    vec![
        AcknowledgmentRule {
            id: "ACK-01",
            category: "Confirmation",
            description:
                "Patient has confirmed they have read and understood the privacy notice",
            severity: "critical",
            evaluate: |d| !d.acknowledgment.confirmed,
        },
        AcknowledgmentRule {
            id: "ACK-02",
            category: "Signature",
            description: "Patient has provided their full name as a typed signature",
            severity: "required",
            evaluate: |d| d.acknowledgment.full_name.trim().is_empty(),
        },
        AcknowledgmentRule {
            id: "ACK-03",
            category: "Date",
            description: "Patient has provided the acknowledgment date",
            severity: "required",
            evaluate: |d| d.acknowledgment.acknowledged_date.trim().is_empty(),
        },
    ]
}
