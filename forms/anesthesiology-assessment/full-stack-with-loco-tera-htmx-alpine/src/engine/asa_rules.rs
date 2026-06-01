// ASA Physical Status Classification rules.
//
// The clinician selects ASA I-VI directly. The risk mapping promotes the
// class to a four-band perioperative risk level used by the composite
// grader.
//
// ASA-001 — class I-II = low; III = medium; IV = high; V-VI = critical.

use super::types::{AsaResult, AssessmentData, FiredRule};

/// Long friendly label for an ASA class.
pub fn asa_class_label(class: &str) -> String {
    match class {
        "i" => "ASA I — Healthy".to_string(),
        "ii" => "ASA II — Mild systemic disease".to_string(),
        "iii" => "ASA III — Severe systemic disease".to_string(),
        "iv" => "ASA IV — Severe disease, constant threat to life".to_string(),
        "v" => "ASA V — Moribund, not expected to survive without surgery".to_string(),
        "vi" => "ASA VI — Brain-dead, organ donor".to_string(),
        _ => String::new(),
    }
}

/// Risk level for a given ASA class. Defaults to `low` for empty class.
pub fn asa_risk_from_class(class: &str) -> &'static str {
    match class {
        "i" | "ii" => "low",
        "iii" => "medium",
        "iv" => "high",
        "v" | "vi" => "critical",
        _ => "low",
    }
}

/// Evaluate the ASA Physical Status against the assessment.
pub fn evaluate_asa(d: &AssessmentData) -> AsaResult {
    let class = d.investigations_and_plan.asa_class.clone();
    let emergency = d.investigations_and_plan.emergency_case == "yes";
    let risk = asa_risk_from_class(&class).to_string();
    let mut fired_rules = Vec::new();
    if !class.is_empty() {
        let suffix = if emergency { " (Emergency)" } else { "" };
        fired_rules.push(FiredRule {
            id: "ASA-001".to_string(),
            category: "ASA Physical Status".to_string(),
            description: format!("{}{}", asa_class_label(&class), suffix),
            risk_level: risk.clone(),
        });
    }
    AsaResult {
        class,
        emergency,
        risk_level: risk,
        fired_rules,
    }
}
