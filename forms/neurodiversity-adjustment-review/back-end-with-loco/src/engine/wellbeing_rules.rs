//! Axis B — wellbeing risk.
//!
//! Risk ladder `ok < caution < high-risk`. Every rule whose condition holds is
//! collected into the audit trail; the band is the highest-ranked one among the
//! rules that fired. If no rule fires, the review is `ok` and `R-WELL-OK` is
//! emitted.
//!
//! An escalation, declining wellbeing, or a dissatisfied worker drives
//! `high-risk`; a not-working adjustment, partial satisfaction, or remaining
//! barriers drive `caution`.

use super::types::{FiredRule, NeurodiversityAdjustmentReview, WellbeingRiskBand};
use super::utils::any_not_working;

fn band_rank(band: &str) -> u8 {
    match band {
        "high-risk" => 2,
        "caution" => 1,
        _ => 0,
    }
}

/// Grade the wellbeing-risk band, returning the band plus every rule that fired.
#[must_use]
pub fn grade_wellbeing(
    r: &NeurodiversityAdjustmentReview,
) -> (WellbeingRiskBand, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut band = "ok".to_string();

    let mut fire =
        |rule_band: &str, rule_id: &str, category: &str, description: &str| {
            if band_rank(rule_band) > band_rank(&band) {
                band = rule_band.to_string();
            }
            fired_rules.push(FiredRule {
                rule_id: rule_id.to_string(),
                axis: "wellbeing".to_string(),
                category: category.to_string(),
                description: description.to_string(),
            });
        };

    if r.escalated {
        fire(
            "high-risk",
            "R-WELL-ESCALATED",
            "escalated",
            "Matter escalated.",
        );
    }
    if r.wellbeing_change == "worse" {
        fire(
            "high-risk",
            "R-WELL-DECLINED",
            "wellbeing-declined",
            "Worker's wellbeing has worsened since the adjustments.",
        );
    }
    if r.worker_satisfied == "no" {
        fire(
            "high-risk",
            "R-WELL-DISSATISFIED",
            "dissatisfied",
            "Worker is not satisfied the adjustments meet their needs.",
        );
    }
    if any_not_working(r) {
        fire(
            "caution",
            "R-WELL-NOT-WORKING",
            "not-working",
            "At least one adjustment is not working.",
        );
    }
    if r.worker_satisfied == "partially" {
        fire(
            "caution",
            "R-WELL-PARTIAL-SATISFACTION",
            "partial-satisfaction",
            "Worker is only partially satisfied.",
        );
    }
    if !r.barriers_detail.trim().is_empty() {
        fire(
            "caution",
            "R-WELL-BARRIERS",
            "barriers",
            "Remaining barriers reported.",
        );
    }

    if fired_rules.is_empty() {
        fired_rules.push(FiredRule {
            rule_id: "R-WELL-OK".to_string(),
            axis: "wellbeing".to_string(),
            category: "ok".to_string(),
            description: "No wellbeing risk detected from the review.".to_string(),
        });
    }

    (band, fired_rules)
}
