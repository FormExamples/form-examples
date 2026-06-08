//! Acknowledgment grader module.

use super::acknowledgment_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{
    AcknowledgmentProgress, AcknowledgmentStatus, AssessmentData, FiredRule, GradingResult,
};
use super::utils::{
    acknowledged_date_provided, confirmation_checked, full_name_provided,
};

/// Total acknowledgment items used for the completion percentage. The three
/// items are: the confirmation checkbox, the full-name field, and the
/// acknowledged-date field — exactly the three checks the front-end JS uses
/// to enable the submit button.
const ACKNOWLEDGMENT_TOTAL: u32 = 3;

/// Pure function: grades a Legal Requirements Privacy Notice acknowledgment.
///
/// Returns a [`GradingResult`] containing:
/// - overall acknowledgment status (`not-started` → `complete`)
/// - acknowledgment progress (answered / total)
/// - fired rules (one per missing required item)
/// - additional flags (real-time review alerts)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let answered = acknowledgment_answered(data);
    let percent = percent(answered, ACKNOWLEDGMENT_TOTAL);
    let progress = AcknowledgmentProgress {
        answered,
        total: ACKNOWLEDGMENT_TOTAL,
        percent,
    };

    let overall_percent = percent;
    let acknowledgment_status = derive_status(answered);

    GradingResult {
        acknowledgment_status,
        progress,
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

/// Count answered acknowledgment items.
fn acknowledgment_answered(d: &AssessmentData) -> u32 {
    let mut n = 0;
    if confirmation_checked(d) {
        n += 1;
    }
    if full_name_provided(d) {
        n += 1;
    }
    if acknowledged_date_provided(d) {
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

fn derive_status(answered: u32) -> AcknowledgmentStatus {
    if answered == ACKNOWLEDGMENT_TOTAL {
        "complete".to_string()
    } else if answered == 0 {
        "not-started".to_string()
    } else {
        "in-progress".to_string()
    }
}
