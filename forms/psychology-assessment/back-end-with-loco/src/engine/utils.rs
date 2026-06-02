use super::types::DassSeverity;

/// Display label for a DASS-21 severity category.
pub fn severity_label(severity: &str) -> String {
    match severity {
        "normal" => "Normal".to_string(),
        "mild" => "Mild".to_string(),
        "moderate" => "Moderate".to_string(),
        "severe" => "Severe".to_string(),
        "extremely-severe" => "Extremely Severe".to_string(),
        _ => String::new(),
    }
}

/// Classify the doubled DASS-21 Depression score (DASS-42 normative cutoffs).
pub fn classify_dass_depression(scaled: i32) -> DassSeverity {
    if scaled <= 9 {
        "normal".to_string()
    } else if scaled <= 13 {
        "mild".to_string()
    } else if scaled <= 20 {
        "moderate".to_string()
    } else if scaled <= 27 {
        "severe".to_string()
    } else {
        "extremely-severe".to_string()
    }
}

/// Classify the doubled DASS-21 Anxiety score (DASS-42 normative cutoffs).
pub fn classify_dass_anxiety(scaled: i32) -> DassSeverity {
    if scaled <= 7 {
        "normal".to_string()
    } else if scaled <= 9 {
        "mild".to_string()
    } else if scaled <= 14 {
        "moderate".to_string()
    } else if scaled <= 19 {
        "severe".to_string()
    } else {
        "extremely-severe".to_string()
    }
}

/// Classify the doubled DASS-21 Stress score (DASS-42 normative cutoffs).
pub fn classify_dass_stress(scaled: i32) -> DassSeverity {
    if scaled <= 14 {
        "normal".to_string()
    } else if scaled <= 18 {
        "mild".to_string()
    } else if scaled <= 25 {
        "moderate".to_string()
    } else if scaled <= 33 {
        "severe".to_string()
    } else {
        "extremely-severe".to_string()
    }
}
