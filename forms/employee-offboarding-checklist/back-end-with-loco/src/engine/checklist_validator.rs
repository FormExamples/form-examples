//! Checklist validator module.

use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, Blocker, FiredRule, ValidationResult};
use super::validation_rules::all_rules;

/// Pure validation function: validates an offboarding checklist.
///
/// Outcome rules:
///   - `incomplete` — at least one mandatory + blocker rule has fired.
///   - `partial`    — no mandatory blockers fired but at least one rule
///                    (mandatory or non-mandatory) is outstanding.
///   - `complete`   — every rule satisfied (no rule fired).
pub fn validate(data: &AssessmentData) -> ValidationResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut blockers: Vec<Blocker> = Vec::new();

    let mut mandatory_total: u32 = 0;
    let mut mandatory_satisfied: u32 = 0;
    let mut any_outstanding = false;
    let mut any_mandatory_blocker_outstanding = false;

    for rule in all_rules() {
        let outstanding = (rule.evaluate)(data);

        if rule.mandatory {
            mandatory_total += 1;
            if !outstanding {
                mandatory_satisfied += 1;
            }
        }

        if outstanding {
            any_outstanding = true;
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                mandatory: rule.mandatory,
                blocker: rule.blocker,
            });

            if rule.mandatory && rule.blocker {
                any_mandatory_blocker_outstanding = true;
                blockers.push(Blocker {
                    id: rule.id.to_string(),
                    category: rule.category.to_string(),
                    description: rule.description.to_string(),
                });
            }
        }
    }

    let outcome = if any_mandatory_blocker_outstanding {
        "incomplete".to_string()
    } else if any_outstanding {
        "partial".to_string()
    } else {
        "complete".to_string()
    };

    let completion_percent = if mandatory_total == 0 {
        100.0
    } else {
        let raw = (mandatory_satisfied as f64 / mandatory_total as f64) * 1000.0;
        raw.round() / 10.0
    };

    let additional_flags = detect_additional_flags(data);

    ValidationResult {
        outcome,
        completion_percent,
        blockers,
        fired_rules,
        additional_flags,
        mandatory_total,
        mandatory_satisfied,
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
                mandatory: rule.mandatory,
                blocker: rule.blocker,
            });
        }
    }
    out
}
