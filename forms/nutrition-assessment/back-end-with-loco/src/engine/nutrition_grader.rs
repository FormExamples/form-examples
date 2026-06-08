//! Nutrition grader module.

use super::flagged_issues::detect_additional_flags;
use super::must_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, MustRisk, SeverityLevel};

/// Classify a numeric MUST total score (0-6) into a risk band.
pub fn classify_must_score(score: i32) -> MustRisk {
    if score >= 2 {
        "high".to_string()
    } else if score == 1 {
        "medium".to_string()
    } else {
        "low".to_string()
    }
}

/// Friendly label for a MUSTRisk.
pub fn must_risk_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "medium" => "Medium Risk".to_string(),
        "high" => "High Risk".to_string(),
        _ => String::new(),
    }
}

/// Friendly label for a SeverityLevel.
pub fn severity_label(level: &str) -> String {
    match level {
        "low" => "Well-Nourished".to_string(),
        "moderate" => "At Risk of Malnutrition".to_string(),
        "high" => "Malnourished".to_string(),
        "critical" => "Severe Malnutrition with Complications".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the severity badge.
pub fn severity_class(level: &str) -> String {
    match level {
        "low" => "severity-low".to_string(),
        "moderate" => "severity-moderate".to_string(),
        "high" => "severity-high".to_string(),
        "critical" => "severity-critical".to_string(),
        _ => String::new(),
    }
}

/// Map a MUST risk band to a baseline severity level.
pub fn must_risk_to_severity(risk: &str) -> SeverityLevel {
    match risk {
        "low" => "low".to_string(),
        "medium" => "moderate".to_string(),
        "high" => "high".to_string(),
        _ => "low".to_string(),
    }
}

/// Decide whether to escalate to 'critical' severity given the assessment
/// data and the baseline severity from the MUST score.
///
/// Escalation triggers (overall severity becomes 'critical' when MUST risk
/// is 'high' AND any of):
/// - BMI < 16
/// - Weight loss > 15% of usual body weight
/// - Acutely ill with no intake for >5 days
/// - Active swallowing difficulty WITH choking episodes
/// - Receiving parenteral nutrition
pub fn escalate_severity(data: &AssessmentData, baseline: SeverityLevel) -> SeverityLevel {
    if baseline != "high" {
        return baseline;
    }

    if let Some(bmi) = data.anthropometric_measurements.bmi {
        if bmi < 16.0 {
            return "critical".to_string();
        }
    }
    if let Some(pct) = data.anthropometric_measurements.weight_loss_percent {
        if pct > 15.0 {
            return "critical".to_string();
        }
    }
    if data.nutritional_screening.acute_disease == "acutely-ill-no-intake-5d" {
        return "critical".to_string();
    }
    if data.swallowing_oral_health.swallowing_difficulty == "yes"
        && data.swallowing_oral_health.choking_episodes == "yes"
    {
        return "critical".to_string();
    }
    if data.current_nutritional_support.parenteral_nutrition == "yes" {
        return "critical".to_string();
    }
    baseline
}

/// Evaluate the 3-step MUST screening against the supplied assessment data
/// and produce the total score, risk band, severity level, and per-step
/// audit trail. Steps whose categorical answer is unanswered (`''`) are
/// excluded from `answered_count`, `fired_rules`, and the total.
pub fn calculate_must(data: &AssessmentData) -> (i32, MustRisk, SeverityLevel, i32, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut total_score: i32 = 0;
    let mut answered_count: i32 = 0;

    for rule in all_rules() {
        let score = (rule.evaluate)(data);
        if score >= 0 {
            answered_count += 1;
            total_score += score;
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                score,
            });
        }
    }

    let must_risk = classify_must_score(total_score);
    let baseline_severity = must_risk_to_severity(&must_risk);
    let severity = escalate_severity(data, baseline_severity);

    (total_score, must_risk, severity, answered_count, fired_rules)
}

/// Pure function: grades a nutrition assessment.
///
/// Returns a [`GradingResult`] containing:
/// - the MUST total score (0-6)
/// - the MUST risk band (low / medium / high)
/// - the overall severity level (low / moderate / high / critical)
/// - the per-step audit trail of fired MUST rules
/// - clinician-facing additional flags
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (must_score, must_risk, severity, answered_count, fired_rules) = calculate_must(data);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        must_score,
        must_risk,
        severity,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
