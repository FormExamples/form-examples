//! Donation grader module.

use super::donation_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, Eligibility, FiredRule, GradingResult, RiskLevel};

/// Pure function: grades an Organ Donation Assessment.
///
/// Returns a [`GradingResult`] containing:
/// - `eligibility` — assessor decision (if recorded) or engine-suggested decision
/// - `risk_level` — engine-derived risk classification
/// - `suggested_eligibility` — engine-derived suitability
/// - fired rules (one per matched donor rule)
/// - additional flags (real-time safety alerts)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = evaluate_rules(data);
    let additional_flags = detect_additional_flags(data);

    let (eligibility, risk_level, suggested_eligibility) =
        classify_eligibility(&fired_rules, data);

    GradingResult {
        eligibility,
        risk_level,
        suggested_eligibility,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every donor rule against the data, returning the fired rules.
pub fn evaluate_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut fired = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            fired.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                grade: rule.grade,
            });
        }
    }
    fired
}

/// Classify eligibility + risk from fired rules and the recorded decision.
///
/// Any single Grade-4 finding (other than the "ideal donor" Grade-1 markers
/// such as SU-001) → unsuitable / critical.
/// Any Grade-3 finding → conditionally-suitable / high.
/// Any Grade-2 finding → conditionally-suitable / moderate.
/// Otherwise → suitable / low.
///
/// When the assessor explicitly recorded an eligibility decision in step 10
/// it wins for the displayed eligibility, but the engine-derived risk level
/// is preserved.
pub fn classify_eligibility(
    fired_rules: &[FiredRule],
    data: &AssessmentData,
) -> (Eligibility, RiskLevel, Eligibility) {
    // Ignore the explicit "ideal donor" Grade-1 markers when counting penalties.
    let positive_ideal_ids = ["SU-001"];

    let flagged: Vec<&FiredRule> = fired_rules
        .iter()
        .filter(|r| !positive_ideal_ids.contains(&r.id.as_str()))
        .collect();

    let grade4 = flagged.iter().filter(|r| r.grade == 4).count();
    let grade3 = flagged.iter().filter(|r| r.grade == 3).count();
    let grade2 = flagged.iter().filter(|r| r.grade == 2).count();

    let (suggested_eligibility, risk_level): (&str, &str) = if grade4 > 0 {
        ("unsuitable", "critical")
    } else if grade3 > 0 {
        ("conditionally-suitable", "high")
    } else if grade2 > 0 {
        ("conditionally-suitable", "moderate")
    } else {
        ("suitable", "low")
    };

    let assessor_decision = &data.eligibility_allocation.eligibility_decision;
    let eligibility = if assessor_decision.is_empty() {
        suggested_eligibility.to_string()
    } else {
        assessor_decision.clone()
    };

    (
        eligibility,
        risk_level.to_string(),
        suggested_eligibility.to_string(),
    )
}

/// Backwards-compat helper for tests.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    evaluate_rules(data)
}
