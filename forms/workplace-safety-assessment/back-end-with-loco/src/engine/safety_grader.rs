//! Safety grader module.

// Workplace Safety Assessment grader. Pure functions: take an
// `AssessmentData` object, return the overall outcome, the per-category
// findings tally, the list of rules that fired, and the additional flags.
//
// Outcome rules:
//   any rule fired at grade 4         -> 'critical'
//   any rule fired at grade 3 (no 4s) -> 'major'
//   any rule fired at grade 2 (no 3-4) -> 'minor'
//   only grade-1 rules                -> 'compliant'
//
// Rules that score 0 are unanswered and excluded entirely from the grading
// totals (so a partially-completed audit doesn't auto-fail).

use std::collections::BTreeMap;

use super::flagged_issues::detect_additional_flags;
use super::rules::all_rules;
use super::types::{
    AssessmentData, CategoryFindings, FiredRule, GradingResult, Outcome, SeverityGrade,
};
use super::utils::grade_to_finding_level;

/// Determine the worst outcome from a set of fired rules.
pub fn highest_outcome(fired_rules: &[FiredRule]) -> Outcome {
    let mut worst: SeverityGrade = 1;
    for r in fired_rules {
        if r.grade > worst {
            worst = r.grade;
        }
    }
    grade_to_finding_level(worst)
}

/// Pure function: grades a Workplace Safety Assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut findings_by_category: BTreeMap<String, CategoryFindings> = BTreeMap::new();
    let mut answered_count: u32 = 0;

    for rule in all_rules() {
        let grade_val = (rule.evaluate)(data);
        if grade_val == 0 {
            continue; // unanswered
        }
        answered_count += 1;

        fired_rules.push(FiredRule {
            id: rule.id.to_string(),
            category: rule.category.to_string(),
            description: rule.description.to_string(),
            grade: grade_val,
        });

        let bucket = findings_by_category
            .entry(rule.category.to_string())
            .or_insert_with(|| CategoryFindings {
                category: rule.category.to_string(),
                ..CategoryFindings::default()
            });
        bucket.total += 1;
        match grade_val {
            4 => bucket.critical += 1,
            3 => bucket.major += 1,
            2 => bucket.minor += 1,
            _ => bucket.compliant += 1,
        }
    }

    let outcome = if answered_count == 0 {
        "compliant".to_string()
    } else {
        highest_outcome(&fired_rules)
    };

    let additional_flags = detect_additional_flags(data);

    GradingResult {
        outcome,
        findings_by_category,
        fired_rules,
        additional_flags,
        answered_count,
        timestamp,
    }
}
