//! Ips validator module.

use super::flagged_issues::detect_additional_flags;
use super::types::{
    AssessmentData, CompletenessLevel, FiredRule, GradingResult,
};
use super::validation_rules::all_rules;

/// Classify the overall IPS completeness given populated / total counts.
///
/// - All mandatory + all optional populated -> `complete`
/// - All mandatory populated, optional missing -> `partial`
/// - Any 1 mandatory missing -> `incomplete`
pub fn classify_completeness(
    mandatory_populated: u32,
    mandatory_total: u32,
    optional_populated: u32,
    optional_total: u32,
) -> CompletenessLevel {
    if mandatory_populated < mandatory_total {
        return "incomplete".to_string();
    }
    if optional_populated < optional_total {
        return "partial".to_string();
    }
    "complete".to_string()
}

/// Friendly label for a completeness level.
pub fn completeness_level_label(level: &str) -> String {
    match level {
        "complete" => "Complete".to_string(),
        "partial" => "Partial".to_string(),
        "incomplete" => "Incomplete".to_string(),
        _ => String::new(),
    }
}

/// Pure function: evaluate the IPS completeness rules against the supplied
/// data and produce the completeness level plus per-section audit trail
/// and clinician-facing flags.
pub fn validate(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut mandatory_populated: u32 = 0;
    let mut mandatory_total: u32 = 0;
    let mut optional_populated: u32 = 0;
    let mut optional_total: u32 = 0;

    for rule in all_rules() {
        let mut outcome = (rule.evaluate)(data).to_string();
        if rule.mandatory {
            mandatory_total += 1;
            if outcome == "ok" {
                mandatory_populated += 1;
            }
        } else {
            optional_total += 1;
            if outcome == "ok" {
                optional_populated += 1;
            }
            // Optional sections surface as "optional" when empty so they
            // read as informational rather than blocking failures.
            if outcome == "empty" {
                outcome = "optional".to_string();
            }
        }
        fired_rules.push(FiredRule {
            id: rule.id.to_string(),
            category: rule.category.to_string(),
            description: rule.description.to_string(),
            status: outcome,
            mandatory: rule.mandatory,
        });
    }

    let completeness_level = classify_completeness(
        mandatory_populated,
        mandatory_total,
        optional_populated,
        optional_total,
    );
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        completeness_level,
        mandatory_populated,
        mandatory_total,
        optional_populated,
        optional_total,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
