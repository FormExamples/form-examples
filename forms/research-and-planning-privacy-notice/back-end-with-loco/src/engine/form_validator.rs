use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::{completeness_percent, validation_status};
use super::validation_rules::all_rules;

/// Pure function: grade the research-and-planning privacy notice
/// acknowledgement record. Mirrors `validateForm` in the JS / Svelte
/// engine 1:1, plus appends the additional information-governance flags
/// and a timestamp so the persisted grading blob is self-contained.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let fired_rules = run_rules(data);
    let total_required = all_rules().len() as u32;
    let completed_count = total_required - fired_rules.len() as u32;
    let completeness = completeness_percent(completed_count, total_required);
    let status = validation_status(completeness);
    let additional_flags = detect_additional_flags(data);
    GradingResult {
        completeness_percent: completeness,
        status,
        fired_rules,
        additional_flags,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}

/// Evaluate every required-field rule, returning the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.is_empty)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                section: rule.section.to_string(),
                description: rule.message.to_string(),
                field: rule.field.to_string(),
            });
        }
    }
    out
}
