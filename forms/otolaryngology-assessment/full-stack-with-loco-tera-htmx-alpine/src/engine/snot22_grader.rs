use super::flagged_issues::detect_additional_flags;
use super::snot22_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, SeverityLevel};

/// Classify a SNOT-22 total into mild / moderate / severe.
///
/// - 0 - 7  -> `mild`
/// - 8 - 19 -> `moderate`
/// - >= 20  -> `severe`
pub fn classify_snot22_score(score: i32) -> SeverityLevel {
    if score >= 20 {
        "severe".to_string()
    } else if score >= 8 {
        "moderate".to_string()
    } else {
        "mild".to_string()
    }
}

/// Human-readable label for a severity band.
pub fn severity_label(level: &str) -> String {
    match level {
        "severe" => "Severe \u{2014} significant impact".to_string(),
        "moderate" => "Moderate \u{2014} targeted management advised".to_string(),
        "mild" => "Mild \u{2014} minimal impact".to_string(),
        _ => String::new(),
    }
}

/// CSS class for a severity band.
pub fn severity_class(level: &str) -> String {
    match level {
        "severe" => "severity-severe".to_string(),
        "moderate" => "severity-moderate".to_string(),
        "mild" => "severity-mild".to_string(),
        _ => String::new(),
    }
}

/// Run every SNOT-22 rule against the data, returning fired rules + totals.
pub fn calculate_snot22(data: &AssessmentData) -> (i32, SeverityLevel, i32, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut total_score: i32 = 0;
    let mut answered_count: i32 = 0;

    for rule in all_rules() {
        let (score, answered) = (rule.evaluate)(data);
        if answered {
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

    let severity_level = classify_snot22_score(total_score);
    (total_score, severity_level, answered_count, fired_rules)
}

/// Pure function: grades an otolaryngology assessment.
///
/// Returns a [`GradingResult`] containing the SNOT-22 total, severity band,
/// answered count, the per-question audit trail, and the clinical flag list.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (total_score, severity_level, answered_count, fired_rules) = calculate_snot22(data);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        total_score,
        severity_level,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
