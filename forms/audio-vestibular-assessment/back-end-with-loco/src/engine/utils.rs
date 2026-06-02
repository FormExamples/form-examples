/// Display label for the WHO hearing-loss grade.
pub fn hearing_loss_grade_label(grade: &str) -> String {
    match grade {
        "normal" => "Normal hearing".to_string(),
        "mild" => "Mild hearing loss".to_string(),
        "moderate" => "Moderate hearing loss".to_string(),
        "moderately-severe" => "Moderately severe hearing loss".to_string(),
        "severe" => "Severe hearing loss".to_string(),
        "profound" => "Profound hearing loss".to_string(),
        _ => "Not assessed".to_string(),
    }
}

/// CSS class for a hearing-loss grade badge.
pub fn hearing_loss_grade_class(grade: &str) -> String {
    match grade {
        "normal" => "grade-normal".to_string(),
        "mild" => "grade-mild".to_string(),
        "moderate" => "grade-moderate".to_string(),
        "moderately-severe" => "grade-moderately-severe".to_string(),
        "severe" => "grade-severe".to_string(),
        "profound" => "grade-profound".to_string(),
        _ => "grade-unknown".to_string(),
    }
}

/// Display label for a DHI handicap level.
pub fn dhi_handicap_label(level: &str) -> String {
    match level {
        "no-handicap" => "No handicap".to_string(),
        "mild" => "Mild handicap".to_string(),
        "moderate" => "Moderate handicap".to_string(),
        "severe" => "Severe handicap".to_string(),
        _ => String::new(),
    }
}

/// CSS class for a DHI handicap badge.
pub fn dhi_handicap_class(level: &str) -> String {
    match level {
        "no-handicap" => "dhi-no-handicap".to_string(),
        "mild" => "dhi-mild".to_string(),
        "moderate" => "dhi-moderate".to_string(),
        "severe" => "dhi-severe".to_string(),
        _ => String::new(),
    }
}
