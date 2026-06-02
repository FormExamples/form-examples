use super::donor_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, Eligibility, FiredRule, GradingResult, RiskLevel};
use super::utils::{collection_method_label, hla_match_label};

/// Evaluate every declarative donor rule against the given assessment data.
pub fn evaluate_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut fired = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            fired.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                grade: rule.grade,
            });
        }
    }
    fired
}

/// Compute final eligibility + overall risk from the fired rules and the
/// clinician's explicit eligibility decision (if any).
pub fn classify_eligibility(
    fired_rules: &[FiredRule],
    data: &AssessmentData,
) -> (Eligibility, RiskLevel, Eligibility) {
    // The HLA-001 and AN-001 "ideal donor" markers are positive findings —
    // ignore them when counting penalties.
    let positive_ideal_ids = ["HLA-001", "AN-001"];

    let flagged: Vec<&FiredRule> = fired_rules
        .iter()
        .filter(|r| !positive_ideal_ids.contains(&r.id.as_str()))
        .collect();
    let grade4 = flagged.iter().filter(|r| r.grade == 4).count();
    let grade3 = flagged.iter().filter(|r| r.grade == 3).count();
    let grade2 = flagged.iter().filter(|r| r.grade == 2).count();

    let mut suggested = "suitable".to_string();
    let mut overall_risk = "low".to_string();

    if grade4 > 0 {
        suggested = "unsuitable".to_string();
        overall_risk = "critical".to_string();
    } else if grade3 >= 2 {
        suggested = "conditionally-suitable".to_string();
        overall_risk = "high".to_string();
    } else if grade3 == 1 {
        suggested = "conditionally-suitable".to_string();
        overall_risk = "high".to_string();
    } else if grade2 >= 2 {
        suggested = "conditionally-suitable".to_string();
        overall_risk = "moderate".to_string();
    } else if grade2 == 1 {
        suggested = "conditionally-suitable".to_string();
        overall_risk = "moderate".to_string();
    }

    let assessor = &data.consent_eligibility.eligibility_decision;
    let eligibility = if assessor.is_empty() {
        suggested.clone()
    } else {
        assessor.clone()
    };

    (eligibility, overall_risk, suggested)
}

/// Pick the final / suggested collection method label.
pub fn derive_collection_method(data: &AssessmentData) -> String {
    let cm = &data.collection_method_assessment;
    let final_label = collection_method_label(&cm.final_collection_method);
    if final_label != "Not determined" {
        return final_label;
    }
    let preferred = collection_method_label(&cm.preferred_method);
    if preferred != "Not determined" {
        return preferred;
    }
    let recipient = collection_method_label(&cm.recipient_preference);
    if recipient != "Not determined" {
        return recipient;
    }
    "Not determined".to_string()
}

/// High-level grader: returns the full GradingResult.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = evaluate_rules(data);
    let additional_flags = detect_additional_flags(data);
    let (eligibility, overall_risk, suggested_eligibility) =
        classify_eligibility(&fired_rules, data);

    GradingResult {
        eligibility,
        overall_risk,
        suggested_eligibility,
        hla_match_level: hla_match_label(&data.donor_registration_hla_typing.hla_match_level),
        collection_method: derive_collection_method(data),
        fired_rules,
        additional_flags,
        timestamp,
    }
}
