//! Helper predicates and counters used by the grader.

use super::clavien_dindo_rules::rule_by_grade;

/// Friendly label for a Clavien-Dindo grade key (e.g. "Grade IIIa").
pub fn grade_label(grade: &str) -> String {
    rule_by_grade(grade)
        .map(|r| r.label.to_string())
        .unwrap_or_default()
}

/// Short label (Roman numeral) for a Clavien-Dindo grade key (e.g. "IIIa").
pub fn grade_short_label(grade: &str) -> String {
    rule_by_grade(grade)
        .map(|r| r.short_label.to_string())
        .unwrap_or_default()
}

/// CSS class hint for the overall grade badge.
pub fn grade_badge_class(grade: &str) -> String {
    match grade {
        "grade-0" => "grade-0".to_string(),
        "grade-i" => "grade-i".to_string(),
        "grade-ii" => "grade-ii".to_string(),
        "grade-iiia" => "grade-iiia".to_string(),
        "grade-iiib" => "grade-iiib".to_string(),
        "grade-iva" => "grade-iva".to_string(),
        "grade-ivb" => "grade-ivb".to_string(),
        "grade-v" => "grade-v".to_string(),
        _ => String::new(),
    }
}

/// Numeric ordering: grade-0 = 0, grade-i = 1, ..., grade-v = 7.
pub fn grade_order(grade: &str) -> i32 {
    rule_by_grade(grade).map(|r| r.order).unwrap_or(-1)
}

/// Calculate procedure duration in minutes from HH:MM start and end times.
pub fn calculate_duration_minutes(start_time: &str, end_time: &str) -> Option<i32> {
    if start_time.is_empty() || end_time.is_empty() {
        return None;
    }
    let parse = |t: &str| -> Option<i32> {
        let mut parts = t.split(':');
        let h: i32 = parts.next()?.parse().ok()?;
        let m: i32 = parts.next()?.parse().ok()?;
        Some(h * 60 + m)
    };
    let s = parse(start_time)?;
    let e = parse(end_time)?;
    let mut diff = e - s;
    if diff < 0 {
        diff += 24 * 60;
    }
    Some(diff)
}
