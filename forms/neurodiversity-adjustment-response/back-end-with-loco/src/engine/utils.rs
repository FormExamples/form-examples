//! Shared predicates and display helpers used by the four-axis engine.

use super::types::NeurodiversityAdjustmentResponse;

// ──────────────────────────────────────────────
// Reasonableness / agreement predicates
// ──────────────────────────────────────────────

/// Whether any of the eight `agreed*` adjustment booleans is set.
#[must_use]
pub fn any_agreed(r: &NeurodiversityAdjustmentResponse) -> bool {
    r.agreed_working_environment
        || r.agreed_equipment_technology
        || r.agreed_working_arrangements
        || r.agreed_communication
        || r.agreed_support_mentoring
        || r.agreed_recruitment_process
        || r.agreed_policy_dress
        || r.agreed_other
}

/// Whether an alternative adjustment has been offered (free-text non-empty).
#[must_use]
pub fn has_alternative(r: &NeurodiversityAdjustmentResponse) -> bool {
    !r.alternative_adjustments_detail.trim().is_empty()
}

/// Whether a decline is backed by an adequate reasonableness justification: a
/// non-empty rationale AND a decline-reason category other than `''` or
/// `not-reasonable`.
#[must_use]
pub fn decline_justified(r: &NeurodiversityAdjustmentResponse) -> bool {
    !r.decision_rationale.trim().is_empty()
        && !matches!(r.decline_reason_category.as_str(), "" | "not-reasonable")
}

/// Whole days between two ISO `YYYY-MM-DD` strings (`b − a`), or `None` if
/// either is empty / unparseable.
#[must_use]
pub fn whole_days_between(a: &str, b: &str) -> Option<i64> {
    if a.trim().is_empty() || b.trim().is_empty() {
        return None;
    }
    let da = chrono::NaiveDate::parse_from_str(a.trim(), "%Y-%m-%d").ok()?;
    let db = chrono::NaiveDate::parse_from_str(b.trim(), "%Y-%m-%d").ok()?;
    Some((db - da).num_days())
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/// Axis A outcome-classification display label.
#[must_use]
pub fn outcome_classification_label(value: &str) -> String {
    match value {
        "fully-agreed" => "Fully agreed",
        "partially-agreed" => "Partially agreed",
        "alternative-offered" => "Alternative offered",
        "declined" => "Declined",
        "deferred" => "Deferred",
        _ => "Not graded",
    }
    .to_string()
}

/// Axis B legal-risk-band display label.
#[must_use]
pub fn legal_risk_band_label(value: &str) -> String {
    match value {
        "ok" => "OK",
        "caution" => "Caution",
        "high-risk" => "High risk",
        _ => "Not graded",
    }
    .to_string()
}

/// Axis D follow-up-urgency display label.
#[must_use]
pub fn follow_up_urgency_label(value: &str) -> String {
    match value {
        "none" => "None",
        "review-scheduled" => "Review scheduled",
        "urgent-review" => "Urgent review",
        "escalation-needed" => "Escalation needed",
        _ => "Not graded",
    }
    .to_string()
}

/// Overall-recommendation display label.
#[must_use]
pub fn recommendation_label(value: &str) -> String {
    match value {
        "implement" => "Implement the agreed adjustments",
        "schedule-review" => "Schedule a review",
        "seek-occupational-health" => "Seek an occupational-health assessment",
        "reconsider-decision" => "Reconsider the decision",
        "escalate-to-hr" => "Escalate to HR",
        _ => "No recommendation",
    }
    .to_string()
}

/// Human-readable response-status label.
#[must_use]
pub fn response_status_label(value: &str) -> String {
    match value {
        "draft" => "Draft",
        "agreed" => "Agreed",
        "partially-agreed" => "Partially agreed",
        "trial" => "Trial",
        "declined" => "Declined",
        "deferred" => "Deferred",
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
