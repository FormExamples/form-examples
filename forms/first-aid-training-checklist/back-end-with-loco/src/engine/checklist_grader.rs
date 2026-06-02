use super::checklist_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, FiredRule, GradingResult, Outcome};

/// Deficiencies threshold above which the overall outcome becomes Fail.
pub const NEEDS_DEVELOPMENT_DEFICIENCY_LIMIT: usize = 2;

/// Pure function: grade a First Aid at Work competency assessment.
///
/// HSE / St John outcome logic:
/// - Any critical-skill rule firing `no` → overall **Fail**.
/// - 3 or more non-critical `no` deficiencies → **Fail**.
/// - 1 or 2 non-critical `no` deficiencies → **Needs Development**.
/// - Otherwise (no deficiencies, at least one assessed) → **Pass**.
/// - Items the examiner has not assessed (`na` or `""`) do not count as
///   deficiencies.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut critical_failures: Vec<FiredRule> = Vec::new();
    let mut deficiencies: Vec<FiredRule> = Vec::new();
    let mut answered_count: u32 = 0;

    for rule in all_rules() {
        let status = (rule.evaluate)(data);
        let entry = FiredRule {
            id: rule.id.to_string(),
            step: rule.step,
            category: rule.category.to_string(),
            description: rule.label.to_string(),
            critical: rule.critical,
            status: status.clone(),
        };
        fired_rules.push(entry.clone());

        if status == "yes" || status == "no" {
            answered_count += 1;
        }

        if status == "no" {
            if rule.critical {
                critical_failures.push(entry);
            } else {
                deficiencies.push(entry);
            }
        }
    }

    let outcome: Outcome = if !critical_failures.is_empty() {
        "fail".to_string()
    } else if deficiencies.len() > NEEDS_DEVELOPMENT_DEFICIENCY_LIMIT {
        "fail".to_string()
    } else if !deficiencies.is_empty() {
        "needs-development".to_string()
    } else if answered_count == 0 {
        // Nothing assessed yet — surface a neutral "fail" on submission so the
        // examiner is prompted to actually mark items, but don't claim success.
        "fail".to_string()
    } else {
        "pass".to_string()
    };

    let additional_flags = detect_additional_flags(data, &critical_failures, &deficiencies);

    GradingResult {
        outcome,
        critical_failures,
        deficiencies,
        fired_rules,
        additional_flags,
        answered_count,
        total_rules: all_rules().len() as u32,
        timestamp,
    }
}

/// Re-export of `grade` for symmetry with the JS API (`gradeFirstAid`).
pub fn grade_first_aid(data: &AssessmentData) -> GradingResult {
    grade(data)
}

/// Evaluate every rule against the data, returning the full audit trail.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    grade(data).fired_rules
}
