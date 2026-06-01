use super::flagged_issues::detect_additional_flags;
use super::ppe_rules::all_rules;
use super::types::{AssessmentData, Clearance, FiredRule, GradingResult};

/// Aggregate clearance from the firedRules list (highest grade wins).
///
///   any rule with grade 4  -> not-cleared
///   else any grade 3       -> pending
///   else any grade 2       -> conditional
///   else                   -> cleared
pub fn aggregate_clearance(fired_rules: &[FiredRule]) -> Clearance {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);
    match max_grade {
        g if g >= 4 => "not-cleared".to_string(),
        3 => "pending".to_string(),
        2 => "conditional".to_string(),
        _ => "cleared".to_string(),
    }
}

/// Evaluate every PPE rule against the data, returning the rules that fired
/// (sorted highest grade first).
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out: Vec<FiredRule> = Vec::new();
    for rule in all_rules() {
        if (rule.fires)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                grade: rule.grade,
            });
        }
    }
    // Sort highest grade first so the report reads worst-first.
    out.sort_by(|a, b| b.grade.cmp(&a.grade));
    out
}

/// Pure function: grades a Sports Medicine PPE assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);
    let clearance = aggregate_clearance(&fired_rules);
    let answered_count = super::utils::answered_count(data);

    GradingResult {
        clearance,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
