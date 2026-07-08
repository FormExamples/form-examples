//! Axis A — outcome classification.
//!
//! Classifies the employer's overall decision. Exactly one rule fires (first
//! match wins):
//! - `fully-agreed`: all requested adjustments agreed.
//! - `partially-agreed`: some requested adjustments agreed.
//! - `alternative-offered`: alternatives offered in place of those requested.
//! - `declined`: requested adjustments declined.
//! - `deferred`: decision deferred pending further information.
//! - `''`: no overall decision recorded yet.
//!
//! Rule IDs are stable and identical across every front-end and the back-end.

use super::types::{FiredRule, NeurodiversityAdjustmentResponse, OutcomeClassification};

/// Classify the outcome, returning the classification plus the fired rule.
#[must_use]
pub fn classify_outcome(
    r: &NeurodiversityAdjustmentResponse,
) -> (OutcomeClassification, Vec<FiredRule>) {
    let (classification, rule_id, description) = match r.overall_decision.as_str() {
        "agreed" => (
            "fully-agreed",
            "R-OUTCOME-AGREED",
            "All requested adjustments agreed.",
        ),
        "partially-agreed" => (
            "partially-agreed",
            "R-OUTCOME-PARTIAL",
            "Some requested adjustments agreed.",
        ),
        "alternative-offered" => (
            "alternative-offered",
            "R-OUTCOME-ALTERNATIVE",
            "Alternative adjustments offered in place of those requested.",
        ),
        "declined" => (
            "declined",
            "R-OUTCOME-DECLINED",
            "Requested adjustments declined.",
        ),
        "deferred" => (
            "deferred",
            "R-OUTCOME-DEFERRED",
            "Decision deferred pending further information or assessment.",
        ),
        _ => (
            "",
            "R-OUTCOME-UNSPECIFIED",
            "No overall decision recorded yet.",
        ),
    };

    let fired_rules = vec![FiredRule {
        rule_id: rule_id.to_string(),
        axis: "outcome".to_string(),
        category: if classification.is_empty() {
            "unspecified".to_string()
        } else {
            classification.to_string()
        },
        description: description.to_string(),
    }];

    (classification.to_string(), fired_rules)
}
