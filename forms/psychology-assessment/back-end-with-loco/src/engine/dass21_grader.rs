//! Dass21 grader module.

use super::dass21_rules::dass21_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, FiredRule, GradingResult, SubscaleScore};
use super::utils::{classify_dass_anxiety, classify_dass_depression, classify_dass_stress};

/// Pure function: grades a psychology-assessment case.
///
/// Sums each of the three DASS-21 subscales' seven 0..=3 item responses,
/// doubles the raw total to align with published DASS-42 normative cutoffs
/// (Lovibond & Lovibond, 1995), and assigns a severity category.
/// Unanswered items are treated as 0 in the sum but tracked separately.
/// Additionally raises clinician-facing safety flags (suicidal ideation,
/// severe+ subscales, functional impairment, support concerns).
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (depression, anxiety, stress, fired_rules) = calculate_dass21(data);
    let additional_flags = detect_additional_flags(data, &depression, &anxiety, &stress);

    GradingResult {
        depression,
        anxiety,
        stress,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every DASS-21 rule and roll up per-subscale scores.
pub fn calculate_dass21(
    data: &AssessmentData,
) -> (SubscaleScore, SubscaleScore, SubscaleScore, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut total_depression = 0_i32;
    let mut total_anxiety = 0_i32;
    let mut total_stress = 0_i32;
    let mut answered_depression = 0_i32;
    let mut answered_anxiety = 0_i32;
    let mut answered_stress = 0_i32;

    for rule in dass21_rules() {
        if let Some(value) = (rule.evaluate)(data) {
            match rule.subscale {
                "depression" => {
                    total_depression += value;
                    answered_depression += 1;
                }
                "anxiety" => {
                    total_anxiety += value;
                    answered_anxiety += 1;
                }
                "stress" => {
                    total_stress += value;
                    answered_stress += 1;
                }
                _ => {}
            }
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                subscale: rule.subscale.to_string(),
                item_number: rule.item_number,
                description: rule.description.to_string(),
                score: value,
            });
        }
    }

    let depression = SubscaleScore {
        raw: total_depression,
        scaled: total_depression * 2,
        severity: classify_dass_depression(total_depression * 2),
        answered: answered_depression,
    };
    let anxiety = SubscaleScore {
        raw: total_anxiety,
        scaled: total_anxiety * 2,
        severity: classify_dass_anxiety(total_anxiety * 2),
        answered: answered_anxiety,
    };
    let stress = SubscaleScore {
        raw: total_stress,
        scaled: total_stress * 2,
        severity: classify_dass_stress(total_stress * 2),
        answered: answered_stress,
    };

    (depression, anxiety, stress, fired_rules)
}
