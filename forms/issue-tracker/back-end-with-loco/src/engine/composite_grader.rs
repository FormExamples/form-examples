//! Composite grader module.

use super::flagged_issues::compute_flags;
use super::scoring_rules::{
    grade_failure, grade_frequency, grade_harm, grade_magnitude, grade_moscow, grade_priority,
    grade_severity,
};
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::max_band;

/// Pure function: grade an issue using the max-grade algorithm. Returns
/// a [`GradingResult`] mirroring the TypeScript `gradeIssue` output:
/// the seven scores echo through, plus the composite band, fired rules,
/// and additional flags.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let s = &data.scores;
    let timestamp = chrono::Utc::now().to_rfc3339();

    let (priority_band, priority_rules) = grade_priority(s.score_by_priority_rank);
    let (severity_band, severity_rules) = grade_severity(s.score_by_severity_of_impact);
    let (magnitude_band, magnitude_rules) = grade_magnitude(s.score_by_magnitude_of_damage);
    let (harm_band, harm_rules) = grade_harm(s.score_by_harm_grade);
    let (failure_band, failure_rules) = grade_failure(&s.score_by_failure_condition);
    let (moscow_band, moscow_rules) = grade_moscow(s.score_by_moscow_requirement);
    let (frequency_band, frequency_rules) = grade_frequency(s.score_by_frequency_percent);

    let composite_band = max_band(&[
        &priority_band,
        &severity_band,
        &magnitude_band,
        &harm_band,
        &failure_band,
        &moscow_band,
        &frequency_band,
    ]);

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    fired_rules.extend(priority_rules);
    fired_rules.extend(severity_rules);
    fired_rules.extend(magnitude_rules);
    fired_rules.extend(harm_rules);
    fired_rules.extend(failure_rules);
    fired_rules.extend(moscow_rules);
    fired_rules.extend(frequency_rules);

    // Final composite "R-COMPOSITE-{BAND}" rule, matching the TS engine.
    fired_rules.push(FiredRule {
        rule_id: format!("R-COMPOSITE-{}", composite_band.to_uppercase()),
        instrument: "composite".to_string(),
        grade: composite_band.clone(),
        category: "composite".to_string(),
        description: format!(
            "Composite priority is {composite_band} \u{2014} the worst band across all seven instruments."
        ),
        band: composite_band.clone(),
    });

    let additional_flags = compute_flags(data);

    GradingResult {
        score_by_priority_rank: s.score_by_priority_rank,
        score_by_severity_of_impact: s.score_by_severity_of_impact,
        score_by_magnitude_of_damage: s.score_by_magnitude_of_damage,
        score_by_harm_grade: s.score_by_harm_grade,
        score_by_failure_condition: s.score_by_failure_condition.clone(),
        score_by_moscow_requirement: s.score_by_moscow_requirement,
        score_by_frequency_percent: s.score_by_frequency_percent,
        composite_priority: composite_band,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
