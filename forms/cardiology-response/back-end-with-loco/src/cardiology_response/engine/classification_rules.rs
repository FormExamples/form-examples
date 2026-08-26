//! Axis A — response classification.
//!
//! Determines the overall assessment conclusion:
//! - critical: a critical result is present (auto-escalation invariant).
//! - inconclusive: no clinical summary recorded, or no diagnosis category and no
//!   structured finding (the assessment did not reach a conclusion).
//! - cardiac-condition: any structured cardiac finding is present, or the
//!   diagnosis category is a cardiac one.
//! - no-abnormality: no cardiac finding and a non-cardiac / no-abnormality
//!   conclusion on a completed assessment.
//!
//! Rule IDs are stable and identical across every front-end and the back-end.

use super::types::{CardiologyResponse, FiredRule, ResponseClassification};
use super::utils::{has_any_cardiac_finding, has_critical_finding};

/// Classify a response, returning the classification plus the fired rules.
#[must_use]
pub fn classify_response(r: &CardiologyResponse) -> (ResponseClassification, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    if has_critical_finding(r) {
        fired_rules.push(FiredRule {
            rule_id: "R-CLASS-CRITICAL-01".to_string(),
            axis: "classification".to_string(),
            category: "critical-finding".to_string(),
            description:
                "A critical or unexpected significant cardiac result is present; classified as critical."
                    .to_string(),
        });
        return ("critical".to_string(), fired_rules);
    }

    if r.clinical_summary.trim().is_empty() {
        fired_rules.push(FiredRule {
            rule_id: "R-CLASS-INCONCLUSIVE-01".to_string(),
            axis: "classification".to_string(),
            category: "no-summary".to_string(),
            description: "No clinical summary recorded; classified as inconclusive.".to_string(),
        });
        return ("inconclusive".to_string(), fired_rules);
    }

    let cardiac_diagnosis = matches!(
        r.primary_diagnosis_category.as_str(),
        "coronary-artery-disease"
            | "heart-failure"
            | "arrhythmia"
            | "valve-disease"
            | "hypertension"
            | "cardiomyopathy"
    );

    if has_any_cardiac_finding(r) || cardiac_diagnosis {
        fired_rules.push(FiredRule {
            rule_id: "R-CLASS-CARDIAC-01".to_string(),
            axis: "classification".to_string(),
            category: "cardiac-condition".to_string(),
            description:
                "One or more structured cardiac findings or a cardiac diagnosis are present; classified as a cardiac condition."
                    .to_string(),
        });
        return ("cardiac-condition".to_string(), fired_rules);
    }

    if r.primary_diagnosis_category == "non-cardiac"
        || r.primary_diagnosis_category == "no-abnormality"
        || r.non_cardiac_cause
    {
        fired_rules.push(FiredRule {
            rule_id: "R-CLASS-NONE-01".to_string(),
            axis: "classification".to_string(),
            category: "no-abnormality".to_string(),
            description:
                "No structured cardiac finding and a non-cardiac / no-abnormality conclusion; classified as no abnormality."
                    .to_string(),
        });
        return ("no-abnormality".to_string(), fired_rules);
    }

    // A summary exists but no diagnosis and no structured finding: not concluded.
    fired_rules.push(FiredRule {
        rule_id: "R-CLASS-INCONCLUSIVE-02".to_string(),
        axis: "classification".to_string(),
        category: "no-diagnosis".to_string(),
        description:
            "A clinical summary exists but no diagnosis category and no structured finding were recorded; classified as inconclusive."
                .to_string(),
    });
    ("inconclusive".to_string(), fired_rules)
}
