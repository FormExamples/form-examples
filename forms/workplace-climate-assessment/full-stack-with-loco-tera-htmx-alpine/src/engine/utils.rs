use super::types::ClimateCategory;

/// Classify a 0-100 score into a ClimateCategory.
///   85-100  thriving
///   70-84   healthy
///   50-69   developing
///   25-49   strained
///    0-24   critical
pub fn classify_score(score: Option<f64>) -> ClimateCategory {
    match score {
        None => String::new(),
        Some(s) if s.is_nan() => String::new(),
        Some(s) if s >= 85.0 => "thriving".to_string(),
        Some(s) if s >= 70.0 => "healthy".to_string(),
        Some(s) if s >= 50.0 => "developing".to_string(),
        Some(s) if s >= 25.0 => "strained".to_string(),
        Some(_) => "critical".to_string(),
    }
}

/// Friendly label for a ClimateCategory.
pub fn category_label(cat: &str) -> String {
    match cat {
        "thriving" => "Thriving".to_string(),
        "healthy" => "Healthy".to_string(),
        "developing" => "Developing".to_string(),
        "strained" => "Strained".to_string(),
        "critical" => "Critical".to_string(),
        _ => "Unknown".to_string(),
    }
}

/// CSS class hint for the category badge.
pub fn category_class(cat: &str) -> String {
    match cat {
        "thriving" => "cat-thriving".to_string(),
        "healthy" => "cat-healthy".to_string(),
        "developing" => "cat-developing".to_string(),
        "strained" => "cat-strained".to_string(),
        "critical" => "cat-critical".to_string(),
        _ => String::new(),
    }
}

/// Severity rank for picking the "worst" category.
/// Higher rank = worse climate (critical = 4).
pub fn category_rank(cat: &str) -> i32 {
    match cat {
        "thriving" => 0,
        "healthy" => 1,
        "developing" => 2,
        "strained" => 3,
        "critical" => 4,
        _ => -1,
    }
}

/// Round to 2 decimal places.
pub fn round2(x: f64) -> f64 {
    (x * 100.0).round() / 100.0
}

/// Round to 1 decimal place.
pub fn round1(x: f64) -> f64 {
    (x * 10.0).round() / 10.0
}
