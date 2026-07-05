//! The composite four-axis grading engine.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/grader.ts`. Pure: no side
//! effects, no network calls, no I/O.

use chrono::Utc;

use super::completeness_rules::grade_completeness;
use super::eligibility_rules::grade_eligibility;
use super::flagged_issues::detect_flags;
use super::impact_rules::grade_impact;
use super::priority_rules::grade_priority;
use super::types::{FiredRule, GradingResult, NeurodiversityAdjustmentRequest};

/// Compute the four-axis grade for a neurodiversity reasonable-adjustments
/// request.
///
/// Axis A: Equality Act 2010 eligibility; Axis B: impact / wellbeing risk;
/// Axis C: request completeness percent; Axis D: handling priority + target
/// timeframe. Plus an overall recommendation, the fired-rule audit trail (in
/// firing order), and compliance / wellbeing flags.
///
/// Invariant: a worker at risk of sickness absence or burnout, or reporting
/// severe current impact, drives the impact axis and auto-escalates the priority
/// tier. The least-alarming band is only chosen when no rule fires.
#[must_use]
pub fn calculate_grade(request: &NeurodiversityAdjustmentRequest) -> GradingResult {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // Axis A — eligibility.
    let a = grade_eligibility(request);
    fired_rules.extend(a.fired_rules);

    // Axis B — impact / wellbeing.
    let b = grade_impact(request);
    fired_rules.extend(b.fired_rules);

    // Axis C — completeness.
    let c = grade_completeness(request);
    fired_rules.extend(c.fired_rules);

    // Axis D — priority.
    let d = grade_priority(request);
    fired_rules.extend(d.fired_rules);

    let recommendation = derive_recommendation(request, &b.impact_band, c.completeness_percent);
    let recommendation_label = recommendation_label(&recommendation).to_string();

    let flags = detect_flags(request, &a.eligibility_band, &b.impact_band);

    GradingResult {
        eligibility_band: a.eligibility_band,
        impact_band: b.impact_band,
        completeness_percent: c.completeness_percent,
        priority_tier: d.priority_tier,
        target_timeframe: d.target_timeframe,
        recommendation,
        recommendation_label,
        fired_rules,
        flags,
        graded_at: Utc::now().to_rfc3339(),
    }
}

/// Derive the overall handling recommendation from the request and graded axes.
///
/// First match wins:
/// 1. materially incomplete → request more detail from the worker;
/// 2. high wellbeing risk without occupational-health input → seek OH;
/// 3. an equipment / technology adjustment without Access to Work → signpost it;
/// 4. otherwise → progress to an adjustments meeting.
#[must_use]
pub fn derive_recommendation(
    request: &NeurodiversityAdjustmentRequest,
    impact_band: &str,
    completeness_percent: i32,
) -> String {
    if completeness_percent < 50 {
        return "request-more-detail".to_string();
    }
    if impact_band == "high-risk" && !request.occupational_health_involved {
        return "seek-occupational-health".to_string();
    }
    if request.adjustment_equipment_technology && !request.access_to_work_involved {
        return "signpost-access-to-work".to_string();
    }
    "progress-to-meeting".to_string()
}

/// The human-readable label for a recommendation enum value.
#[must_use]
pub fn recommendation_label(recommendation: &str) -> &'static str {
    match recommendation {
        "seek-occupational-health" => "Seek an occupational-health assessment",
        "request-more-detail" => "Request more detail from the worker",
        "signpost-access-to-work" => "Signpost the Access to Work scheme",
        _ => "Progress to an adjustments meeting",
    }
}
