//! Psychomotor grader module.

use super::flagged_issues::detect_additional_flags;
use super::rules::all_rules;
use super::types::{
    AssessmentData, FiredRule, GradingResult, Outcome, PASS_PERCENT_THRESHOLD,
};

/// Grade an EMT psychomotor assessment.
///
/// Logic mirrors the canonical JS engine (`psychomotor-grader.js`):
///   1. Any critical-criterion rule answered "no" → automatic Fail.
///   2. Otherwise, if no items have been answered → Fail (nothing assessed).
///   3. Otherwise, if percent < PASS_PERCENT_THRESHOLD → Fail.
///   4. Otherwise → Pass.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (fired_rules, critical_failures, points, max_points, answered_count, total_rules) =
        run_rules(data);

    let percent = if max_points > 0 {
        (points as f64 / max_points as f64) * 100.0
    } else {
        0.0
    };

    let outcome: Outcome = if !critical_failures.is_empty() {
        "fail".to_string()
    } else if answered_count == 0 {
        "fail".to_string()
    } else if percent < PASS_PERCENT_THRESHOLD {
        "fail".to_string()
    } else {
        "pass".to_string()
    };

    let grading_for_flags = GradingForFlags {
        critical_failures: critical_failures.clone(),
        fired_rules: fired_rules.clone(),
        percent,
        points,
        max_points,
    };
    let additional_flags = detect_additional_flags(data, &grading_for_flags);

    GradingResult {
        outcome,
        points,
        max_points,
        percent,
        critical_failures,
        fired_rules,
        additional_flags,
        answered_count,
        total_rules,
        timestamp,
    }
}

/// Compact bundle passed to the flag detector (subset of GradingResult).
pub struct GradingForFlags {
    /// Critical failures.
    pub critical_failures: Vec<FiredRule>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Percent.
    pub percent: f64,
    /// Points.
    pub points: u32,
    /// Max points.
    pub max_points: u32,
}

/// Evaluate every rule. Returns (firedRules, criticalFailures, points,
/// maxPoints, answeredCount, totalRules).
pub fn run_rules(
    data: &AssessmentData,
) -> (Vec<FiredRule>, Vec<FiredRule>, u32, u32, u32, u32) {
    let mut fired_rules = Vec::new();
    let mut critical_failures = Vec::new();
    let mut points: u32 = 0;
    let mut max_points: u32 = 0;
    let mut answered_count: u32 = 0;

    let rules = all_rules();
    let total_rules = rules.len() as u32;

    for rule in &rules {
        let status = (rule.evaluate)(data);
        let mut points_awarded: u32 = 0;

        match status.as_str() {
            "yes" => {
                points_awarded = rule.points;
                points += rule.points;
                max_points += rule.points;
                answered_count += 1;
            }
            "no" => {
                max_points += rule.points;
                answered_count += 1;
            }
            // "na" and "" excluded entirely.
            _ => {}
        }

        let entry = FiredRule {
            id: rule.id.to_string(),
            step: rule.step,
            category: rule.category.to_string(),
            description: rule.label.to_string(),
            critical: rule.critical,
            points: rule.points,
            status: status.clone(),
            points_awarded,
        };

        fired_rules.push(entry.clone());
        if status == "no" && rule.critical {
            critical_failures.push(entry);
        }
    }

    (
        fired_rules,
        critical_failures,
        points,
        max_points,
        answered_count,
        total_rules,
    )
}
