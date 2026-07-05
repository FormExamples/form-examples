//! Shared predicates and display helpers used by the four-axis engine.

use super::types::NeurodiversityAdjustmentReview;

// ──────────────────────────────────────────────
// Effectiveness predicates
// ──────────────────────────────────────────────

/// The eight per-category effectiveness field values, in order.
#[must_use]
pub fn eff_values(r: &NeurodiversityAdjustmentReview) -> [&str; 8] {
    [
        r.effectiveness_working_environment.as_str(),
        r.effectiveness_equipment_technology.as_str(),
        r.effectiveness_working_arrangements.as_str(),
        r.effectiveness_communication.as_str(),
        r.effectiveness_support_mentoring.as_str(),
        r.effectiveness_recruitment_process.as_str(),
        r.effectiveness_policy_dress.as_str(),
        r.effectiveness_other.as_str(),
    ]
}

/// Effectiveness values for adjustments actually in place: `working-well`,
/// `partial`, or `not-working` (excludes `''` and `not-in-place`).
#[must_use]
pub fn rated_values(r: &NeurodiversityAdjustmentReview) -> Vec<&str> {
    eff_values(r)
        .into_iter()
        .filter(|v| matches!(*v, "working-well" | "partial" | "not-working"))
        .collect()
}

/// Number of adjustments in place that have been rated.
#[must_use]
pub fn rated_count(r: &NeurodiversityAdjustmentReview) -> usize {
    rated_values(r).len()
}

/// Number of rated adjustments that are working well.
#[must_use]
pub fn working_well_count(r: &NeurodiversityAdjustmentReview) -> usize {
    rated_values(r)
        .into_iter()
        .filter(|v| *v == "working-well")
        .count()
}

/// Whether any rated adjustment is `not-working`.
#[must_use]
pub fn any_not_working(r: &NeurodiversityAdjustmentReview) -> bool {
    rated_values(r).into_iter().any(|v| v == "not-working")
}

/// Whether any of the eight effectiveness fields has been answered (non-empty).
#[must_use]
pub fn any_effectiveness_answered(r: &NeurodiversityAdjustmentReview) -> bool {
    eff_values(r).into_iter().any(|v| !v.is_empty())
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/// Axis A effectiveness-band display label.
#[must_use]
pub fn effectiveness_band_label(value: &str) -> String {
    match value {
        "effective" => "Effective",
        "partially-effective" => "Partially effective",
        "ineffective" => "Ineffective",
        "not-yet-assessed" => "Not yet assessed",
        _ => "Not graded",
    }
    .to_string()
}

/// Axis B wellbeing-risk-band display label.
#[must_use]
pub fn wellbeing_risk_band_label(value: &str) -> String {
    match value {
        "ok" => "OK",
        "caution" => "Caution",
        "high-risk" => "High risk",
        _ => "Not graded",
    }
    .to_string()
}

/// Axis D next-step-urgency display label.
#[must_use]
pub fn next_step_urgency_label(value: &str) -> String {
    match value {
        "none" => "None",
        "review-scheduled" => "Review scheduled",
        "adjust-now" => "Adjust now",
        "escalate" => "Escalate",
        _ => "Not graded",
    }
    .to_string()
}

/// Overall-recommendation display label.
#[must_use]
pub fn recommendation_label(value: &str) -> String {
    match value {
        "maintain" => "Maintain the current adjustments",
        "adjust-adjustments" => "Adjust the adjustments",
        "seek-occupational-health" => "Seek an occupational-health assessment",
        "schedule-next-review" => "Schedule the next review",
        "escalate-to-hr" => "Escalate to HR",
        _ => "No recommendation",
    }
    .to_string()
}

/// Human-readable review-status label.
#[must_use]
pub fn review_status_label(value: &str) -> String {
    match value {
        "draft" => "Draft",
        "completed" => "Completed",
        "changes-agreed" => "Changes agreed",
        "escalated" => "Escalated",
        "cancelled" => "Cancelled",
        _ => "Unspecified",
    }
    .to_string()
}

/// Human-readable manager-role label.
#[must_use]
pub fn manager_role_label(value: &str) -> String {
    match value {
        "line-manager" => "Line manager",
        "hr-adviser" => "HR adviser",
        "occupational-health" => "Occupational health",
        "diversity-lead" => "Diversity lead",
        "senior-manager" => "Senior manager",
        "other" => "Other",
        _ => "Unspecified",
    }
    .to_string()
}
