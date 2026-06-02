use chrono::NaiveDate;

/// AHA BLS adult compression rate (per minute).
pub const COMPRESSION_RATE_MIN: f64 = 100.0;
pub const COMPRESSION_RATE_MAX: f64 = 120.0;

/// AHA BLS adult compression depth (cm).
pub const COMPRESSION_DEPTH_MIN: f64 = 5.0;
pub const COMPRESSION_DEPTH_MAX: f64 = 6.0;

/// Slow time-to-first-shock threshold (seconds).
pub const SLOW_AED_SECONDS: f64 = 90.0;

/// Limit on non-critical deficiencies before overall Fail (>2 -> Fail).
pub const NON_CRITICAL_DEFICIENCY_LIMIT: usize = 2;

/// Critical-action rule IDs (any 'no' -> overall Fail).
pub const CRITICAL_RULE_IDS: &[&str] = &[
    "BLS-CC-RATE",
    "BLS-CC-DEPTH",
    "BLS-AB-CHEST-RISE",
    "BLS-AED-SAFE-SHOCK",
];

/// Is a measured compression rate within AHA BLS adult range?
pub fn compression_rate_in_range(rate: f64) -> bool {
    rate >= COMPRESSION_RATE_MIN && rate <= COMPRESSION_RATE_MAX
}

/// Is a measured compression depth within AHA BLS adult range?
pub fn compression_depth_in_range(depth: f64) -> bool {
    depth >= COMPRESSION_DEPTH_MIN && depth <= COMPRESSION_DEPTH_MAX
}

/// Friendly label for an outcome string.
pub fn outcome_label(outcome: &str) -> String {
    match outcome {
        "pass" => "Pass".to_string(),
        "fail" => "Fail".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the outcome badge.
pub fn outcome_class(outcome: &str) -> String {
    match outcome {
        "pass" => "outcome-pass".to_string(),
        "fail" => "outcome-fail".to_string(),
        _ => String::new(),
    }
}

/// Friendly label for a tri-state response.
pub fn tri_state_label(status: &str) -> String {
    match status {
        "yes" => "Demonstrated".to_string(),
        "no" => "Not yet".to_string(),
        "na" => "Not assessed".to_string(),
        _ => "\u{2014}".to_string(),
    }
}

/// Is a `YYYY-MM-DD` date in the past relative to today?
pub fn date_is_past(date_str: &str) -> bool {
    if date_str.trim().is_empty() {
        return false;
    }
    if let Ok(d) = NaiveDate::parse_from_str(date_str, "%Y-%m-%d") {
        let today = chrono::Utc::now().date_naive();
        return d < today;
    }
    false
}
