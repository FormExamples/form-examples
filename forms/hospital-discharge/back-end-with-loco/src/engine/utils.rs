//! Helper predicates and counters used by the grader.

use chrono::NaiveDate;

/// Display label for a NICE NG27 completeness level.
pub fn completeness_label(level: &str) -> String {
    match level {
        "complete" => "Complete \u{2014} safe to proceed".to_string(),
        "partial" => "Partial \u{2014} may proceed with flag".to_string(),
        "incomplete" => "Incomplete \u{2014} do not proceed".to_string(),
        _ => format!("Level: {level}"),
    }
}

/// CSS class hint for the completeness badge.
pub fn completeness_class(level: &str) -> String {
    match level {
        "complete" => "completeness-complete".to_string(),
        "partial" => "completeness-partial".to_string(),
        "incomplete" => "completeness-incomplete".to_string(),
        _ => String::new(),
    }
}

/// Calculate length of stay in days. Returns `None` for invalid input or
/// when the discharge precedes the admission.
pub fn calculate_length_of_stay(admission_date: &str, discharge_date: &str) -> Option<i64> {
    if admission_date.is_empty() || discharge_date.is_empty() {
        return None;
    }
    let a = NaiveDate::parse_from_str(admission_date, "%Y-%m-%d").ok()?;
    let d = NaiveDate::parse_from_str(discharge_date, "%Y-%m-%d").ok()?;
    let days = (d - a).num_days();
    if days < 0 { None } else { Some(days) }
}

/// Trim helper: returns true when the string contains any non-whitespace.
pub fn non_empty(s: &str) -> bool {
    !s.trim().is_empty()
}
