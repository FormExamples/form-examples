//! Helper predicates and counters used by the grader.

use super::types::{AssessmentData, SeverityBand};

/// Return the patient's ESAS-r intensity for `key` clamped to 0-10, or 0 if
/// the item is unanswered. Mirrors the JS `esasValue(d, key)` helper.
pub fn esas_value(data: &AssessmentData, key: &str) -> i32 {
    let raw = esas_raw(data, key);
    match raw {
        Some(v) => v.clamp(0, 10),
        None => 0,
    }
}

/// Return the patient's raw ESAS-r intensity for `key`, or None if unanswered.
pub fn esas_raw(data: &AssessmentData, key: &str) -> Option<i32> {
    match key {
        "pain" => data.esasr_symptoms.pain,
        "tiredness" => data.esasr_symptoms.tiredness,
        "drowsiness" => data.esasr_symptoms.drowsiness,
        "nausea" => data.esasr_symptoms.nausea,
        "lackOfAppetite" => data.esasr_symptoms.lack_of_appetite,
        "shortnessOfBreath" => data.esasr_symptoms.shortness_of_breath,
        "depression" => data.esasr_symptoms.depression,
        "anxiety" => data.esasr_symptoms.anxiety,
        "wellbeing" => data.esasr_symptoms.wellbeing,
        "other" => data.esasr_symptoms.other,
        _ => None,
    }
}

/// Classify a numeric ESAS-r total (0-100) into a severity band.
/// Bands: None 0-10, Mild 11-30, Moderate 31-60, Severe 61-100.
pub fn classify_esas_total(total: i32) -> SeverityBand {
    if total <= 10 {
        "none".to_string()
    } else if total <= 30 {
        "mild".to_string()
    } else if total <= 60 {
        "moderate".to_string()
    } else {
        "severe".to_string()
    }
}

/// Friendly label for a severity band.
pub fn severity_band_label(band: &str) -> String {
    match band {
        "none" => "None / Minimal".to_string(),
        "mild" => "Mild".to_string(),
        "moderate" => "Moderate".to_string(),
        "severe" => "Severe".to_string(),
        _ => String::new(),
    }
}

/// Lowest non-None performance-status value (PPS or AKPS), or None if both
/// are unanswered. Mirrors the JS `lowestPerformanceStatus(d)` helper.
pub fn lowest_performance_status(data: &AssessmentData) -> Option<i32> {
    let mut lowest: Option<i32> = None;
    for v in [data.performance_status.pps_score, data.performance_status.akps_score] {
        if let Some(n) = v {
            lowest = Some(match lowest {
                Some(m) => m.min(n),
                None => n,
            });
        }
    }
    lowest
}
