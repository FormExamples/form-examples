//! Prescription grader module.

use super::flagged_issues::detect_additional_flags;
use super::prescription_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, PriorityLevel};

/// Priority ranking. Higher values dominate when multiple rules fire.
fn priority_order(level: &str) -> u8 {
    match level {
        "routine" => 0,
        "urgent" => 1,
        "emergency" => 2,
        _ => 0,
    }
}

/// Run every rule against the data and return the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                priority_level: rule.priority_level.to_string(),
            });
        }
    }
    out
}

/// Pure function: evaluate all prescription rules and return the maximum
/// priority level among the rules that fired (default `routine`).
pub fn calculate_priority_level(data: &AssessmentData) -> (PriorityLevel, Vec<FiredRule>) {
    let fired = run_rules(data);
    let mut level: PriorityLevel = "routine".to_string();
    for r in &fired {
        if priority_order(&r.priority_level) > priority_order(&level) {
            level = r.priority_level.clone();
        }
    }
    (level, fired)
}

/// Grade a prescription request: priority level, fired rules, additional
/// flags, plus an RFC-3339 timestamp.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let (priority_level, fired_rules) = calculate_priority_level(data);
    let additional_flags = detect_additional_flags(data);
    GradingResult {
        priority_level,
        fired_rules,
        additional_flags,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}
