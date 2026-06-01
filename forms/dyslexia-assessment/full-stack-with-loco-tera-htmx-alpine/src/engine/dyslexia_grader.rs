use super::dyslexia_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AdditionalFlag, AssessmentData, DomainScore, GradingResult};
use super::utils::{max_severity, score_severity};

/// Pure function: grades a Dyslexia Assessment battery.
///
/// Returns a [`GradingResult`] containing:
/// - overall severity (driven by the *lowest* non-null standardised score —
///   i.e. the most-impaired domain — matching the JS reference engine)
/// - one `DomainScore` per rule
/// - additional flags (clinician-facing alerts)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let additional_flags = detect_additional_flags(data);
    grade_with_flags(data, additional_flags, timestamp)
}

/// Internal helper that lets callers supply pre-built flags & a deterministic
/// timestamp (used in tests).
pub fn grade_with_flags(
    data: &AssessmentData,
    additional_flags: Vec<AdditionalFlag>,
    timestamp: String,
) -> GradingResult {
    let mut domain_scores: Vec<DomainScore> = Vec::new();
    let mut overall: String = "none".to_string();
    let mut lowest_score: Option<i32> = None;
    let mut answered_count: u32 = 0;

    for rule in all_rules() {
        let score = (rule.evaluate)(data);
        let severity = score_severity(score);
        domain_scores.push(DomainScore {
            id: rule.id.to_string(),
            category: rule.category.to_string(),
            description: rule.description.to_string(),
            score,
            severity: severity.clone(),
        });
        if let Some(s) = score {
            answered_count += 1;
            overall = max_severity(&overall, &severity);
            lowest_score = match lowest_score {
                None => Some(s),
                Some(cur) if s < cur => Some(s),
                Some(cur) => Some(cur),
            };
        }
    }

    GradingResult {
        overall_severity: overall,
        lowest_score,
        answered_count,
        domain_scores,
        additional_flags,
        timestamp,
    }
}
