use chrono::{Datelike, NaiveDate, Utc};

/// CSS class hint for the completeness badge.
pub fn completeness_level_class(level: &str) -> String {
    match level {
        "complete" => "completeness-complete".to_string(),
        "partial" => "completeness-partial".to_string(),
        "incomplete" => "completeness-incomplete".to_string(),
        _ => String::new(),
    }
}

/// Calculate age in years from a YYYY-MM-DD date-of-birth string.
pub fn calculate_age(dob: &str) -> Option<i32> {
    if dob.is_empty() {
        return None;
    }
    let birth = NaiveDate::parse_from_str(dob, "%Y-%m-%d").ok()?;
    let today = Utc::now().date_naive();
    let mut age = today.year() - birth.year();
    if today.month() < birth.month()
        || (today.month() == birth.month() && today.day() < birth.day())
    {
        age -= 1;
    }
    Some(age)
}
