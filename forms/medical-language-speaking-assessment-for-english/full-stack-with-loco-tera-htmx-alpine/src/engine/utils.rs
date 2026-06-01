//! Small helpers shared between the OET grader and the flagged-issues
//! detector. Ported verbatim from `front-end-form-with-html/js/`.

use super::types::OETGrade;

/// Friendly label for a numeric OET grade.
pub fn grade_label(grade: &str) -> String {
    match grade {
        "A" => "A \u{2014} Expert user".to_string(),
        "B" => "B \u{2014} Highly proficient (clinically safe)".to_string(),
        "C+" => "C+ \u{2014} Proficient (borderline above clinical threshold)".to_string(),
        "C" => "C \u{2014} Competent (below typical clinical threshold)".to_string(),
        "D" => "D \u{2014} Modest (significant communication concerns)".to_string(),
        "E" => "E \u{2014} Limited (unsuitable for clinical practice)".to_string(),
        _ => String::new(),
    }
}

/// CSS class hint for the grade badge.
pub fn grade_class(grade: &str) -> String {
    match grade {
        "A" => "grade-a".to_string(),
        "B" => "grade-b".to_string(),
        "C+" => "grade-c-plus".to_string(),
        "C" => "grade-c".to_string(),
        "D" => "grade-d".to_string(),
        "E" => "grade-e".to_string(),
        _ => String::new(),
    }
}

/// Whether a grade is at or above the typical clinical threshold (A or B).
pub fn is_at_or_above_clinical_threshold(grade: &OETGrade) -> bool {
    grade == "A" || grade == "B"
}

/// Map a 0-500 scaled score to an OET grade. Matches `classifyScaledScore`
/// in `oet-grader.js`.
pub fn classify_scaled_score(score: u32) -> OETGrade {
    if score >= 450 {
        "A".to_string()
    } else if score >= 350 {
        "B".to_string()
    } else if score >= 300 {
        "C+".to_string()
    } else if score >= 200 {
        "C".to_string()
    } else if score >= 100 {
        "D".to_string()
    } else {
        "E".to_string()
    }
}

/// Mean of two role-play scores. Returns `None` only when **both** are
/// `None`; otherwise returns the single rated value (or the mean).
pub fn mean_or_single(a: Option<f64>, b: Option<f64>) -> Option<f64> {
    match (a, b) {
        (None, None) => None,
        (None, Some(y)) => Some(y),
        (Some(x), None) => Some(x),
        (Some(x), Some(y)) => Some((x + y) / 2.0),
    }
}

/// Round to 1 decimal place (used for display totals).
pub fn round1(n: f64) -> f64 {
    (n * 10.0).round() / 10.0
}
