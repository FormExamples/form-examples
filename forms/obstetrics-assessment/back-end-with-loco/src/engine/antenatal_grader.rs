//! Antenatal grader module.

use super::flagged_issues::detect_additional_flags;
use super::ng201_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, RiskLevel};

/// Pure function: grades an obstetrics assessment per NICE NG201.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let risk_level: RiskLevel = if fired_rules.iter().any(|r| r.risk == "high") {
        "high".to_string()
    } else if fired_rules.iter().any(|r| r.risk == "moderate") {
        "moderate".to_string()
    } else {
        "low".to_string()
    };

    let answered_count = count_answered_inputs(data);

    GradingResult {
        risk_level,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every NG201 rule against the data, returning the fired rules.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out: Vec<FiredRule> = Vec::new();
    for rule in all_rules() {
        if let Some(risk) = (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                risk: risk.to_string(),
            });
        }
    }
    // Sort: high first, then moderate, then low; tie-break by ID.
    out.sort_by(|a, b| {
        let order = |r: &str| match r {
            "high" => 0,
            "moderate" => 1,
            "low" => 2,
            _ => 3,
        };
        order(a.risk.as_str())
            .cmp(&order(b.risk.as_str()))
            .then_with(|| a.id.cmp(&b.id))
    });
    out
}

/// Count answered top-level questionnaire inputs across every section as a
/// proxy for completeness. JSON-equivalent: any value that is neither null
/// nor the empty string.
fn count_answered_inputs(data: &AssessmentData) -> u32 {
    let v = match serde_json::to_value(data) {
        Ok(v) => v,
        Err(_) => return 0,
    };
    let mut count = 0u32;
    if let serde_json::Value::Object(sections) = v {
        for (_section_key, section_value) in sections.iter() {
            if let serde_json::Value::Object(fields) = section_value {
                for (_field_key, field_value) in fields.iter() {
                    if is_answered(field_value) {
                        count += 1;
                    }
                }
            }
        }
    }
    count
}

fn is_answered(v: &serde_json::Value) -> bool {
    match v {
        serde_json::Value::Null => false,
        serde_json::Value::String(s) => !s.is_empty(),
        _ => true,
    }
}

/// Friendly label for a risk level.
pub fn risk_level_label(level: &str) -> String {
    match level {
        "high" => "High Risk — Consultant-led / Multidisciplinary Care".to_string(),
        "moderate" => "Moderate Risk — Obstetric Input at Milestones".to_string(),
        "low" => "Low Risk — Midwifery-led Care".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for a risk badge.
pub fn risk_level_class(level: &str) -> String {
    match level {
        "high" => "risk-high".to_string(),
        "moderate" => "risk-moderate".to_string(),
        "low" => "risk-low".to_string(),
        _ => String::new(),
    }
}
