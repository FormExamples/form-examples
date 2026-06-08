//! Kdigo grader module.

use super::flagged_issues::detect_additional_flags;
use super::kdigo_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::{
    kdigo_composite_risk, resolve_albuminuria_category, resolve_egfr, resolve_gfr_category,
};

/// Pure function: grades a renal assessment.
///
/// Returns a [`GradingResult`] containing:
/// - the resolved GFR category (G1-G5) and albuminuria category (A1-A3)
/// - composite KDIGO risk level (low / moderate / high / very-high / unknown)
/// - the underlying numeric eGFR and ACR values
/// - per-rule audit trail (`KDIGO-001` … `KDIGO-003`)
/// - real-time additional flags from the flagged-issues detector
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let gfr_category = resolve_gfr_category(data);
    let albuminuria_category = resolve_albuminuria_category(data);
    let risk_level = kdigo_composite_risk(&gfr_category, &albuminuria_category);
    let egfr = resolve_egfr(data);
    let acr = data.urine_tests.acr;

    GradingResult {
        gfr_category,
        albuminuria_category,
        risk_level,
        egfr,
        acr,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every KDIGO rule, returning those whose evaluator produced a
/// non-empty value.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        let value = (rule.evaluate)(data);
        if !value.is_empty() {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                value,
            });
        }
    }
    out
}
