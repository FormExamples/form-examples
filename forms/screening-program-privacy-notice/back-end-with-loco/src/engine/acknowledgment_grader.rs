//! Acknowledgment grader module.

use super::acknowledgment_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{
    AcknowledgmentStatus, AdditionalFlag, AssessmentData, FiredRule, GradingResult,
};
use super::utils::{form_is_valid, has_acknowledged_date, has_full_name, is_confirmed};

/// Total number of required acknowledgment items (mirror of the front-end
/// `checkFormValidity` predicate: confirmed && fullName != '' && date != '').
const REQUIRED_TOTAL: u32 = 3;

/// Pure function: grades a Screening Program Privacy Notice acknowledgment.
///
/// Returns a [`GradingResult`] containing:
/// - overall acknowledgment status (`not-started` → `complete-with-concerns`)
/// - answered / total / overall percent
/// - fired rules (one per unanswered required item)
/// - additional flags (privacy / configuration alerts)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let answered = count_answered(data);
    let overall_percent = percent(answered, REQUIRED_TOTAL);
    let acknowledgment_status = derive_status(data, answered, &additional_flags);

    GradingResult {
        acknowledgment_status,
        answered,
        total: REQUIRED_TOTAL,
        overall_percent,
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
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                severity: rule.severity.to_string(),
            });
        }
    }
    out
}

/// Count the answered required items. Mirrors the JS `checkFormValidity`
/// logic but expressed per-field for per-item progress reporting.
fn count_answered(d: &AssessmentData) -> u32 {
    let mut n = 0;
    if is_confirmed(d) {
        n += 1;
    }
    if has_full_name(d) {
        n += 1;
    }
    if has_acknowledged_date(d) {
        n += 1;
    }
    n
}

fn percent(answered: u32, total: u32) -> u32 {
    if total == 0 {
        return 0;
    }
    ((answered as f64 / total as f64) * 100.0).round() as u32
}

fn derive_status(
    data: &AssessmentData,
    answered: u32,
    flags: &[AdditionalFlag],
) -> AcknowledgmentStatus {
    if answered == 0 {
        return "not-started".to_string();
    }
    if form_is_valid(data) {
        let any_high = flags.iter().any(|f| f.priority == "high");
        if any_high {
            "complete-with-concerns".to_string()
        } else {
            "complete".to_string()
        }
    } else {
        "in-progress".to_string()
    }
}
