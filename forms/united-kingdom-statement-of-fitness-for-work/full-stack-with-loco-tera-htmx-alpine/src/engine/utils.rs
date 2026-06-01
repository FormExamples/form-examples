//! Pure helper functions for the fit-note grader.

use chrono::NaiveDate;

use crate::engine::types::AssessmentData;

/// Count how many of the four adaptation tick boxes are set to "yes".
pub fn count_adaptations(fit_note: &AssessmentData) -> u32 {
    let yes = |s: &str| if s == "yes" { 1 } else { 0 };
    yes(&fit_note.adaptation_phased_return)
        + yes(&fit_note.adaptation_altered_hours)
        + yes(&fit_note.adaptation_amended_duties)
        + yes(&fit_note.adaptation_workplace_adaptations)
}

/// Compute the period length in calendar days.
///
/// - `period_type == "duration"`: multiply the value by the unit (`days`,
///   `weeks`, or `months` rounded at 30.4375 days/month).
/// - `period_type == "from_to"`: difference between the two ISO-8601 dates.
/// - Otherwise: `None`.
pub fn compute_period_days(fit_note: &AssessmentData) -> Option<i64> {
    if fit_note.period_type == "duration" {
        let n = fit_note.period_duration_value?;
        return match fit_note.period_duration_unit.as_str() {
            "days" => Some(n),
            "weeks" => Some(n * 7),
            "months" => Some((n as f64 * 30.4375).round() as i64),
            _ => None,
        };
    }
    if fit_note.period_type == "from_to" {
        let from = NaiveDate::parse_from_str(&fit_note.period_from, "%Y-%m-%d").ok()?;
        let to = NaiveDate::parse_from_str(&fit_note.period_to, "%Y-%m-%d").ok()?;
        return Some((to - from).num_days());
    }
    None
}

/// Classify whether the assessment is within the first six months of the
/// condition (drives DWP policy 3.3 — 3-month maximum on the initial fit
/// note). Returns "yes" / "no" / "" if either date is missing or unparseable.
pub fn classify_first_six_months(fit_note: &AssessmentData) -> String {
    if fit_note.condition_first_recorded_date.is_empty() || fit_note.assessment_date.is_empty() {
        return String::new();
    }
    let condition =
        NaiveDate::parse_from_str(&fit_note.condition_first_recorded_date, "%Y-%m-%d").ok();
    let assessment = NaiveDate::parse_from_str(&fit_note.assessment_date, "%Y-%m-%d").ok();
    match (condition, assessment) {
        (Some(c), Some(a)) => {
            let diff_days = (a - c).num_days();
            if diff_days <= 183 { "yes".into() } else { "no".into() }
        }
        _ => String::new(),
    }
}

/// Display label for the recommendation enum.
pub fn recommendation_label(recommendation: &str) -> String {
    match recommendation {
        "standard" => "Standard".to_string(),
        "refer_occupational_health" => "Refer to Occupational Health".to_string(),
        "refer_access_to_work" => "Refer to Access to Work".to_string(),
        "refer_employment_advisor" => "Refer to Employment Advisor".to_string(),
        "review_for_validity" => "Review for Validity".to_string(),
        _ => format!("Recommendation: {recommendation}"),
    }
}
