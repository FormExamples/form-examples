use std::collections::BTreeMap;

use super::flagged_issues::detect_flagged_issues;
use super::types::{AssessmentData, FiredRule, GradingResult, SectionCompleteness};
use super::v1_rules::all_rules;

/// Pure function: grades a DVLA V1 assessment.
///
/// Returns a [`GradingResult`] containing per-section completeness,
/// the fired (unsatisfied) rules, and the detected flagged issues.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut section_order: Vec<String> = Vec::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    for rule in all_rules() {
        total_required += 1;

        if !section_map.contains_key(rule.section) {
            section_order.push(rule.section.to_string());
            section_map.insert(
                rule.section.to_string(),
                SectionCompleteness {
                    section: rule.section.to_string(),
                    required: 0,
                    satisfied: 0,
                    missing: Vec::new(),
                },
            );
        }
        let bucket = section_map.get_mut(rule.section).unwrap();
        bucket.required += 1;

        let ok = (rule.evaluate)(data);
        if ok {
            total_satisfied += 1;
            bucket.satisfied += 1;
        } else {
            let fired = FiredRule {
                id: rule.id.to_string(),
                section: rule.section.to_string(),
                description: rule.description.to_string(),
                message: rule.message.to_string(),
            };
            missing.push(fired.clone());
            bucket.missing.push(fired);
        }
    }

    let sections: Vec<SectionCompleteness> = section_order
        .iter()
        .filter_map(|s| section_map.remove(s))
        .collect();

    let overall_percent = if total_required == 0 {
        0
    } else {
        ((total_satisfied as f64 / total_required as f64) * 100.0).round() as u32
    };

    let flagged_issues = detect_flagged_issues(data);

    GradingResult {
        complete: missing.is_empty(),
        total_required,
        total_satisfied,
        overall_percent,
        sections,
        missing,
        flagged_issues,
        timestamp,
    }
}

/// Evaluate every rule against the data, returning the rules that fired
/// (i.e. were unsatisfied).
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if !(rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                section: rule.section.to_string(),
                description: rule.description.to_string(),
                message: rule.message.to_string(),
            });
        }
    }
    out
}
