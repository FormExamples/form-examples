//! Esas grader module.

use super::flagged_issues::detect_additional_flags;
use super::rules::{RuleKind, all_rules};
use super::types::{
    AssessmentData, FiredRule, GradingResult, IndividualFlag,
};
use super::utils::{classify_esas_total, esas_raw};

/// Pure function: grades a palliative assessment. Returns the ESAS-r total
/// (sum of 10 symptom intensities, 0-100), the severity band, the fired
/// rules audit trail, individual-symptom flags (any ESAS >= 7), and the
/// clinician-facing additional flags.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut individual_flags: Vec<IndividualFlag> = Vec::new();
    let mut total: i32 = 0;
    let mut answered_count: u32 = 0;

    for rule in all_rules() {
        let score = (rule.evaluate)(data);

        match rule.kind {
            RuleKind::Esas => {
                let answered = esas_raw(data, rule.symptom_key).is_some();
                if answered {
                    answered_count += 1;
                    total += score;
                    fired_rules.push(FiredRule {
                        id: rule.id.to_string(),
                        category: rule.category.to_string(),
                        description: rule.description.to_string(),
                        score,
                    });
                    if score >= 7 {
                        individual_flags.push(IndividualFlag {
                            symptom_key: rule.symptom_key.to_string(),
                            symptom_label: super::types::label_for(rule.symptom_key)
                                .to_string(),
                            score,
                        });
                    }
                }
            }
            RuleKind::Ancillary => {
                if score > 0 {
                    fired_rules.push(FiredRule {
                        id: rule.id.to_string(),
                        category: rule.category.to_string(),
                        description: rule.description.to_string(),
                        score,
                    });
                }
            }
        }
    }

    let severity_band = classify_esas_total(total);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        esas_total: total,
        severity_band,
        answered_count,
        fired_rules,
        individual_flags,
        additional_flags,
        timestamp,
    }
}
