use super::types::AssessmentData;

/// True when a string contains a non-empty trimmed value.
pub fn is_filled(value: &str) -> bool {
    !value.trim().is_empty()
}

/// Numeric ordering for priority sort: urgent < high < medium < low.
pub fn priority_order(priority: &str) -> u32 {
    match priority {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 99,
    }
}

/// Human-readable label for a priority.
pub fn priority_label(priority: &str) -> &'static str {
    match priority {
        "urgent" => "Urgent",
        "high" => "High",
        "medium" => "Medium",
        "low" => "Low",
        _ => "",
    }
}

/// Count the number of Q2 mental health conditions marked "yes".
pub fn count_conditions(data: &AssessmentData) -> u32 {
    let c = &data.mental_health_conditions;
    let mut n: u32 = 0;
    if c.anxiety_depression_without_impairment == "yes" {
        n += 1;
    }
    if c.anxiety_depression_with_impairment == "yes" {
        n += 1;
    }
    if c.bipolar_affective_disorder == "yes" {
        n += 1;
    }
    if c.eating_disorder == "yes" {
        n += 1;
    }
    if c.ocd_or_ptsd == "yes" {
        n += 1;
    }
    if c.personality_disorder == "yes" {
        n += 1;
    }
    if c.schizophrenia_or_psychosis == "yes" {
        n += 1;
    }
    if c.other == "yes" {
        n += 1;
    }
    n
}
