//! Pure four-axis grading engine for a neurodiversity reasonable-adjustments
//! response.
//!
//! Computes:
//! - Axis A: outcome classification (fully-agreed / partially-agreed /
//!   alternative-offered / declined / deferred).
//! - Axis B: legal / discrimination risk band (ok / caution / high-risk).
//! - Axis C: response completeness percent (0–100).
//! - Axis D: follow-up / review urgency + target timeframe.
//!
//! Plus an overall recommendation, the fired-rule audit trail, and compliance /
//! risk flags.
//!
//! Invariant: declining adjustments for a worker likely covered by the Equality
//! Act 2010 without an adequate reasonableness justification or alternatives
//! drives Axis B to high-risk, raises `F-DISCRIMINATION-RISK-001`, and
//! auto-escalates Axis D. The least-alarming band is chosen only when no rule
//! fires. No side effects.

use super::completeness_rules::grade_completeness;
use super::flagged_issues::detect_flags;
use super::follow_up_rules::grade_follow_up;
use super::legal_risk_rules::grade_legal_risk;
use super::outcome_rules::classify_outcome;
use super::types::{FiredRule, GradingResult, NeurodiversityAdjustmentResponse, Recommendation};
use super::utils::{any_agreed, recommendation_label};

/// Grade a full response. Pure function — no side effects.
#[must_use]
pub fn calculate_grade(response: &NeurodiversityAdjustmentResponse) -> GradingResult {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // Axis A — outcome classification
    let (outcome_classification, a_rules) = classify_outcome(response);
    fired_rules.extend(a_rules);

    // Axis B — legal / discrimination risk
    let (legal_risk_band, b_rules) = grade_legal_risk(response);
    fired_rules.extend(b_rules);

    // Axis C — completeness
    let (completeness_percent, c_rules) = grade_completeness(response);
    fired_rules.extend(c_rules);

    // Axis D — follow-up / review urgency
    let d = grade_follow_up(response, &legal_risk_band);
    fired_rules.extend(d.fired_rules);

    let recommendation = derive_recommendation(response, &legal_risk_band);
    let recommendation_label_value = recommendation_label(&recommendation);

    let flags = detect_flags(response, &legal_risk_band, completeness_percent);

    GradingResult {
        outcome_classification,
        legal_risk_band,
        completeness_percent,
        follow_up_urgency: d.follow_up_urgency,
        target_timeframe: d.target_timeframe,
        recommendation,
        recommendation_label: recommendation_label_value,
        fired_rules,
        flags,
        graded_at: chrono::Utc::now().to_rfc3339(),
    }
}

/// Derive the overall recommendation from the response and the legal-risk band.
/// First match wins.
fn derive_recommendation(
    r: &NeurodiversityAdjustmentResponse,
    legal_risk_band: &str,
) -> Recommendation {
    if r.escalated {
        return "escalate-to-hr".to_string();
    }
    if legal_risk_band == "high-risk" {
        return "reconsider-decision".to_string();
    }
    if any_agreed(r) && !r.review_scheduled {
        return "schedule-review".to_string();
    }
    if r.overall_decision == "deferred" && !r.occupational_health_referred {
        return "seek-occupational-health".to_string();
    }
    "implement".to_string()
}
