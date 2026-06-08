//! Helper predicates and counters used by the grader.

use super::types::{ENpsClassification, ENpsValue, SatisfactionCategory};

/// Display label for a satisfaction category.
pub fn category_label(cat: &str) -> String {
    match cat {
        "excellent" => "Excellent".to_string(),
        "good" => "Good".to_string(),
        "satisfactory" => "Satisfactory".to_string(),
        "poor" => "Poor".to_string(),
        "very-poor" => "Very Poor".to_string(),
        _ => "Unknown".to_string(),
    }
}

/// CSS class hint for a satisfaction category badge.
pub fn category_class(cat: &str) -> String {
    match cat {
        "excellent" => "cat-excellent".to_string(),
        "good" => "cat-good".to_string(),
        "satisfactory" => "cat-satisfactory".to_string(),
        "poor" => "cat-poor".to_string(),
        "very-poor" => "cat-very-poor".to_string(),
        _ => String::new(),
    }
}

/// Classify a 0-100 score into a SatisfactionCategory.
///   85-100 → excellent
///   70-84  → good
///   50-69  → satisfactory
///   25-49  → poor
///    0-24  → very-poor
pub fn classify_score(score: Option<f64>) -> SatisfactionCategory {
    match score {
        None => String::new(),
        Some(s) if s.is_nan() => String::new(),
        Some(s) if s >= 85.0 => "excellent".to_string(),
        Some(s) if s >= 70.0 => "good".to_string(),
        Some(s) if s >= 50.0 => "satisfactory".to_string(),
        Some(s) if s >= 25.0 => "poor".to_string(),
        Some(_) => "very-poor".to_string(),
    }
}

/// Classify a raw eNPS 0-10 value.
///   9-10 → promoter
///   7-8  → passive
///   0-6  → detractor
pub fn classify_enps(value: ENpsValue) -> ENpsClassification {
    match value {
        None => String::new(),
        Some(v) if v >= 9 => "promoter".to_string(),
        Some(v) if v >= 7 => "passive".to_string(),
        Some(_) => "detractor".to_string(),
    }
}

/// Human-friendly domain label for use in flags and reports.
pub fn domain_label(key: &str) -> &'static str {
    match key {
        "workload" => "Workload & Work-Life Balance",
        "management" => "Management & Leadership",
        "growth" => "Growth & Development",
        "compensation" => "Compensation & Benefits",
        "culture" => "Culture & Inclusion",
        "environment" => "Environment & Resources",
        "recognition" => "Recognition & Engagement",
        "overall" => "Overall Experience",
        _ => "",
    }
}
