//! Shared predicates for the four-axis grading engine.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/utils.ts`.

use super::types::NeurodiversityAdjustmentRequest;

/// Whether any neurodivergent condition is recorded: any of the seven
/// `condition*` booleans is true, or a free-text "other" condition is supplied.
#[must_use]
pub fn any_condition(r: &NeurodiversityAdjustmentRequest) -> bool {
    r.condition_adhd
        || r.condition_autism
        || r.condition_dyslexia
        || r.condition_dyspraxia
        || r.condition_dyscalculia
        || r.condition_tourettes
        || r.condition_other
        || !r.condition_other_detail.trim().is_empty()
}

/// Whether any functional difficulty is recorded (any of the eight
/// `difficulty*` booleans is true).
#[must_use]
pub fn any_difficulty(r: &NeurodiversityAdjustmentRequest) -> bool {
    r.difficulty_concentration
        || r.difficulty_written_communication
        || r.difficulty_organisation_time
        || r.difficulty_sensory_overload
        || r.difficulty_balance_coordination
        || r.difficulty_social_communication
        || r.difficulty_memory
        || r.difficulty_burnout_wellbeing
}

/// Whether any adjustment category is requested (any of the eight
/// `adjustment*` booleans is true).
#[must_use]
pub fn any_adjustment(r: &NeurodiversityAdjustmentRequest) -> bool {
    r.adjustment_working_environment
        || r.adjustment_equipment_technology
        || r.adjustment_working_arrangements
        || r.adjustment_communication
        || r.adjustment_support_mentoring
        || r.adjustment_recruitment_process
        || r.adjustment_policy_dress
        || r.adjustment_other
}
