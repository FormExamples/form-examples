//! Helper predicates and counters used by the grader.

use chrono::{Datelike, NaiveDate, Utc};

/// Display label for an eligibility status.
pub fn eligibility_label(status: &str) -> String {
    match status {
        "eligible" => "Eligible to Donate".to_string(),
        "temporarily-deferred" => "Temporarily Deferred".to_string(),
        "permanently-deferred" => "Permanently Deferred".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the eligibility badge.
pub fn eligibility_class(status: &str) -> String {
    match status {
        "eligible" => "status-eligible".to_string(),
        "temporarily-deferred" => "status-temporarily-deferred".to_string(),
        "permanently-deferred" => "status-permanently-deferred".to_string(),
        _ => String::new(),
    }
}

/// Age in completed years from an ISO `YYYY-MM-DD` date of birth.
pub fn calculate_age_years(date_of_birth: &str) -> Option<i32> {
    if date_of_birth.is_empty() {
        return None;
    }
    let dob = NaiveDate::parse_from_str(date_of_birth, "%Y-%m-%d").ok()?;
    let today = Utc::now().date_naive();
    let mut years = today.year() - dob.year();
    if today.month() < dob.month()
        || (today.month() == dob.month() && today.day() < dob.day())
    {
        years -= 1;
    }
    Some(years)
}

/// Days elapsed since the supplied ISO `YYYY-MM-DD` date. Returns `None`
/// if the input is empty or cannot be parsed.
pub fn days_since(date: &str) -> Option<i64> {
    if date.is_empty() {
        return None;
    }
    let d = NaiveDate::parse_from_str(date, "%Y-%m-%d").ok()?;
    let today = Utc::now().date_naive();
    Some(today.signed_duration_since(d).num_days())
}
