//! Helper predicates and counters used by the grader.

/// Band ranking — `low` < `moderate` < `high` < `critical`.
pub fn band_rank(band: &str) -> u8 {
    match band {
        "low" => 0,
        "moderate" => 1,
        "high" => 2,
        "critical" => 3,
        _ => 0,
    }
}

/// Return the worst (highest-ranked) band from the slice.
pub fn max_band(bands: &[&str]) -> String {
    let mut worst: u8 = 0;
    for b in bands {
        let r = band_rank(b);
        if r > worst {
            worst = r;
        }
    }
    match worst {
        3 => "critical".to_string(),
        2 => "high".to_string(),
        1 => "moderate".to_string(),
        _ => "low".to_string(),
    }
}

/// Human label for the composite priority band.
pub fn composite_label(band: &str) -> String {
    match band {
        "low" => "Low".to_string(),
        "moderate" => "Moderate".to_string(),
        "high" => "High".to_string(),
        "critical" => "Critical".to_string(),
        other => other.to_string(),
    }
}

/// Format a frequency percentage value the same way the front-end does:
/// integers as `"42%"`, non-integers as `"42.50%"`.
pub fn format_frequency_percent(f: f64) -> String {
    if (f.fract()).abs() < f64::EPSILON {
        format!("{}%", f as i64)
    } else {
        format!("{:.2}%", f)
    }
}
