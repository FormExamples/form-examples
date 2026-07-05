//! Axis D — next-step urgency, plus the target timeframe.
//!
//! Urgency ladder `none → review-scheduled → adjust-now → escalate`. Exactly
//! one rule fires (first match wins). An escalation, a high wellbeing-risk band,
//! a failing adjustment, or an agreed change drives the most-urgent bands
//! regardless of the review schedule.

use super::types::{FiredRule, NeurodiversityAdjustmentReview, NextStepUrgency, WellbeingRiskBand};
use super::utils::any_not_working;

/// The Axis-D outcome: urgency, target timeframe, and fired rule.
pub struct NextStep {
    /// Next-step urgency.
    pub next_step_urgency: NextStepUrgency,
    /// Target timeframe for the next step.
    pub target_timeframe: String,
    /// Fired rule for the audit trail.
    pub fired_rules: Vec<FiredRule>,
}

/// Grade next-step urgency from the review and the already-computed
/// wellbeing-risk band.
#[must_use]
pub fn grade_next_step(
    r: &NeurodiversityAdjustmentReview,
    wellbeing_risk_band: &WellbeingRiskBand,
) -> NextStep {
    let (urgency, rule_id, category, description): (&str, &str, &str, &str) = if r.escalated {
        (
            "escalate",
            "R-NEXT-ESCALATED",
            "escalated",
            "Escalation in progress — follow the escalation procedure.",
        )
    } else if wellbeing_risk_band == "high-risk" {
        (
            "adjust-now",
            "R-NEXT-HIGH-RISK",
            "high-risk",
            "High wellbeing risk — act now.",
        )
    } else if any_not_working(r) || r.changes_needed {
        (
            "adjust-now",
            "R-NEXT-CHANGES",
            "changes",
            "A failing adjustment or an agreed change needs action.",
        )
    } else if !r.next_review_date.trim().is_empty() {
        (
            "review-scheduled",
            "R-NEXT-REVIEW-SCHEDULED",
            "review-scheduled",
            "Next review is scheduled.",
        )
    } else {
        (
            "none",
            "R-NEXT-NONE",
            "none",
            "No further action scheduled.",
        )
    };

    let target_timeframe = match urgency {
        "escalate" => "Escalate now".to_string(),
        "adjust-now" => "Within 2 weeks".to_string(),
        "review-scheduled" => {
            if r.next_review_date.trim().is_empty() {
                "At the scheduled review".to_string()
            } else {
                r.next_review_date.trim().to_string()
            }
        }
        _ => "No follow-up scheduled".to_string(),
    };

    NextStep {
        next_step_urgency: urgency.to_string(),
        target_timeframe,
        fired_rules: vec![FiredRule {
            rule_id: rule_id.to_string(),
            axis: "next-step".to_string(),
            category: category.to_string(),
            description: description.to_string(),
        }],
    }
}
