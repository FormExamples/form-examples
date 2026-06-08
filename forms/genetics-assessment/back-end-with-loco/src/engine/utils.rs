//! Helper predicates and counters used by the grader.

use chrono::{Datelike, NaiveDate, Utc};

use super::types::RiskLevel;

/// Display label for a RiskLevel.
pub fn risk_level_label(level: &str) -> String {
    match level {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the risk-level badge.
pub fn risk_level_class(level: &str) -> String {
    match level {
        "low" => "risk-low".to_string(),
        "moderate" => "risk-moderate".to_string(),
        "high" => "risk-high".to_string(),
        _ => String::new(),
    }
}

fn risk_order(level: &str) -> u8 {
    match level {
        "high" => 3,
        "moderate" => 2,
        "low" => 1,
        _ => 0,
    }
}

/// Return the higher-severity of two RiskLevel strings.
pub fn max_risk_level(a: &str, b: &str) -> RiskLevel {
    if risk_order(a) >= risk_order(b) {
        a.to_string()
    } else {
        b.to_string()
    }
}

/// Calculate age in whole years from a YYYY-MM-DD date-of-birth string.
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
