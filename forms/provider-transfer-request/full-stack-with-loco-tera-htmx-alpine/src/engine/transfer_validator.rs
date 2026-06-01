use std::collections::BTreeMap;

use super::flagged_issues::detect_flagged_issues;
use super::types::{
    AssessmentData, CompletenessLevel, FiredRule, GradingResult, SectionCompleteness,
    ValidationResult,
};
use super::validation_rules::all_rules;

/// Pure function: validate a Provider Transfer Request assessment.
///
/// Completeness mapping mirrors the reference JavaScript engine:
/// - all applicable rules satisfied                       -> "complete"
/// - all mandatory rules satisfied; some optional missing -> "partial"
/// - any mandatory rule unsatisfied                       -> "incomplete"
pub fn validate_transfer(data: &AssessmentData) -> ValidationResult {
    // Use the index in `section_order` to preserve insertion order in output.
    let mut section_order: Vec<String> = Vec::new();
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();

    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;
    let mut mandatory_required: u32 = 0;
    let mut mandatory_satisfied: u32 = 0;

    for rule in all_rules() {
        if !(rule.applies)(data) {
            continue;
        }
        let satisfied = (rule.is_satisfied)(data);

        total_required += 1;
        if rule.mandatory {
            mandatory_required += 1;
        }
        if satisfied {
            total_satisfied += 1;
            if rule.mandatory {
                mandatory_satisfied += 1;
            }
        }

        let key = rule.section.to_string();
        if !section_map.contains_key(&key) {
            section_order.push(key.clone());
            section_map.insert(
                key.clone(),
                SectionCompleteness {
                    section: rule.section.to_string(),
                    required: 0,
                    satisfied: 0,
                    mandatory_required: 0,
                    mandatory_satisfied: 0,
                    missing: Vec::new(),
                },
            );
        }
        let bucket = section_map
            .get_mut(&key)
            .expect("bucket inserted on previous line");
        bucket.required += 1;
        if rule.mandatory {
            bucket.mandatory_required += 1;
        }
        if satisfied {
            bucket.satisfied += 1;
            if rule.mandatory {
                bucket.mandatory_satisfied += 1;
            }
        } else {
            let fired = FiredRule {
                id: rule.id.to_string(),
                section: rule.section.to_string(),
                description: rule.description.to_string(),
                mandatory: rule.mandatory,
            };
            missing.push(fired.clone());
            bucket.missing.push(fired);
        }
    }

    let sections: Vec<SectionCompleteness> = section_order
        .into_iter()
        .filter_map(|s| section_map.remove(&s))
        .collect();

    let completeness: CompletenessLevel = if mandatory_satisfied < mandatory_required {
        "incomplete".to_string()
    } else if total_satisfied < total_required {
        "partial".to_string()
    } else {
        "complete".to_string()
    };

    ValidationResult {
        completeness,
        total_required,
        total_satisfied,
        mandatory_required,
        mandatory_satisfied,
        sections,
        missing,
    }
}

/// Pure function: grade a Provider Transfer Request assessment. Combines the
/// completeness validator with the flagged-issues detector and stamps the
/// result with the current UTC timestamp.
pub fn grade(data: &AssessmentData) -> GradingResult {
    GradingResult {
        validation: validate_transfer(data),
        flags: detect_flagged_issues(data),
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}
