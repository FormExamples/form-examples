use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, FiredRule, GradingResult, ValidationStatus};
use super::utils::{completeness_percent, validation_status};
use super::validation_rules::{field_is_empty, validation_rules};

/// Pure function: grade a Code of Conduct Notice acknowledgement.
///
/// Returns a [`GradingResult`] containing:
/// - overall completeness percentage
/// - overall validation status (`Complete` / `Incomplete`)
/// - fired rules (one per unmet required field)
/// - additional flags (compliance-officer-facing alerts)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let total_required = validation_rules().len() as u32;
    let completed_count = total_required - (fired_rules.len() as u32);
    let pct = completeness_percent(completed_count, total_required);
    let status = validation_status(pct);

    GradingResult {
        completeness_percent: pct,
        status,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every validation rule against the data, returning the rules
/// that fired (i.e. the required field is unmet).
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in validation_rules() {
        if field_is_empty(data, rule.section, rule.field) {
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

/// Convenience: return only the overall validation status (Complete / Incomplete).
pub fn overall_status(data: &AssessmentData) -> ValidationStatus {
    grade(data).status
}
