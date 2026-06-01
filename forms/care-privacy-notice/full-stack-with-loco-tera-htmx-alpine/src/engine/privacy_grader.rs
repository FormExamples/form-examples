use super::flagged_issues::detect_additional_flags;
use super::privacy_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, OverallStatus};

/// Pure function: grades a Care Privacy Notice acknowledgement.
///
/// Returns a [`GradingResult`] containing:
/// - overall status ("complete" / "incomplete") matching the JS engine
/// - fired rules (one per missing acknowledgement field)
/// - additional flags (practice configuration completeness alerts)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let overall_status: OverallStatus = if fired_rules.is_empty() {
        "complete".to_string()
    } else {
        "incomplete".to_string()
    };

    GradingResult {
        overall_status,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every rule against the data, returning the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                message: rule.message.to_string(),
            });
        }
    }
    out
}
