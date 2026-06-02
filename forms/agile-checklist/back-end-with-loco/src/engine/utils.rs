use std::collections::BTreeMap;

use super::types::{AssessmentData, Band, Maturity};

/// Round to two decimal places.
pub fn round2(n: f64) -> f64 {
    (n * 100.0).round() / 100.0
}

/// Capitalise the first character (ASCII).
pub fn capitalise(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
        None => String::new(),
    }
}

/// Map a section percentage to its band.
pub fn band_for(percent: Option<f64>) -> Band {
    match percent {
        None => Band::Unanswered,
        Some(p) if p >= 75.0 => Band::High,
        Some(p) if p >= 50.0 => Band::Mid,
        Some(_) => Band::Low,
    }
}

/// Map an overall percentage to a maturity level.
pub fn derive_maturity(overall_percent: Option<f64>) -> Maturity {
    match overall_percent {
        None => Maturity::InsufficientData,
        Some(p) if p >= 90.0 => Maturity::Optimising,
        Some(p) if p >= 75.0 => Maturity::Mature,
        Some(p) if p >= 50.0 => Maturity::Developing,
        Some(p) if p >= 25.0 => Maturity::Initial,
        Some(_) => Maturity::AdHoc,
    }
}

/// Convenience: check whether item `id` has been answered with `"no"`.
pub fn is_no(answers: &BTreeMap<String, String>, id: &str) -> bool {
    answers.get(id).map(String::as_str) == Some("no")
}

/// Read the assessment-data answers map (clone of the inner BTreeMap).
pub fn answers_of(data: &AssessmentData) -> &BTreeMap<String, String> {
    &data.answers
}

/// Display label for a maturity slug.
pub fn maturity_label(maturity: &str) -> String {
    match maturity {
        "optimising" => "OPTIMISING".to_string(),
        "mature" => "MATURE".to_string(),
        "developing" => "DEVELOPING".to_string(),
        "initial" => "INITIAL".to_string(),
        "ad-hoc" => "AD-HOC".to_string(),
        "insufficient-data" => "INSUFFICIENT DATA".to_string(),
        _ => format!("Status: {maturity}"),
    }
}
