use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, CompletenessLevel, FiredRule, GradingResult};
use super::validation_rules::all_rules;

/// Pure function: grades a hospital discharge summary against the NICE
/// NG27 mandatory and optional rule set.
///
/// Completeness cutoffs:
/// - All mandatory rules satisfied + all optional rules satisfied -> `complete`
/// - All mandatory rules satisfied + some optional rules missing  -> `partial`
/// - Any mandatory rule unsatisfied                                 -> `incomplete`
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (
        completeness_level,
        mandatory_satisfied,
        mandatory_total,
        optional_satisfied,
        optional_total,
        fired_rules,
    ) = validate_discharge(data);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        completeness_level,
        mandatory_satisfied,
        mandatory_total,
        optional_satisfied,
        optional_total,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every NG27 rule and tally satisfied / total counts.
pub fn validate_discharge(
    data: &AssessmentData,
) -> (CompletenessLevel, u32, u32, u32, u32, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut mandatory_satisfied: u32 = 0;
    let mut mandatory_total: u32 = 0;
    let mut optional_satisfied: u32 = 0;
    let mut optional_total: u32 = 0;

    for rule in all_rules() {
        let satisfied = (rule.evaluate)(data);
        if rule.mandatory {
            mandatory_total += 1;
            if satisfied {
                mandatory_satisfied += 1;
            }
        } else {
            optional_total += 1;
            if satisfied {
                optional_satisfied += 1;
            }
        }
        fired_rules.push(FiredRule {
            id: rule.id.to_string(),
            category: rule.category.to_string(),
            description: rule.description.to_string(),
            satisfied,
            mandatory: rule.mandatory,
        });
    }

    let completeness_level: CompletenessLevel = if mandatory_satisfied < mandatory_total {
        "incomplete".to_string()
    } else if optional_satisfied < optional_total {
        "partial".to_string()
    } else {
        "complete".to_string()
    };

    (
        completeness_level,
        mandatory_satisfied,
        mandatory_total,
        optional_satisfied,
        optional_total,
        fired_rules,
    )
}
