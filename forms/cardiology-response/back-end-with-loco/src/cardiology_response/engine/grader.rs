//! Pure four-axis interpretation engine for a cardiology response.
//!
//! Computes:
//! - Axis A: response classification (no-abnormality / cardiac-condition /
//!   critical / inconclusive).
//! - Axis B: condition severity + structured-finding category.
//! - Axis C: response completeness percent (0–100).
//! - Axis D: follow-up urgency + target timeframe + recommended action.
//!
//! Plus an overall recommendation, the fired-rule audit trail, and safety flags.
//!
//! Invariant: a critical result auto-escalates Axis D to critical-alert and
//! raises the critical-finding flag, regardless of the other axes. The
//! least-urgent band is only chosen when no rule fires. No side effects.

use super::classification_rules::classify_response;
use super::completeness_rules::grade_completeness;
use super::flagged_issues::detect_flags;
use super::follow_up_rules::grade_follow_up;
use super::severity_rules::grade_severity;
use super::types::{CardiologyResponse, FiredRule, GradingResult, Recommendation};

/// Grade a full cardiology response. Pure function — no side effects.
#[must_use]
pub fn calculate_grade(response: &CardiologyResponse) -> GradingResult {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // Axis A
    let (response_classification, a_rules) = classify_response(response);
    fired_rules.extend(a_rules);

    // Axis B
    let (severity, severity_category, b_rules) =
        grade_severity(response, &response_classification);
    fired_rules.extend(b_rules);

    // Axis C
    let (completeness_percent, c_rules) = grade_completeness(response);
    fired_rules.extend(c_rules);

    // Axis D
    let d = grade_follow_up(response, &response_classification, &severity);
    fired_rules.extend(d.fired_rules);

    let recommendation =
        derive_recommendation(&response_classification, &severity, &d.follow_up_urgency);

    let flags = detect_flags(response);

    GradingResult {
        response_classification,
        severity,
        severity_category,
        completeness_percent,
        follow_up_urgency: d.follow_up_urgency,
        target_timeframe: d.target_timeframe,
        recommended_action: d.recommended_action,
        recommendation,
        fired_rules,
        flags,
        graded_at: chrono::Utc::now().to_rfc3339(),
    }
}

/// Derives the overall recommendation from the graded axes.
fn derive_recommendation(
    classification: &str,
    severity: &str,
    urgency: &str,
) -> Recommendation {
    if urgency == "critical-alert" {
        return "urgent-review".to_string();
    }
    if severity == "major" {
        return "specialist-management".to_string();
    }
    if classification == "inconclusive" {
        return "further-investigation".to_string();
    }
    if severity == "moderate" {
        return "further-investigation".to_string();
    }
    if severity == "minor" {
        return "routine-follow-up".to_string();
    }
    if classification == "no-abnormality" {
        return "no-action".to_string();
    }
    "routine-follow-up".to_string()
}
