//! Fertility grader module.

use super::fertility_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, ConcernLevel, FiredRule, GradingResult};

/// Classify a numeric concern score into a NICE CG156 concern level.
///
/// Cutoffs (mirroring `fertility-grader.js`):
///   0..=2  -> low concern
///   3..=6  -> moderate concern
///   >= 7   -> high concern
pub fn classify_concern_score(score: i32) -> ConcernLevel {
    if score >= 7 {
        "high".to_string()
    } else if score >= 3 {
        "moderate".to_string()
    } else {
        "low".to_string()
    }
}

/// Evaluate every rule against the data, returning the rules that fired
/// along with the total weighted concern score.
pub fn run_rules(data: &AssessmentData) -> (i32, Vec<FiredRule>) {
    let mut total: i32 = 0;
    let mut fired: Vec<FiredRule> = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            total += rule.weight;
            fired.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                score: rule.weight,
            });
        }
    }
    (total, fired)
}

/// Pure function: grades a NICE CG156 fertility assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (concern_score, fired_rules) = run_rules(data);
    let concern_level = classify_concern_score(concern_score);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        concern_score,
        concern_level,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
