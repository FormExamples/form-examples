//! WHO Emergency Unit (General) Form rule-based completeness engine.
//!
//! Ported from the TypeScript engine in
//! `front-end-form-with-svelte/src/lib/engine/` and the JS engine in
//! `front-end-form-with-html/js/`. Rule IDs and flag IDs are preserved
//! verbatim.

pub mod eu_general_grader;
pub mod eu_general_rules;
pub mod eu_general_validator;
pub mod flagged_issues;
pub mod types;
pub mod utils;
