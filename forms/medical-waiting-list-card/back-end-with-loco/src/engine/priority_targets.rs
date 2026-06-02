use chrono::NaiveDate;

/// 18-week NHS RTT standard breach threshold.
pub const RTT_BREACH_WEEKS: f64 = 18.0;

/// 52-week long-wait threshold.
pub const LONG_WAIT_WEEKS: f64 = 52.0;

/// "Within 4 weeks of breach" approaching-breach window.
pub const APPROACHING_BREACH_WINDOW_WEEKS: f64 = 4.0;

/// Maximum permitted wait, in weeks, for a given clinical priority.
///
/// Mirrors the NHS England Clinical Prioritisation (P1–P6) framework
/// and the 18-week RTT standard. P6 means "removed from list" and has
/// no target.
pub fn target_wait_weeks(priority: &str) -> Option<f64> {
    match priority {
        "P1a" => Some(1.0 / 7.0),
        "P1b" => Some(3.0 / 7.0),
        "P2" => Some(4.0),
        "P3" => Some(12.0),
        "P4" => Some(18.0),
        "P5" => Some(26.0),
        "P6" => None,
        _ => None,
    }
}

/// Parse an ISO 8601 date (YYYY-MM-DD). Empty string returns `None`.
pub fn parse_iso_date(iso: &str) -> Option<NaiveDate> {
    if iso.is_empty() {
        return None;
    }
    NaiveDate::parse_from_str(iso, "%Y-%m-%d").ok()
}

/// Whole-day difference between two ISO dates (`to - from`). Returns
/// `None` if either date is missing or unparseable.
pub fn days_between(from_iso: &str, to_iso: &str) -> Option<i64> {
    let from = parse_iso_date(from_iso)?;
    let to = parse_iso_date(to_iso)?;
    Some((to - from).num_days())
}

/// Same as `days_between` but in tenths-of-a-week (rounded to one decimal).
pub fn weeks_between(from_iso: &str, to_iso: &str) -> Option<f64> {
    let days = days_between(from_iso, to_iso)? as f64;
    Some((days / 7.0 * 10.0).round() / 10.0)
}

/// Today's date as a YYYY-MM-DD string.
pub fn today_iso() -> String {
    chrono::Utc::now().date_naive().format("%Y-%m-%d").to_string()
}
