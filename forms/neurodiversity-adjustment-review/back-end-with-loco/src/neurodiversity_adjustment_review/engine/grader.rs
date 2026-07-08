//! Pure four-axis grading engine for a neurodiversity reasonable-adjustments
//! review.
//!
//! Computes:
//! - Axis A: effectiveness band (effective / partially-effective / ineffective /
//!   not-yet-assessed).
//! - Axis B: wellbeing risk band (ok / caution / high-risk).
//! - Axis C: review completeness percent (0–100).
//! - Axis D: next-step urgency + target timeframe.
//!
//! Plus an overall recommendation, the fired-rule audit trail, and compliance /
//! risk flags.
//!
//! Invariant: any adjustment reported as not-working, a dissatisfied worker,
//! declining wellbeing, or an escalation drives the wellbeing-risk axis and the
//! next-step urgency, and raises the corresponding flag, regardless of the other
//! axes. The least-alarming band is chosen only when no rule fires. No side
//! effects.

use super::completeness_rules::grade_completeness;
use super::effectiveness_rules::grade_effectiveness;
use super::flagged_issues::detect_flags;
use super::next_step_rules::grade_next_step;
use super::types::{FiredRule, GradingResult, NeurodiversityAdjustmentReview, Recommendation};
use super::utils::{any_not_working, recommendation_label};
use super::wellbeing_rules::grade_wellbeing;

/// Grade a full review. Pure function — no side effects.
#[must_use]
pub fn calculate_grade(review: &NeurodiversityAdjustmentReview) -> GradingResult {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // Axis A — effectiveness
    let (effectiveness_band, a_rules) = grade_effectiveness(review);
    fired_rules.extend(a_rules);

    // Axis B — wellbeing risk
    let (wellbeing_risk_band, b_rules) = grade_wellbeing(review);
    fired_rules.extend(b_rules);

    // Axis C — completeness
    let (completeness_percent, c_rules) = grade_completeness(review);
    fired_rules.extend(c_rules);

    // Axis D — next-step urgency
    let d = grade_next_step(review, &wellbeing_risk_band);
    fired_rules.extend(d.fired_rules);

    let recommendation =
        derive_recommendation(review, &effectiveness_band, &wellbeing_risk_band);
    let recommendation_label_value = recommendation_label(&recommendation);

    let flags = detect_flags(review, completeness_percent);

    GradingResult {
        effectiveness_band,
        wellbeing_risk_band,
        completeness_percent,
        next_step_urgency: d.next_step_urgency,
        target_timeframe: d.target_timeframe,
        recommendation,
        recommendation_label: recommendation_label_value,
        fired_rules,
        flags,
        graded_at: chrono::Utc::now().to_rfc3339(),
    }
}

/// Derive the overall recommendation from the review, the effectiveness band,
/// and the wellbeing-risk band. First match wins.
fn derive_recommendation(
    r: &NeurodiversityAdjustmentReview,
    effectiveness_band: &str,
    wellbeing_risk_band: &str,
) -> Recommendation {
    if r.escalated {
        return "escalate-to-hr".to_string();
    }
    if effectiveness_band == "ineffective" && !r.occupational_health_rereferral {
        return "seek-occupational-health".to_string();
    }
    if wellbeing_risk_band == "high-risk" || any_not_working(r) || r.changes_needed {
        return "adjust-adjustments".to_string();
    }
    if r.next_review_date.trim().is_empty() {
        return "schedule-next-review".to_string();
    }
    "maintain".to_string()
}
