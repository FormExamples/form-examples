//! Helper predicates and counters used by the grader.

use chrono::{Datelike, NaiveDate, Utc};

use super::sad_rules::{combined_severity_label, phq9_band_label, spaq_band_label};

/// Display label for a SPAQ band.
pub fn spaq_label(band: &str) -> String {
    spaq_band_label(band)
}

/// Display label for a PHQ-9 band.
pub fn phq9_label(band: &str) -> String {
    phq9_band_label(band)
}

/// Display label for the combined severity classification.
pub fn severity_label(severity: &str) -> String {
    combined_severity_label(severity)
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
