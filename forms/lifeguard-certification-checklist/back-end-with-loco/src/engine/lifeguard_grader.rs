// Lifeguard Competency Verification grader. Pure functions: take an
// `AssessmentData` object, evaluate each declarative rule in the registry,
// and return the outcome plus the audit trail of fired rules.
//
// RLSS UK NPLQ outcome logic:
//   - Any critical-competency rule firing "no" -> overall Fail.
//   - With no critical failures, 0 deficiencies -> Pass.
//   - With no critical failures and 1-2 non-critical deficiencies ->
//     Needs Development.
//   - With no critical failures and >2 non-critical deficiencies ->
//     Needs Development (high-deficiency case surfaced as a flag for the
//     examiner to review).
//   - Items the examiner has not assessed ("na" or "") do not count as
//     deficiencies.

use super::flagged_issues::detect_additional_flags;
use super::rules::lifeguard_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, Outcome};

pub const DEFICIENCY_LIMIT_FOR_PASS: usize = 0;
pub const DEFICIENCY_LIMIT_FOR_NEEDS_DEVELOPMENT: usize = 2;

/// Evaluate every lifeguard rule in the registry, classify the outcome, and
/// return the full grading result.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let rules = lifeguard_rules();

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut critical_failures: Vec<FiredRule> = Vec::new();
    let mut deficiencies: Vec<FiredRule> = Vec::new();
    let mut answered_count: u32 = 0;

    for rule in &rules {
        let status = (rule.evaluate)(data);

        let entry = FiredRule {
            id: rule.id.to_string(),
            step: rule.step,
            category: rule.category.to_string(),
            description: rule.label.to_string(),
            critical: rule.critical,
            status: status.clone(),
        };
        fired_rules.push(entry.clone());

        if status == "yes" || status == "no" {
            answered_count += 1;
        }

        if status == "no" {
            if rule.critical {
                critical_failures.push(entry);
            } else {
                deficiencies.push(entry);
            }
        }
    }

    let outcome: Outcome = if !critical_failures.is_empty() {
        "fail".to_string()
    } else if answered_count == 0 {
        // Nothing assessed yet — surface a neutral "fail" on submission so the
        // examiner is prompted to actually mark items.
        "fail".to_string()
    } else if deficiencies.len() == DEFICIENCY_LIMIT_FOR_PASS {
        "pass".to_string()
    } else if deficiencies.len() <= DEFICIENCY_LIMIT_FOR_NEEDS_DEVELOPMENT {
        "needs-development".to_string()
    } else {
        "needs-development".to_string()
    };

    let additional_flags = detect_additional_flags(data, &critical_failures, &deficiencies);

    GradingResult {
        outcome,
        critical_failures,
        deficiencies,
        fired_rules,
        additional_flags,
        answered_count,
        total_rules: rules.len() as u32,
        timestamp,
    }
}
