//! Axis D — handling priority, plus the target timeframe.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/priority-rules.ts`. The
//! base tier follows the requested urgency; every firing rule raises the tier to
//! at least its level (max wins). If nothing escalates, the base tier stands and
//! `R-PRIORITY-REQUESTED` records the requested urgency.

use super::types::{FiredRule, NeurodiversityAdjustmentRequest};

/// The result of grading axis D.
pub struct Priority {
    /// The priority tier (`routine` / `soon` / `urgent`).
    pub priority_tier: String,
    /// The target timeframe implied by the tier.
    pub target_timeframe: String,
    /// The audit-trail rules that fired.
    pub fired_rules: Vec<FiredRule>,
}

fn tier_rank(tier: &str) -> u8 {
    match tier {
        "soon" => 1,
        "urgent" => 2,
        _ => 0,
    }
}

fn target_timeframe(tier: &str) -> &'static str {
    match tier {
        "urgent" => "Within 5 working days (act without unreasonable delay)",
        "soon" => "Within 10 working days",
        _ => "Within 20 working days",
    }
}

/// Grade axis D — handling priority plus the target timeframe. The requested
/// urgency sets the base tier; escalation rules can raise but never lower it.
#[must_use]
pub fn grade_priority(r: &NeurodiversityAdjustmentRequest) -> Priority {
    let base_tier = match r.urgency.as_str() {
        "routine" | "soon" | "urgent" => r.urgency.clone(),
        _ => "routine".to_string(),
    };

    // (target-tier, rule) pairs, evaluated in spec order.
    let mut candidates: Vec<(&str, FiredRule)> = Vec::new();

    if r.at_risk_of_absence {
        candidates.push((
            "urgent",
            FiredRule::new(
                "R-PRIORITY-ABSENCE-RISK",
                "priority",
                "absence-risk",
                "Absence / burnout risk — respond urgently and without unreasonable delay.",
            ),
        ));
    }
    if r.current_impact == "severe" {
        candidates.push((
            "urgent",
            FiredRule::new(
                "R-PRIORITY-SEVERE",
                "priority",
                "severe",
                "Severe impact — respond urgently.",
            ),
        ));
    }
    if r.current_impact == "high" {
        candidates.push((
            "soon",
            FiredRule::new(
                "R-PRIORITY-HIGH",
                "priority",
                "high",
                "High impact — respond soon.",
            ),
        ));
    }
    if r.difficulty_burnout_wellbeing {
        candidates.push((
            "soon",
            FiredRule::new(
                "R-PRIORITY-BURNOUT",
                "priority",
                "burnout",
                "Burnout difficulty — respond soon.",
            ),
        ));
    }

    if candidates.is_empty() {
        let tier = base_tier;
        let fired_rules = vec![FiredRule::new(
            "R-PRIORITY-REQUESTED",
            "priority",
            "requested",
            &format!("Priority follows the requested urgency ({tier})."),
        )];
        let timeframe = target_timeframe(&tier).to_string();
        return Priority {
            priority_tier: tier,
            target_timeframe: timeframe,
            fired_rules,
        };
    }

    let mut tier = base_tier;
    let mut fired_rules: Vec<FiredRule> = Vec::with_capacity(candidates.len());
    for (target, rule) in candidates {
        if tier_rank(target) > tier_rank(&tier) {
            tier = target.to_string();
        }
        fired_rules.push(rule);
    }

    let timeframe = target_timeframe(&tier).to_string();
    Priority {
        priority_tier: tier,
        target_timeframe: timeframe,
        fired_rules,
    }
}
