//! Axis D — follow-up urgency, plus the target timeframe and recommended action.
//!
//! Escalation ladder (routine → recommended → urgent → critical-alert). A
//! critical result auto-escalates to critical-alert regardless of the other
//! axes (the safety invariant). The least-urgent band is chosen only when no
//! rule fires.

use super::types::{
    CardiologyResponse, FiredRule, FollowUpUrgency, ResponseClassification, Severity,
};
use super::utils::has_critical_finding;

/// The Axis-D outcome: urgency, target timeframe, recommended action, fired rules.
pub struct FollowUp {
    /// Axis D follow-up urgency.
    pub follow_up_urgency: FollowUpUrgency,
    /// Target timeframe for the recommended follow-up.
    pub target_timeframe: String,
    /// Concise recommended action.
    pub recommended_action: String,
    /// Fired rules for the audit trail.
    pub fired_rules: Vec<FiredRule>,
}

/// Grade follow-up urgency from the response and the already-computed axes.
#[must_use]
pub fn grade_follow_up(
    r: &CardiologyResponse,
    classification: &ResponseClassification,
    severity: &Severity,
) -> FollowUp {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // ─── critical-alert: auto-escalation invariant ───
    if has_critical_finding(r) || classification == "critical" {
        fired_rules.push(FiredRule {
            rule_id: "R-FOLLOWUP-CRITICAL-01".to_string(),
            axis: "follow-up".to_string(),
            category: "critical-result".to_string(),
            description:
                "Critical result auto-escalates follow-up urgency to critical-alert regardless of the other axes."
                    .to_string(),
        });
        return FollowUp {
            follow_up_urgency: "critical-alert".to_string(),
            target_timeframe: "immediate".to_string(),
            recommended_action:
                "Communicate the critical result directly to the referrer now and arrange urgent review; document the conversation."
                    .to_string(),
            fired_rules,
        };
    }

    // ─── urgent ───
    if severity == "major" {
        fired_rules.push(FiredRule {
            rule_id: "R-FOLLOWUP-URGENT-01".to_string(),
            axis: "follow-up".to_string(),
            category: "major-condition".to_string(),
            description: "Major cardiac condition present; follow-up urgency graded urgent."
                .to_string(),
        });
        return FollowUp {
            follow_up_urgency: "urgent".to_string(),
            target_timeframe: "within 2 weeks".to_string(),
            recommended_action:
                "Arrange urgent cardiology follow-up and expedite specialist management as clinically indicated."
                    .to_string(),
            fired_rules,
        };
    }

    // ─── recommended ───
    if severity == "moderate" || severity == "minor" {
        fired_rules.push(FiredRule {
            rule_id: "R-FOLLOWUP-RECOMMENDED-01".to_string(),
            axis: "follow-up".to_string(),
            category: "cardiac-condition".to_string(),
            description: "A cardiac condition is present; structured follow-up recommended."
                .to_string(),
        });
        return FollowUp {
            follow_up_urgency: "recommended".to_string(),
            target_timeframe: "within 6 weeks".to_string(),
            recommended_action:
                "Recommend routine cardiology follow-up or onward investigation as clinically indicated."
                    .to_string(),
            fired_rules,
        };
    }

    if classification == "inconclusive" {
        fired_rules.push(FiredRule {
            rule_id: "R-FOLLOWUP-RECOMMENDED-02".to_string(),
            axis: "follow-up".to_string(),
            category: "inconclusive".to_string(),
            description: "Inconclusive response; further assessment or investigation recommended."
                .to_string(),
        });
        return FollowUp {
            follow_up_urgency: "recommended".to_string(),
            target_timeframe: "within 6 weeks".to_string(),
            recommended_action:
                "Recommend further assessment or investigation to resolve the inconclusive response."
                    .to_string(),
            fired_rules,
        };
    }

    // ─── routine: least-urgent band, no rule fired ───
    fired_rules.push(FiredRule {
        rule_id: "R-FOLLOWUP-ROUTINE-01".to_string(),
        axis: "follow-up".to_string(),
        category: "no-abnormality".to_string(),
        description: "No escalation rule fired; routine follow-up only.".to_string(),
    });
    FollowUp {
        follow_up_urgency: "routine".to_string(),
        target_timeframe: "no specific follow-up".to_string(),
        recommended_action:
            "No specific cardiology follow-up required; discharge back to the referrer for usual care."
                .to_string(),
        fired_rules,
    }
}
