use super::types::{Outcome, SeverityGrade};

/// Friendly label for an audit outcome.
pub fn outcome_label(outcome: &str) -> String {
    match outcome {
        "compliant" => "Compliant".to_string(),
        "minor" => "Minor Findings".to_string(),
        "major" => "Major Findings".to_string(),
        "critical" => "Critical Findings".to_string(),
        _ => String::new(),
    }
}

/// CSS class for an outcome badge.
pub fn outcome_class(outcome: &str) -> String {
    match outcome {
        "compliant" => "outcome-compliant".to_string(),
        "minor" => "outcome-minor".to_string(),
        "major" => "outcome-major".to_string(),
        "critical" => "outcome-critical".to_string(),
        _ => String::new(),
    }
}

/// Map a severity grade (1..=4) to the equivalent finding-level slug.
pub fn grade_to_finding_level(grade: SeverityGrade) -> Outcome {
    if grade >= 4 {
        "critical".to_string()
    } else if grade == 3 {
        "major".to_string()
    } else if grade == 2 {
        "minor".to_string()
    } else {
        "compliant".to_string()
    }
}

/// Friendly label for a severity grade.
pub fn grade_label(grade: SeverityGrade) -> String {
    match grade {
        1 => "Compliant".to_string(),
        2 => "Minor".to_string(),
        3 => "Major".to_string(),
        4 => "Critical".to_string(),
        _ => String::new(),
    }
}

/// Recommended timeframe text per outcome.
pub fn action_timeframe(outcome: &str) -> String {
    match outcome {
        "critical" => "Immediate corrective action required".to_string(),
        "major" => "Action within 30 days".to_string(),
        "minor" => "Action within 90 days".to_string(),
        "compliant" => "No action required".to_string(),
        _ => String::new(),
    }
}
