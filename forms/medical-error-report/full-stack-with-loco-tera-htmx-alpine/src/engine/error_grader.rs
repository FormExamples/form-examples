use super::error_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, FiredRule, GradingResult, RiskLevel};

/// Pure function: grades a medical-error-report case.
///
/// Returns a [`GradingResult`] containing:
/// - WHO severity (from reporter input)
/// - NCC MERP category (from reporter input)
/// - overall risk level (derived from worst fired-rule grade + WHO + MERP)
/// - fired grading rules
/// - additional safety / governance flags
pub fn calculate_error_grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let who_severity = data.error_classification.who_severity.clone();
    let ncc_merp_category = data.error_classification.ncc_merp_category.clone();
    let overall_risk = derive_overall_risk(&fired_rules, &who_severity, &ncc_merp_category);

    GradingResult {
        who_severity,
        ncc_merp_category,
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

/// Derive overall risk level from the worst fired-rule grade combined with
/// reporter-supplied WHO severity and NCC MERP category.
fn derive_overall_risk(
    fired_rules: &[FiredRule],
    who_severity: &str,
    ncc_merp_category: &str,
) -> RiskLevel {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);

    let who_level = match who_severity {
        "near-miss" => 1,
        "mild" => 2,
        "moderate" => 3,
        "severe" => 4,
        "critical" => 5,
        _ => 0,
    };

    let merp_level = match ncc_merp_category {
        "A" | "B" | "C" => 1,
        "D" => 2,
        "E" | "F" => 3,
        "G" => 4,
        "H" | "I" => 5,
        _ => 0,
    };

    let effective_max = max_grade.max(who_level).max(merp_level);

    if effective_max >= 5 {
        "critical".to_string()
    } else if effective_max >= 4 {
        "high".to_string()
    } else if effective_max >= 3 {
        "moderate".to_string()
    } else {
        "low".to_string()
    }
}
