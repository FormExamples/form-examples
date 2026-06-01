/// Display label for the overall priority level.
pub fn priority_level_label(level: &str) -> String {
    match level {
        "routine" => "Routine - Standard processing".to_string(),
        "urgent" => "Urgent - Requires prompt attention".to_string(),
        "emergency" => "Emergency - Immediate action required".to_string(),
        _ => format!("Priority: {level}"),
    }
}

/// CSS-class suffix for the overall priority level.
pub fn priority_level_class(level: &str) -> String {
    match level {
        "routine" => "priority-routine".to_string(),
        "urgent" => "priority-urgent".to_string(),
        "emergency" => "priority-emergency".to_string(),
        _ => String::new(),
    }
}
