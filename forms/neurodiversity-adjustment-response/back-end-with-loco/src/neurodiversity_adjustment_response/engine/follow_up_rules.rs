//! Axis D — follow-up / review urgency, plus the target timeframe.
//!
//! Urgency ladder `none → review-scheduled → urgent-review → escalation-needed`.
//! Exactly one rule fires (first match wins). An escalation, or a high
//! legal-risk band, drives the most-urgent bands regardless of the review
//! arrangements.

use super::types::{FiredRule, FollowUpUrgency, LegalRiskBand, NeurodiversityAdjustmentResponse};
use super::utils::any_agreed;

/// The Axis-D outcome: urgency, target timeframe, and fired rule.
pub struct FollowUp {
    /// Follow-up / review urgency.
    pub follow_up_urgency: FollowUpUrgency,
    /// Target timeframe for the next review or action.
    pub target_timeframe: String,
    /// Fired rule for the audit trail.
    pub fired_rules: Vec<FiredRule>,
}

/// Grade follow-up urgency from the response and the already-computed
/// legal-risk band.
#[must_use]
pub fn grade_follow_up(
    r: &NeurodiversityAdjustmentResponse,
    legal_risk_band: &LegalRiskBand,
) -> FollowUp {
    let agreed = any_agreed(r);

    let (urgency, rule_id, category, description): (&str, &str, &str, &str) = if r.escalated {
        (
            "escalation-needed",
            "R-FOLLOWUP-ESCALATED",
            "escalated",
            "Escalation in progress — engage HR / grievance procedure.",
        )
    } else if legal_risk_band == "high-risk" {
        (
            "urgent-review",
            "R-FOLLOWUP-LEGAL-RISK",
            "legal-risk",
            "High discrimination risk — reconsider the decision urgently.",
        )
    } else if r.review_scheduled {
        (
            "review-scheduled",
            "R-FOLLOWUP-REVIEW",
            "review-scheduled",
            "Review scheduled for the agreed adjustments.",
        )
    } else if agreed {
        (
            "urgent-review",
            "R-FOLLOWUP-NO-REVIEW",
            "no-review",
            "Adjustments agreed but no review scheduled — schedule one.",
        )
    } else {
        (
            "none",
            "R-FOLLOWUP-NONE",
            "none",
            "No follow-up scheduled.",
        )
    };

    let target_timeframe = match urgency {
        "escalation-needed" => "Escalate now".to_string(),
        "urgent-review" => "Within 2 weeks".to_string(),
        "review-scheduled" => {
            if r.review_date.trim().is_empty() {
                "At the scheduled review".to_string()
            } else {
                r.review_date.trim().to_string()
            }
        }
        _ => "No follow-up scheduled".to_string(),
    };

    FollowUp {
        follow_up_urgency: urgency.to_string(),
        target_timeframe,
        fired_rules: vec![FiredRule {
            rule_id: rule_id.to_string(),
            axis: "follow-up".to_string(),
            category: category.to_string(),
            description: description.to_string(),
        }],
    }
}
