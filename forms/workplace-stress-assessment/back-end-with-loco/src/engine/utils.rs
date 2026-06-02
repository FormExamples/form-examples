use super::types::RiskLevel;

/// Friendly label for a RiskLevel.
pub fn risk_level_label(level: &str) -> String {
    match level {
        "low" => "Low concern".to_string(),
        "moderate" => "Moderate concern".to_string(),
        "high" => "High concern".to_string(),
        "very-high" => "Very high concern".to_string(),
        _ => "Unknown".to_string(),
    }
}

/// CSS-class hint for the risk badge.
pub fn risk_level_class(level: &str) -> String {
    match level {
        "low" => "risk-low".to_string(),
        "moderate" => "risk-moderate".to_string(),
        "high" => "risk-high".to_string(),
        "very-high" => "risk-very-high".to_string(),
        _ => String::new(),
    }
}

/// Numeric severity rank for choosing the worst domain (very-high = 3).
pub fn risk_level_rank(level: &str) -> i32 {
    match level {
        "low" => 0,
        "moderate" => 1,
        "high" => 2,
        "very-high" => 3,
        _ => -1,
    }
}

/// Pick the worse of two risk levels (returns the higher-rank one).
pub fn worse_risk(a: &RiskLevel, b: &RiskLevel) -> RiskLevel {
    if risk_level_rank(b) > risk_level_rank(a) {
        b.clone()
    } else {
        a.clone()
    }
}
