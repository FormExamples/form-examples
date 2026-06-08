//! Mec grader module.

use super::flagged_issues::detect_additional_flags;
use super::mec_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, MethodMEC};

/// Pure function: grades a birth-control assessment against the UK MEC rules.
///
/// Returns a [`GradingResult`] containing:
/// - per-method MEC categories (worst category wins),
/// - overall risk level derived from the worst MEC category,
/// - the rules that fired,
/// - additional flagged issues independent of MEC classification.
pub fn calculate_mec_grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let method_mec = derive_method_mec(&fired_rules);
    let overall_risk = derive_overall_risk(&method_mec);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        method_mec,
        overall_risk,
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
                mec_category: rule.mec_category,
                affected_methods: rule
                    .affected_methods
                    .iter()
                    .map(|s| s.to_string())
                    .collect(),
            });
        }
    }
    out
}

/// Derive per-method MEC categories from fired rules (worst wins).
fn derive_method_mec(fired_rules: &[FiredRule]) -> MethodMEC {
    let mut result = MethodMEC::default();
    let methods = ["coc", "pop", "implant", "injection", "iud", "ius"];

    for rule in fired_rules {
        for method in &methods {
            if rule.affected_methods.iter().any(|m| m == method) {
                let current = match *method {
                    "coc" => &mut result.coc,
                    "pop" => &mut result.pop,
                    "implant" => &mut result.implant,
                    "injection" => &mut result.injection,
                    "iud" => &mut result.iud,
                    "ius" => &mut result.ius,
                    _ => continue,
                };
                if rule.mec_category > *current {
                    *current = rule.mec_category;
                }
            }
        }
    }
    result
}

/// Derive overall risk level from worst MEC category across all methods.
fn derive_overall_risk(method_mec: &MethodMEC) -> String {
    let worst = [
        method_mec.coc,
        method_mec.pop,
        method_mec.implant,
        method_mec.injection,
        method_mec.iud,
        method_mec.ius,
    ]
    .into_iter()
    .max()
    .unwrap_or(1);

    match worst {
        n if n >= 4 => "critical".to_string(),
        3 => "high".to_string(),
        2 => "moderate".to_string(),
        _ => "low".to_string(),
    }
}
