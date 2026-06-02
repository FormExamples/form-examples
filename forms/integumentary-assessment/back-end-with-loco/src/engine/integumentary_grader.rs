use super::flagged_issues::detect_additional_flags;
use super::rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::classify_braden_score;

/// Pure function: grades an integumentary assessment using the Braden Scale.
///
/// Returns a [`GradingResult`] containing:
/// - the Braden total score (6-23; defaults to 23 / "no-risk" if no
///   subscales have been answered, mirroring the reference engine)
/// - the derived risk level slug
/// - per-subscale audit trail (`fired_rules`)
/// - clinician-facing additional flags (urgent > high > medium > low)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut total_score: i32 = 0;
    let mut answered_count: i32 = 0;

    for rule in all_rules() {
        let score = (rule.evaluate)(data);
        if score > 0 {
            answered_count += 1;
            total_score += score;
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                score,
                max_score: rule.max_score,
            });
        }
    }

    let braden_score = if answered_count == 0 { 23 } else { total_score };
    let risk_level = classify_braden_score(braden_score);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        braden_score,
        risk_level,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
