//! Axis B — impact / wellbeing risk.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/impact-rules.ts`. The band
//! escalates on the ladder `ok → caution → high-risk`; every firing rule raises
//! the band to at least its level (max wins) and all firing rules are collected.
//! The least-alarming band is chosen only when no rule fires.

use super::types::{FiredRule, NeurodiversityAdjustmentRequest};

/// The result of grading axis B.
pub struct Impact {
    /// The impact band (`ok` / `caution` / `high-risk`).
    pub impact_band: String,
    /// The audit-trail rules that fired.
    pub fired_rules: Vec<FiredRule>,
}

fn band_rank(band: &str) -> u8 {
    match band {
        "caution" => 1,
        "high-risk" => 2,
        _ => 0,
    }
}

/// Grade axis B — impact / wellbeing risk. Collect every firing rule and raise
/// the band to the highest level any of them implies.
#[must_use]
pub fn grade_impact(r: &NeurodiversityAdjustmentRequest) -> Impact {
    // (target-band, rule) pairs, evaluated in spec order.
    let mut candidates: Vec<(&str, FiredRule)> = Vec::new();

    if r.at_risk_of_absence {
        candidates.push((
            "high-risk",
            FiredRule::new(
                "R-IMPACT-ABSENCE-RISK",
                "impact",
                "absence-risk",
                "Worker at risk of sickness absence or burnout without adjustments — act promptly.",
            ),
        ));
    }
    if r.current_impact == "severe" {
        candidates.push((
            "high-risk",
            FiredRule::new(
                "R-IMPACT-SEVERE",
                "impact",
                "severe",
                "Severe current impact on work and wellbeing.",
            ),
        ));
    }
    if r.current_impact == "high" {
        candidates.push((
            "caution",
            FiredRule::new(
                "R-IMPACT-HIGH",
                "impact",
                "high",
                "High current impact on work and wellbeing.",
            ),
        ));
    }
    if r.difficulty_burnout_wellbeing {
        candidates.push((
            "caution",
            FiredRule::new(
                "R-IMPACT-BURNOUT",
                "impact",
                "burnout",
                "Fatigue / burnout difficulty reported.",
            ),
        ));
    }
    if r.current_impact == "moderate" {
        candidates.push((
            "caution",
            FiredRule::new(
                "R-IMPACT-MODERATE",
                "impact",
                "moderate",
                "Moderate current impact on work and wellbeing.",
            ),
        ));
    }

    if candidates.is_empty() {
        return Impact {
            impact_band: "ok".to_string(),
            fired_rules: vec![FiredRule::new(
                "R-IMPACT-OK",
                "impact",
                "ok",
                "No wellbeing risk detected from the impact screen.",
            )],
        };
    }

    let mut band = "ok".to_string();
    let mut fired_rules: Vec<FiredRule> = Vec::with_capacity(candidates.len());
    for (target, rule) in candidates {
        if band_rank(target) > band_rank(&band) {
            band = target.to_string();
        }
        fired_rules.push(rule);
    }

    Impact {
        impact_band: band,
        fired_rules,
    }
}
