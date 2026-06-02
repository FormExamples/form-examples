use super::bls_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, FiredRule, GradingResult, Outcome};
use super::utils::NON_CRITICAL_DEFICIENCY_LIMIT;

/// Pure function: grades a BLS Skills Verification case per AHA pass/fail logic.
///
/// - Any critical-action rule firing `'no'` -> overall Fail.
/// - More than two non-critical `'no'` deficiencies -> Fail.
/// - Nothing assessed yet -> Fail (so examiner is prompted to actually mark items).
/// - Otherwise -> Pass.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let rules = all_rules();
    let total_rules = rules.len() as u32;

    let mut fired_rules: Vec<FiredRule> = Vec::with_capacity(rules.len());
    let mut critical_failures: Vec<FiredRule> = Vec::new();
    let mut non_critical_deficiencies: Vec<FiredRule> = Vec::new();
    let mut answered_count: u32 = 0;

    for rule in rules {
        let status = (rule.evaluate)(data);
        let entry = FiredRule {
            id: rule.id.to_string(),
            step: rule.step,
            category: rule.category.to_string(),
            description: rule.label.to_string(),
            critical: rule.critical,
            status: status.clone(),
        };
        if status == "yes" || status == "no" {
            answered_count += 1;
        }
        if status == "no" {
            if rule.critical {
                critical_failures.push(entry.clone());
            } else {
                non_critical_deficiencies.push(entry.clone());
            }
        }
        fired_rules.push(entry);
    }

    let outcome: Outcome = if !critical_failures.is_empty() {
        "fail".to_string()
    } else if non_critical_deficiencies.len() > NON_CRITICAL_DEFICIENCY_LIMIT {
        "fail".to_string()
    } else if answered_count == 0 {
        "fail".to_string()
    } else {
        "pass".to_string()
    };

    let additional_flags = detect_additional_flags(data, &critical_failures, &non_critical_deficiencies);

    GradingResult {
        outcome,
        critical_failures,
        non_critical_deficiencies,
        fired_rules,
        additional_flags,
        answered_count,
        total_rules,
        timestamp,
    }
}

/// Run the rules without classification — handy for testing.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        let status = (rule.evaluate)(data);
        out.push(FiredRule {
            id: rule.id.to_string(),
            step: rule.step,
            category: rule.category.to_string(),
            description: rule.label.to_string(),
            critical: rule.critical,
            status,
        });
    }
    out
}
