//! WHO Emergency Unit (General) Form — top-level grader.
//!
//! Combines completeness validation (`eu_general_validator`) with
//! clinically significant flag detection (`flagged_issues`) and emits a
//! single `GradingResult` capturing the encounter status, completion
//! percentage, fired rules, and flagged issues.

use super::eu_general_validator::validate_eu_general;
use super::flagged_issues::detect_flagged_issues;
use super::types::{AssessmentData, FlagPriority, GradingResult};
use super::utils::case_abandoned;

/// Pure function: grades a WHO Emergency Unit (General) encounter.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let validation = validate_eu_general(data);
    let flagged_issues = detect_flagged_issues(data);

    let overall_percent = if validation.total_required == 0 {
        0
    } else {
        ((validation.total_satisfied as f64 / validation.total_required as f64) * 100.0).round()
            as u32
    };

    let encounter_status =
        derive_status(data, &validation, &flagged_issues, validation.total_satisfied);

    GradingResult {
        encounter_status,
        complete: validation.complete,
        total_required: validation.total_required,
        total_satisfied: validation.total_satisfied,
        overall_percent,
        sections: validation.sections,
        fired_rules: validation.missing,
        flagged_issues,
        timestamp,
    }
}

fn derive_status(
    data: &AssessmentData,
    validation: &crate::engine::types::ValidationResult,
    flagged: &[crate::engine::types::FlaggedIssue],
    answered: u32,
) -> String {
    if case_abandoned(data) {
        return "abandoned".to_string();
    }
    if validation.complete {
        let any_urgent_or_high = flagged
            .iter()
            .any(|f| f.priority == FlagPriority::Urgent || f.priority == FlagPriority::High);
        if any_urgent_or_high {
            "complete-with-concerns".to_string()
        } else {
            "complete".to_string()
        }
    } else if answered == 0 {
        "not-started".to_string()
    } else {
        "in-progress".to_string()
    }
}
