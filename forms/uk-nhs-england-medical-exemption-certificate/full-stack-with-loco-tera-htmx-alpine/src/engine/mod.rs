//! UK NHS England FP92A Medical Exemption Certificate eligibility engine.
//!
//! Pure Rust port of the FP92A grading engine. Evaluates the application
//! against the closed list of 10 NHSBSA-recognised qualifying conditions
//! and returns an `eligible | ineligible | requires-clarification` outcome
//! plus fired rules and advisory flags.

pub mod flagged_issues;
pub mod fp92a_rules;
pub mod fp92a_validator;
pub mod types;
