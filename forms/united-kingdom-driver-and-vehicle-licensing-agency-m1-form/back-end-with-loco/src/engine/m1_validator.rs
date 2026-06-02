use super::flagged_issues::detect_additional_flags;
use super::m1_rules::all_rules;
use super::types::{AssessmentData, FiredRule, ValidationResult};
use super::utils::{count_conditions, priority_order};

/// Pure function: validates a DVLA M1 assessment.
///
/// Conditional logic ported 1:1 from the front-end:
/// - Q1 = No  -> form stops at Q1; Q2/Q3 rules are skipped and the result
///               carries `stopped_at_q1 = true`.
/// - Q1 = Yes -> all rules apply.
pub fn validate_m1(data: &AssessmentData) -> ValidationResult {
    let stopped_at_q1 = data.diagnosis_confirmation.has_mental_health_diagnosis == "no";

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    for rule in all_rules() {
        if stopped_at_q1 && (rule.id.starts_with("M1-Q2") || rule.id.starts_with("M1-Q3")) {
            continue;
        }
        if (rule.evaluate)(data) {
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                priority: rule.priority.to_string(),
                description: rule.description.to_string(),
                message: rule.message.to_string(),
            });
        }
    }

    fired_rules.sort_by_key(|r| priority_order(&r.priority));

    let additional_flags = detect_additional_flags(data);
    let condition_count = count_conditions(data);

    let complete = fired_rules
        .iter()
        .filter(|r| r.category == "completeness")
        .count()
        == 0;

    ValidationResult {
        complete,
        stopped_at_q1,
        fired_rules,
        additional_flags,
        condition_count,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}
