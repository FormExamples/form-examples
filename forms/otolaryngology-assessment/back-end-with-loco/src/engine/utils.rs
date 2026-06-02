use chrono::{Datelike, NaiveDate, Utc};

/// Display label for a SNOT-22 severity band.
pub fn severity_status_label(level: &str) -> String {
    match level {
        "severe" => "Severe".to_string(),
        "moderate" => "Moderate".to_string(),
        "mild" => "Mild".to_string(),
        _ => format!("Status: {level}"),
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
