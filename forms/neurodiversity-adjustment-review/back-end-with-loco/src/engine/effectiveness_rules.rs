//! Axis A — overall effectiveness of the adjustments in place.
//!
//! Classifies the per-category effectiveness mix. Exactly one rule fires (first
//! match wins):
//! - `not-yet-assessed`: no adjustment in place has been rated.
//! - `effective`: every rated adjustment is working well.
//! - `ineffective`: no adjustment is working well and at least one is not working.
//! - `partially-effective`: a mix of working and not-fully-working adjustments.
//!
//! Rule IDs are stable and identical across every front-end and the back-end.

use super::types::{EffectivenessBand, FiredRule, NeurodiversityAdjustmentReview};
use super::utils::{any_not_working, rated_count, rated_values, working_well_count};

/// Grade the effectiveness band, returning the band plus the fired rule.
#[must_use]
pub fn grade_effectiveness(
    r: &NeurodiversityAdjustmentReview,
) -> (EffectivenessBand, Vec<FiredRule>) {
    let (band, rule_id, description) = if rated_count(r) == 0 {
        (
            "not-yet-assessed",
            "R-EFFECT-NOT-ASSESSED",
            "No adjustments in place have been rated yet.",
        )
    } else if rated_values(r).into_iter().all(|v| v == "working-well") {
        (
            "effective",
            "R-EFFECT-EFFECTIVE",
            "All rated adjustments are working well.",
        )
    } else if working_well_count(r) == 0 && any_not_working(r) {
        (
            "ineffective",
            "R-EFFECT-INEFFECTIVE",
            "No adjustment is working well and at least one is not working.",
        )
    } else {
        (
            "partially-effective",
            "R-EFFECT-PARTIAL",
            "A mix of working and not-fully-working adjustments.",
        )
    };

    let fired_rules = vec![FiredRule {
        rule_id: rule_id.to_string(),
        axis: "effectiveness".to_string(),
        category: band.to_string(),
        description: description.to_string(),
    }];

    (band.to_string(), fired_rules)
}
