//! Four-axis neurodiversity reasonable-adjustments grading engine (pure,
//! side-effect-free).
//!
//! Ported one-to-one from `front-end-with-svelte/src/lib/engine/`. Rule IDs,
//! flag IDs, axis names, bands, thresholds, and firing order are identical
//! across every front-end and this back-end.

pub mod completeness_rules;
pub mod eligibility_rules;
pub mod flagged_issues;
pub mod grader;
pub mod impact_rules;
pub mod priority_rules;
pub mod types;
pub mod utils;

pub use grader::calculate_grade;
pub use types::{FiredRule, Flag, GradingResult, NeurodiversityAdjustmentRequest};
