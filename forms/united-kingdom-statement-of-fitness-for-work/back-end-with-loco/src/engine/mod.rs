//! UK Statement of Fitness for Work (Med 3 / fit note) grading engine.
//!
//! Ported from `front-end-form-with-html/js/grader.js`. Rule IDs and flag
//! IDs are identical to the canonical JavaScript source so the grader
//! output is interoperable across implementations.

pub mod adaptation_rules;
pub mod grader;
pub mod period_rules;
pub mod safety_flag_rules;
pub mod types;
pub mod utils;
pub mod validity_rules;

pub use grader::grade_fit_note;
pub use types::{AssessmentData, Grade};
