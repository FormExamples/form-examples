//! Substance grader module.

use super::flagged_issues::detect_additional_flags;
use super::substance_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, RiskLevel};
use super::utils::{
    audit_risk_category, calculate_audit_score, calculate_dast_score, dast_risk_category,
};

/// Pure function: evaluates all substance abuse rules against patient data
/// and returns AUDIT score, DAST score, overall risk level, fired rules,
/// and additional flags.
pub fn calculate_substance_grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);

    let audit_score = calculate_audit_score(&data.alcohol_use_audit);
    let audit_category = audit_risk_category(audit_score);

    let dast_score = calculate_dast_score(&data.drug_use_dast);
    let dast_category = dast_risk_category(dast_score);

    let overall_risk = derive_overall_risk(&fired_rules, audit_score, dast_score);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        audit_score,
        audit_risk_category: audit_category,
        dast_score,
        dast_risk_category: dast_category,
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
                grade: rule.grade,
            });
        }
    }
    out
}

/// Derive overall substance abuse risk from fired rules and scores.
fn derive_overall_risk(fired_rules: &[FiredRule], audit_score: i32, dast_score: i32) -> RiskLevel {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);
    if max_grade >= 4 || audit_score >= 20 || dast_score >= 9 {
        "critical".to_string()
    } else if max_grade >= 3 || audit_score >= 16 || dast_score >= 6 {
        "high".to_string()
    } else if max_grade >= 2 || audit_score >= 8 || dast_score >= 3 {
        "moderate".to_string()
    } else {
        "low".to_string()
    }
}
