// Acceptable physiologic / NPLQ ranges for the numeric inputs.
pub const SWIM_50M_MAX_SECONDS: f64 = 60.0; // NPLQ: 50 m in <= 60 s
pub const SWIM_200M_MAX_SECONDS: f64 = 360.0; // 6 min target for 200 m mixed strokes
pub const COMPRESSION_RATE_MIN: f64 = 100.0;
pub const COMPRESSION_RATE_MAX: f64 = 120.0;
pub const COMPRESSION_DEPTH_MIN: f64 = 5.0;
pub const COMPRESSION_DEPTH_MAX: f64 = 6.0;
pub const SLOW_AED_SECONDS: f64 = 90.0; // ILSF target time-to-first-shock
pub const SURFACE_DIVE_MIN_METRES: f64 = 1.5; // typical NPLQ pool dive depth

/// Critical-competency rule IDs (any failure -> overall Fail).
pub const CRITICAL_RULE_IDS: &[&str] = &[
    "LIFE-PF-50M-TIME",
    "LIFE-SCAN-PATTERN",
    "LIFE-RU-TOW",
    "LIFE-RU-EXTRICATE",
    "LIFE-SP-HEADSPLINT",
    "LIFE-SP-BOARD",
    "LIFE-CPR-COMPRESSIONS",
    "LIFE-CPR-AED-PROMPT",
];

pub fn swim50m_within_target(sec: Option<f64>) -> bool {
    matches!(sec, Some(s) if s > 0.0 && s <= SWIM_50M_MAX_SECONDS)
}

pub fn swim200m_within_target(sec: Option<f64>) -> bool {
    matches!(sec, Some(s) if s > 0.0 && s <= SWIM_200M_MAX_SECONDS)
}

pub fn compression_rate_in_range(rate: Option<f64>) -> bool {
    matches!(rate, Some(r) if r >= COMPRESSION_RATE_MIN && r <= COMPRESSION_RATE_MAX)
}

pub fn compression_depth_in_range(depth: Option<f64>) -> bool {
    matches!(depth, Some(d) if d >= COMPRESSION_DEPTH_MIN && d <= COMPRESSION_DEPTH_MAX)
}

pub fn surface_dive_depth_adequate(m: Option<f64>) -> bool {
    matches!(m, Some(v) if v >= SURFACE_DIVE_MIN_METRES)
}

/// Friendly label for an Outcome.
pub fn outcome_label(outcome: &str) -> String {
    match outcome {
        "pass" => "Pass".to_string(),
        "needs-development" => "Needs Development".to_string(),
        "fail" => "Fail".to_string(),
        _ => String::new(),
    }
}

/// Friendly label for a TriState response.
pub fn tri_state_label(status: &str) -> String {
    match status {
        "yes" => "Demonstrated".to_string(),
        "no" => "Not yet".to_string(),
        "na" => "Not assessed".to_string(),
        _ => "-".to_string(),
    }
}
