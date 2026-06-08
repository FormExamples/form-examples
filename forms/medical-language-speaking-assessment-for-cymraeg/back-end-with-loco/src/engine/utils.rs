//! Helper predicates and counters used by the grader.

use super::types::OetGrade;

/// Friendly label for a CEFR-mapped grade.
pub fn grade_label(grade: &str) -> String {
    match grade {
        "A" => "A — Expert user (CEFR C2)".to_string(),
        "B" => "B — Highly proficient, clinically safe (CEFR C1)".to_string(),
        "C+" => "C+ — Proficient, borderline above clinical threshold (CEFR B2+)".to_string(),
        "C" => "C — Competent, below typical clinical threshold (CEFR B2)".to_string(),
        "D" => "D — Modest, significant communication concerns (CEFR B1)".to_string(),
        "E" => "E — Limited, unsuitable for Welsh-medium clinical practice (CEFR A2 or below)"
            .to_string(),
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

/// Whether a grade is at or above the typical Welsh-medium clinical
/// threshold (Grade B / CEFR C1) per NHS Wales expectations.
pub fn is_at_or_above_clinical_threshold(grade: &str) -> bool {
    grade == "A" || grade == "B"
}

/// Round to 1 decimal place (for display totals).
pub fn round1(n: f64) -> f64 {
    (n * 10.0).round() / 10.0
}

/// Mean of two role-play scores. Returns None only when *both* are None.
/// If only one is provided, it is treated as the criterion mean.
pub fn mean_or_single(a: Option<i32>, b: Option<i32>) -> Option<f64> {
    match (a, b) {
        (None, None) => None,
        (None, Some(y)) => Some(y as f64),
        (Some(x), None) => Some(x as f64),
        (Some(x), Some(y)) => Some((x as f64 + y as f64) / 2.0),
    }
}

/// Map a 0-500 scaled score to a CEFR-mapped grade.
pub fn classify_scaled_score(score: i32) -> OetGrade {
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
