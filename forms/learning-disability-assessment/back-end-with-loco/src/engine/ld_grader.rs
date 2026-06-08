//! Ld grader module.

use super::flagged_issues::detect_additional_flags;
use super::rules::{LdRule, all_rules, evaluate};
use super::types::{AssessmentData, FiredRule, GradingResult, SeverityCategory};

/// Classify a mean adaptive score (0-3) into a severity category.
///
/// Severity cutoffs (mean score over answered items, 0-3):
///   < 1.0    → Mild
///   1.0-1.99 → Moderate
///   2.0-2.59 → Severe
///   >= 2.6   → Profound
pub fn classify_adaptive_score(mean: f64) -> SeverityCategory {
    if mean >= 2.6 {
        "profound".to_string()
    } else if mean >= 2.0 {
        "severe".to_string()
    } else if mean >= 1.0 {
        "moderate".to_string()
    } else {
        "mild".to_string()
    }
}

/// Friendly label for a SeverityCategory.
pub fn severity_label(sev: &str) -> String {
    match sev {
        "mild" => "Mild Learning Disability".to_string(),
        "moderate" => "Moderate Learning Disability".to_string(),
        "severe" => "Severe Learning Disability".to_string(),
        "profound" => "Profound Learning Disability".to_string(),
        _ => String::new(),
    }
}

/// One-line description for the severity category.
pub fn severity_description(sev: &str) -> String {
    match sev {
        "mild" => "Independent with support in complex tasks (DSM-5-TR mild range).".to_string(),
        "moderate" => {
            "Needs significant support with daily living (DSM-5-TR moderate range).".to_string()
        }
        "severe" => {
            "Needs substantial support; limited communication (DSM-5-TR severe range).".to_string()
        }
        "profound" => {
            "Very limited understanding and communication; intensive support (DSM-5-TR profound range)."
                .to_string()
        }
        _ => String::new(),
    }
}

/// CSS class hint for the severity badge.
pub fn severity_class(sev: &str) -> String {
    match sev {
        "mild" => "sev-mild".to_string(),
        "moderate" => "sev-moderate".to_string(),
        "severe" => "sev-severe".to_string(),
        "profound" => "sev-profound".to_string(),
        _ => String::new(),
    }
}

/// Evaluate every rule against the data, returning the rules that fired
/// (i.e. items with an answered SupportLevel).
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if let Some(score) = evaluate(&rule, data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                score,
            });
        }
    }
    out
}

/// Pure function: grade a Learning Disability assessment.
///
/// Returns the mean adaptive support score (0-3), the severity category,
/// number of adaptive-functioning items answered, all fired rules
/// (per-item audit trail), and clinician-facing additional flags.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);

    let answered_count = fired_rules.len() as i32;
    let total: i32 = fired_rules.iter().map(|r| r.score).sum();
    let mean = if answered_count == 0 {
        0.0
    } else {
        total as f64 / answered_count as f64
    };
    let adaptive_score = (mean * 100.0).round() / 100.0;
    let severity_category = classify_adaptive_score(mean);

    let additional_flags = detect_additional_flags(data);

    GradingResult {
        adaptive_score,
        severity_category,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

// Silence dead-code lint on rules helpers when only `all_rules` is used.
#[allow(dead_code)]
fn _force_use(_: &LdRule) {}
